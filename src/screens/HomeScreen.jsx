import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import { formatINR } from '../utils/formatters';
import { CATEGORIES } from '../constants/initialData';
import { buildUpiLink } from '../utils/upi';

export default function HomeScreen() {
  const {
    data,
    metrics,
    setActiveTab,
    setNightlyOpen,
    dismissSampleNote,
    addExpense,
    updatePocketMoney
  } = useApp();

  const [pocketInput, setPocketInput] = useState('');
  const [editingPocket, setEditingPocket] = useState(false);
  const [quickAmount, setQuickAmount] = useState('');
  const [quickCategory, setQuickCategory] = useState('Food');
  const [showNightlyBanner, setShowNightlyBanner] = useState(false);

  // Check if current time is past reminder time
  useEffect(() => {
    const checkReminder = () => {
      const reminderTime = data.settings.reminderTime || '22:30';
      const [rHours, rMinutes] = reminderTime.split(':').map(Number);
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      if (currentHours > rHours || (currentHours === rHours && currentMinutes >= rMinutes)) {
        setShowNightlyBanner(true);
      }
    };
    checkReminder();
  }, [data.settings.reminderTime]);

  // Empty State: if pocket money is not set
  if (!metrics.hasPocketMoney) {
    return (
      <div className="screen-content">
        <GlassCard>
          <h2 className="title-2">Add your monthly pocket money to begin</h2>
          <p className="body-text text-secondary">
            Set your monthly pocket money from parents to start tracking expenses and planning your month.
          </p>
          <div style={{ marginTop: '12px' }}>
            <label className="caption text-secondary" style={{ display: 'block', marginBottom: '6px' }}>
              Monthly pocket money (₹)
            </label>
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 8000"
              value={pocketInput}
              onChange={(e) => setPocketInput(e.target.value)}
              autoFocus
            />
          </div>
          <button
            className="btn btn-filled"
            style={{ marginTop: '8px' }}
            onClick={() => {
              if (Number(pocketInput) > 0) {
                updatePocketMoney(Number(pocketInput));
              }
            }}
          >
            Set pocket money
          </button>
        </GlassCard>
      </div>
    );
  }

  // Today's spending calculation
  const todayStr = new Date().toISOString().split('T')[0];
  // If sample data is active, consider today's expenses from sample data (2026-11-15)
  const effectiveToday = data.settings.isSample ? '2026-11-15' : todayStr;
  const todayExpenses = data.expenses.filter((e) => e.date === effectiveToday);
  const todaySpent = todayExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // Categories spent today
  const todayCategories = Array.from(new Set(todayExpenses.map((e) => e.category)));

  // Last 4 payments
  const recentPayments = data.expenses.slice(0, 4);

  // Safe pace color
  const paceColor = metrics.isPaceTooHigh ? 'text-amber' : 'text-teal';

  const handleQuickSave = (e) => {
    e.preventDefault();
    if (!quickAmount || Number(quickAmount) <= 0) return;
    addExpense({
      amount: Number(quickAmount),
      name: 'Nightly check-in',
      category: quickCategory,
      type: 'Everyday',
      source: 'nightly'
    });
    setQuickAmount('');
    setShowNightlyBanner(false);
  };

  const handlePayChip = (appName) => {
    const isDesktop = window.innerWidth >= 600;
    const upiUrl = buildUpiLink({ note: `Pay with ${appName}` });
    if (isDesktop) {
      alert('Open this on your phone.');
    } else {
      window.location.href = upiUrl;
    }
  };

  return (
    <div className="screen-content">
      {/* Sample data dismissible note */}
      {data.settings.isSample && !data.settings.sampleNoteDismissed && (
        <div className="banner row-between" style={{ borderColor: 'rgba(239, 159, 39, 0.4)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span className="sample-badge">Sample</span>
            <p className="caption" style={{ marginTop: '4px' }}>
              This is sample data. Clear it in Settings.
            </p>
          </div>
          <button
            className="btn btn-plain"
            onClick={dismissSampleNote}
            style={{ fontSize: '13px', padding: '4px 8px' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Hero glass card */}
      <GlassCard isHero>
        <div className="row-between">
          <span className="caption text-secondary">Left to spend this month</span>
          {data.settings.isSample && <span className="sample-badge">Sample</span>}
        </div>

        <div className="hero-num">{formatINR(metrics.leftToSpend)}</div>

        {/* Days to go bar */}
        <div>
          <div className="row-between footnote text-secondary" style={{ marginBottom: '6px' }}>
            <span>{metrics.daysLeft} days to go</span>
            <span>{Math.round((metrics.daysPassed / metrics.daysInMonth) * 100)}% of month passed</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min(100, Math.round((metrics.daysPassed / metrics.daysInMonth) * 100))}%`,
                backgroundColor: 'var(--accent)'
              }}
            />
          </div>
        </div>

        {/* Safe per day & Your pace side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
          <div className="glass-card" style={{ padding: '12px', borderRadius: '16px' }}>
            <span className="caption text-secondary">Safe per day</span>
            <div className="headline" style={{ marginTop: '4px' }}>{formatINR(metrics.safePerDay)}</div>
          </div>
          <div className="glass-card" style={{ padding: '12px', borderRadius: '16px' }}>
            <span className="caption text-secondary">Your pace</span>
            <div className={`headline ${paceColor}`} style={{ marginTop: '4px' }}>
              {formatINR(metrics.pace)} / day
            </div>
          </div>
        </div>

        {/* Status line */}
        <div className="subhead" style={{ marginTop: '2px' }}>
          {metrics.isPaceTooHigh ? (
            <span className="text-amber">
              At this pace your spending money ends on day {metrics.moneyLastsUntilDay}, {metrics.earlyDays} days early.
            </span>
          ) : (
            <span className="text-teal">You are on track to last the month.</span>
          )}
        </div>
      </GlassCard>

      {/* Nightly check-in banner (Section 6.6) */}
      {showNightlyBanner && (
        <div className="banner">
          <div className="row-between">
            <span className="subhead">Anything you paid for today that was not picked up?</span>
            <button
              className="btn btn-plain"
              onClick={() => setShowNightlyBanner(false)}
              style={{ padding: '2px', minHeight: '32px' }}
            >
              ✕
            </button>
          </div>
          <div className="chips-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`chip ${quickCategory === cat ? 'selected' : ''}`}
                onClick={() => setQuickCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="number"
              className="input-field"
              placeholder="Amount (₹)"
              value={quickAmount}
              onChange={(e) => setQuickAmount(e.target.value)}
              style={{ minHeight: '40px' }}
            />
            <button className="btn btn-outlined" onClick={handleQuickSave} style={{ minHeight: '40px' }}>
              Save
            </button>
          </div>
        </div>
      )}

      {/* 2. Today card */}
      <GlassCard>
        <div className="row-between">
          <div>
            <span className="caption text-secondary">Today</span>
            <div className="headline" style={{ marginTop: '2px' }}>
              Today you spent {formatINR(todaySpent)}
            </div>
          </div>
          <button
            className="btn btn-outlined"
            onClick={() => setNightlyOpen(true)}
            style={{ fontSize: '13px', padding: '6px 12px', minHeight: '36px' }}
          >
            Add what we missed
          </button>
        </div>
        {todayCategories.length > 0 && (
          <div className="chips-wrap" style={{ marginTop: '4px' }}>
            {todayCategories.map((cat) => (
              <span key={cat} className="chip" style={{ cursor: 'default' }}>
                {cat}
              </span>
            ))}
          </div>
        )}
      </GlassCard>

      {/* 3. This week card (Tapping opens Insights) */}
      <GlassCard onClick={() => setActiveTab('insights')} style={{ cursor: 'pointer' }}>
        <div className="row-between">
          <span className="headline">This week</span>
          <span className="caption text-secondary">See insights →</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginTop: '8px' }}>
          {CATEGORIES.map((cat) => {
            const stat = metrics.categoryStats[cat] || { percentUsed: 0, statusColor: 'teal' };
            const barColor =
              stat.statusColor === 'red'
                ? 'var(--color-red)'
                : stat.statusColor === 'amber'
                ? 'var(--color-amber)'
                : 'var(--color-teal)';
            return (
              <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '100%',
                    height: '48px',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: `${Math.min(100, Math.max(10, stat.percentUsed))}%`,
                      backgroundColor: barColor,
                      borderRadius: '6px'
                    }}
                  />
                </div>
                <span className="caption text-secondary" style={{ fontSize: '11px', textAlign: 'center' }}>
                  {cat}
                </span>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* 4. Savings nudge card */}
      <GlassCard>
        <div className="caption text-secondary">Savings nudge</div>
        <p className="body-text">
          {metrics.isPaceTooHigh
            ? `Spend about ${formatINR(metrics.excessPace)} less a day to protect your ${formatINR(metrics.savings)} savings.`
            : `You can move ${formatINR(metrics.savings)} into a monthly plan on Groww.`}
        </p>
        <a
          href="https://groww.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outlined"
          style={{ width: 'fit-content', marginTop: '4px' }}
        >
          See a ₹500 monthly plan
        </a>
      </GlassCard>

      {/* 5. Recent payments */}
      <GlassCard>
        <div className="row-between">
          <span className="headline">Recent payments</span>
          {data.settings.isSample && <span className="sample-badge">Sample</span>}
        </div>
        {recentPayments.length === 0 ? (
          <p className="footnote text-secondary">No payments logged yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentPayments.map((exp) => (
              <div key={exp.id} className="row-between" style={{ paddingBottom: '6px', borderBottom: '0.5px solid var(--input-border)' }}>
                <div>
                  <div className="subhead">{exp.name}</div>
                  <div className="caption text-secondary">
                    {exp.category} • {exp.type}
                  </div>
                </div>
                <div className="subhead">{formatINR(exp.amount)}</div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* 6. Pay with row */}
      <GlassCard>
        <span className="caption text-secondary">Pay with</span>
        <div className="chips-wrap" style={{ marginTop: '2px' }}>
          <button className="chip" onClick={() => handlePayChip('GPay')}>
            GPay
          </button>
          <button className="chip" onClick={() => handlePayChip('PhonePe')}>
            PhonePe
          </button>
          <button className="chip" onClick={() => handlePayChip('Paytm')}>
            Paytm
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
