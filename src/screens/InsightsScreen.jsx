import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import { formatINR } from '../utils/formatters';
import { CATEGORIES } from '../constants/initialData';

export default function InsightsScreen() {
  const { data, metrics } = useApp();
  const [timeframe, setTimeframe] = useState('month'); // 'week' | 'month'

  // Filter expenses by timeframe
  // For 'week', filter last 7 days of expenses (or all if sample data)
  const expenses = timeframe === 'week' ? data.expenses.slice(0, 5) : data.expenses;

  const totalSpentTimeframe = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const budgetShareUsed = metrics.spendingBudget > 0
    ? Math.round((totalSpentTimeframe / metrics.spendingBudget) * 100)
    : 0;
  const monthSharePassed = Math.round((metrics.daysPassed / metrics.daysInMonth) * 100);

  // Category breakdown, biggest first
  const sortedCategories = [...CATEGORIES].map((cat) => {
    const catSpent = expenses
      .filter((e) => e.category === cat)
      .reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const stat = metrics.categoryStats[cat] || { statusText: 'On plan', statusColor: 'teal' };
    return {
      name: cat,
      spent: catSpent,
      statusText: stat.statusText,
      statusColor: stat.statusColor
    };
  }).sort((a, b) => b.spent - a.spent);

  // How payments were marked: Everyday, Luxury, Group
  const typeTotals = {
    Everyday: 0,
    Luxury: 0,
    Group: 0
  };

  expenses.forEach((e) => {
    const t = e.type || 'Everyday';
    if (typeTotals[t] !== undefined) {
      typeTotals[t] += Number(e.amount) || 0;
    } else {
      typeTotals.Everyday += Number(e.amount) || 0;
    }
  });

  // Biggest single payment
  const biggestPayment = expenses.reduce((max, e) => {
    return (Number(e.amount) > Number(max?.amount || 0)) ? e : max;
  }, null);

  return (
    <div className="screen-content">
      {/* Timeframe switch: This week / This month */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          className={`chip ${timeframe === 'week' ? 'selected' : ''}`}
          onClick={() => setTimeframe('week')}
        >
          This week
        </button>
        <button
          className={`chip ${timeframe === 'month' ? 'selected' : ''}`}
          onClick={() => setTimeframe('month')}
        >
          This month
        </button>
      </div>

      {/* Top card: Total spent, share of budget used, share of month passed */}
      <GlassCard>
        <span className="caption text-secondary">
          Total spent {timeframe === 'week' ? 'this week' : 'this month'}
        </span>
        <div className="hero-num" style={{ fontSize: '32px', lineHeight: '38px' }}>
          {formatINR(totalSpentTimeframe)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
          <div>
            <span className="caption text-secondary">Budget used</span>
            <div className="headline" style={{ marginTop: '2px' }}>{budgetShareUsed}%</div>
          </div>
          <div>
            <span className="caption text-secondary">Month passed</span>
            <div className="headline" style={{ marginTop: '2px' }}>{monthSharePassed}%</div>
          </div>
        </div>
      </GlassCard>

      {/* Category breakdown (biggest first) */}
      <GlassCard>
        <span className="headline">Spending by category</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
          {sortedCategories.map((cat) => (
            <div key={cat.name} className="row-between" style={{ paddingBottom: '8px', borderBottom: '0.5px solid var(--input-border)' }}>
              <div>
                <span className="subhead">{cat.name}</span>
                {/* Section 6.3 & Acceptance check 18: State facts only, no judging words */}
                <div className={`footnote text-${cat.statusColor}`} style={{ marginTop: '2px' }}>
                  {cat.statusText}
                </div>
              </div>
              <div className="subhead">{formatINR(cat.spent)}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* How payments were marked: Everyday, Luxury, Group */}
      <GlassCard>
        <span className="headline">How payments were marked</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
          <div className="row-between footnote">
            <span>Everyday</span>
            <span className="subhead">{formatINR(typeTotals.Everyday)}</span>
          </div>
          <div className="row-between footnote">
            <span>Luxury</span>
            <span className="subhead">{formatINR(typeTotals.Luxury)}</span>
          </div>
          <div className="row-between footnote">
            <span>Group</span>
            <span className="subhead">{formatINR(typeTotals.Group)}</span>
          </div>
        </div>
      </GlassCard>

      {/* Biggest single payment */}
      <GlassCard>
        <span className="headline">Biggest single payment</span>
        {biggestPayment ? (
          <div className="row-between" style={{ marginTop: '6px' }}>
            <div>
              <div className="subhead">{biggestPayment.name}</div>
              <div className="caption text-secondary">
                {biggestPayment.category} • {biggestPayment.type}
              </div>
            </div>
            <div className="headline">{formatINR(biggestPayment.amount)}</div>
          </div>
        ) : (
          <p className="footnote text-secondary" style={{ marginTop: '4px' }}>None recorded yet.</p>
        )}
      </GlassCard>
    </div>
  );
}
