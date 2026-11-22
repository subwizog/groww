import { CATEGORIES, CUTOFFS } from '../constants/initialData.js';

/**
 * Calculates all budget and pace metrics as per Section 8 and user directives.
 */
export function calculateBudgetMetrics({ settings, plans, expenses }) {
  // If pocket money is not set
  if (!settings.pocketMoney || settings.pocketMoney <= 0) {
    return {
      hasPocketMoney: false,
      spendingBudget: 0,
      savings: 0,
      totalSpent: 0,
      leftToSpend: 0,
      daysInMonth: 30,
      dayOfMonth: 15,
      daysLeft: 15,
      daysPassed: 15,
      safePerDay: 0,
      pace: 0,
      moneyLastsUntilDay: 0,
      earlyDays: 0,
      isPaceTooHigh: false,
      excessPace: 0,
      categoryStats: {}
    };
  }

  // 1. Spending budget = sum of the five category plans
  const spendingBudget = CATEGORIES.reduce((sum, cat) => sum + (Number(plans[cat]) || 0), 0);

  // 2. Savings = pocket money minus spending budget, never below zero
  const savings = Math.max(0, settings.pocketMoney - spendingBudget);

  // 3. Total spent = sum of all expenses
  const totalSpent = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  // 4. Left to spend = spending budget minus total spent
  const leftToSpend = spendingBudget - totalSpent;

  // 5. Days calculations:
  // Direct rule: "Use day 15 of 30 only while the sample data is on. Once it is cleared, take the day and the days in the month from the real date."
  let daysInMonth = 30;
  let dayOfMonth = 15;

  if (!settings.isSample) {
    const now = new Date();
    dayOfMonth = now.getDate();
    daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }

  // Days left = days in month minus today's date number
  const daysLeft = Math.max(0, daysInMonth - dayOfMonth);
  // Days passed = today's date number
  const daysPassed = Math.max(1, dayOfMonth);

  // 6. Safe per day = left to spend divided by days left (if daysLeft === 0, safe is leftToSpend)
  const safePerDay = daysLeft > 0 ? Math.round(leftToSpend / daysLeft) : Math.max(0, leftToSpend);

  // 7. Pace = total spent divided by days passed
  const pace = Math.round(totalSpent / daysPassed);

  // 8. Money lasts until day = floor of spending budget divided by pace
  const moneyLastsUntilDay = pace > 0 ? Math.floor(spendingBudget / pace) : daysInMonth;
  const earlyDays = Math.max(0, daysInMonth - moneyLastsUntilDay);
  const isPaceTooHigh = pace > safePerDay && daysLeft > 0;
  const excessPace = Math.max(0, pace - safePerDay);

  // 9. Category breakdown stats
  const categoryStats = {};
  for (const cat of CATEGORIES) {
    const plan = Number(plans[cat]) || 0;
    const catSpent = expenses
      .filter((e) => e.category === cat)
      .reduce((s, e) => s + (Number(e.amount) || 0), 0);

    // Expected by today for a category = its plan times days passed divided by days in month
    const expected = daysInMonth > 0 ? (plan * daysPassed) / daysInMonth : 0;
    const ratio = expected > 0 ? catSpent / expected : (catSpent > 0 ? 2 : 1);

    // Section 8 Pace status:
    // Above 1.25 -> red
    // Above 1.05 -> amber
    // Below 0.7 -> teal with the text "below plan"
    // Otherwise -> teal with "on plan"
    let statusColor = 'teal';
    let statusText = 'On plan';
    const diff = Math.round(Math.abs(catSpent - expected));

    if (ratio > CUTOFFS.high) {
      statusColor = 'red';
      statusText = `₹${diff.toLocaleString('en-IN')} above plan so far`;
    } else if (ratio > CUTOFFS.medium) {
      statusColor = 'amber';
      statusText = `₹${diff.toLocaleString('en-IN')} above plan so far`;
    } else if (ratio < CUTOFFS.low) {
      statusColor = 'teal';
      statusText = `₹${diff.toLocaleString('en-IN')} below plan so far`;
    } else {
      statusColor = 'teal';
      statusText = 'On plan';
    }

    categoryStats[cat] = {
      plan,
      spent: catSpent,
      expected: Math.round(expected),
      ratio,
      statusColor,
      statusText,
      percentUsed: plan > 0 ? Math.min(100, Math.round((catSpent / plan) * 100)) : 0,
      expectedPercent: daysInMonth > 0 ? Math.min(100, Math.round((daysPassed / daysInMonth) * 100)) : 0
    };
  }

  return {
    hasPocketMoney: true,
    spendingBudget,
    savings,
    totalSpent,
    leftToSpend,
    daysInMonth,
    dayOfMonth,
    daysLeft,
    daysPassed,
    safePerDay,
    pace,
    moneyLastsUntilDay,
    earlyDays,
    isPaceTooHigh,
    excessPace,
    categoryStats
  };
}
