import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import { formatINR } from '../utils/formatters';
import { CATEGORIES } from '../constants/initialData';

export default function BudgetScreen() {
  const {
    data,
    metrics,
    adjustPlan,
    budgetError,
    updatePocketMoney
  } = useApp();

  const [editingPocket, setEditingPocket] = useState(false);
  const [pocketInput, setPocketInput] = useState(data.settings.pocketMoney.toString());
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSavePocket = (e) => {
    e.preventDefault();
    if (Number(pocketInput) > 0) {
      updatePocketMoney(Number(pocketInput));
      setEditingPocket(false);
    }
  };

  return (
    <div className="screen-content">
      {/* Top card: Monthly pocket money (tap to edit) */}
      <GlassCard onClick={() => !editingPocket && setEditingPocket(true)} style={{ cursor: 'pointer' }}>
        <div className="row-between">
          <span className="caption text-secondary">Monthly pocket money</span>
          <span className="caption text-secondary">{editingPocket ? 'Editing' : 'Tap to edit'}</span>
        </div>
        {editingPocket ? (
          <form
            onSubmit={handleSavePocket}
            onClick={(e) => e.stopPropagation()}
            style={{ display: 'flex', gap: '8px', marginTop: '6px' }}
          >
            <input
              type="number"
              className="input-field"
              value={pocketInput}
              onChange={(e) => setPocketInput(e.target.value)}
              autoFocus
              min="1"
            />
            {/* At most one filled button */}
            <button type="submit" className="btn btn-filled">
              Save
            </button>
          </form>
        ) : (
          <div className="hero-num" style={{ fontSize: '32px', lineHeight: '36px' }}>
            {formatINR(data.settings.pocketMoney)}
          </div>
        )}
      </GlassCard>

      {/* Validation banner: "That is more than your pocket money." */}
      {budgetError && (
        <div className="banner" style={{ borderColor: 'var(--color-red)' }}>
          <span className="footnote text-red">{budgetError}</span>
        </div>
      )}

      {/* Category cards */}
      {CATEGORIES.map((cat) => {
        const plan = data.plans[cat] || 0;
        const stat = metrics.categoryStats[cat] || {
          spent: 0,
          expectedPercent: 50,
          percentUsed: 0,
          statusColor: 'teal',
          statusText: 'On plan'
        };

        const barColor =
          stat.statusColor === 'red'
            ? 'var(--color-red)'
            : stat.statusColor === 'amber'
            ? 'var(--color-amber)'
            : 'var(--color-teal)';

        const isExpanded = selectedCategory === cat;
        const catExpenses = data.expenses.filter((e) => e.category === cat);

        return (
          <GlassCard
            key={cat}
            onClick={() => setSelectedCategory(isExpanded ? null : cat)}
            style={{ cursor: 'pointer' }}
          >
            <div className="row-between">
              <div>
                <span className="headline">{cat}</span>
                <div className="footnote text-secondary" style={{ marginTop: '2px' }}>
                  {formatINR(stat.spent)} of {formatINR(plan)}
                </div>
              </div>
              <div
                className="row-gap-8"
                onClick={(e) => e.stopPropagation()} // prevent expanding card when pressing buttons
              >
                <button
                  className="btn btn-outlined"
                  onClick={() => adjustPlan(cat, -100)}
                  style={{ minHeight: '36px', padding: '4px 10px', fontSize: '13px' }}
                  aria-label={`Decrease ${cat} plan by 100`}
                >
                  −100
                </button>
                <button
                  className="btn btn-outlined"
                  onClick={() => adjustPlan(cat, 100)}
                  style={{ minHeight: '36px', padding: '4px 10px', fontSize: '13px' }}
                  aria-label={`Increase ${cat} plan by 100`}
                >
                  +100
                </button>
              </div>
            </div>

            {/* Progress bar with day marker */}
            <div className="progress-bar-container" style={{ marginTop: '8px' }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${Math.min(100, stat.percentUsed)}%`,
                  backgroundColor: barColor
                }}
              />
              {/* Marker for where student should be by today */}
              <div
                className="progress-marker"
                style={{
                  left: `${Math.min(100, stat.expectedPercent)}%`
                }}
                title="Expected pace by today"
              />
            </div>

            <div className="row-between footnote" style={{ marginTop: '4px' }}>
              <span className={`text-${stat.statusColor}`}>{stat.statusText}</span>
              <span className="caption text-secondary">
                {isExpanded ? 'Hide payments ▲' : 'Show payments ▼'}
              </span>
            </div>

            {/* Expanded list of payments in this category */}
            {isExpanded && (
              <div
                style={{
                  marginTop: '10px',
                  paddingTop: '10px',
                  borderTop: '0.5px solid var(--input-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <span className="caption text-secondary">Payments in {cat}</span>
                {catExpenses.length === 0 ? (
                  <p className="caption text-secondary">No payments yet.</p>
                ) : (
                  catExpenses.map((exp) => (
                    <div key={exp.id} className="row-between footnote">
                      <span>{exp.name} ({exp.type})</span>
                      <span>{formatINR(exp.amount)}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </GlassCard>
        );
      })}

      {/* Savings card at the bottom */}
      <GlassCard>
        <span className="caption text-secondary">Monthly savings</span>
        <div className="hero-num" style={{ fontSize: '28px', lineHeight: '34px' }}>
          {formatINR(metrics.savings)}
        </div>
        <p className="footnote text-secondary">
          Pocket money minus sum of plans. Updates automatically.
        </p>
      </GlassCard>
    </div>
  );
}
