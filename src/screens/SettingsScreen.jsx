import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import { formatINR } from '../utils/formatters';

export default function SettingsScreen() {
  const {
    data,
    setTheme,
    setReminderTime,
    updatePocketMoney,
    startNewMonth,
    resetSampleData,
    deleteAllData,
    setNightlyOpen
  } = useApp();

  const [pocketInput, setPocketInput] = useState(data.settings.pocketMoney.toString());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [savedNotice, setSavedNotice] = useState('');

  const handlePocketSubmit = (e) => {
    e.preventDefault();
    if (Number(pocketInput) > 0) {
      updatePocketMoney(Number(pocketInput));
      setSavedNotice('Pocket money updated.');
      setTimeout(() => setSavedNotice(''), 3000);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleTimeChange = (e) => {
    setReminderTime(e.target.value);
  };

  return (
    <div className="screen-content">
      {savedNotice && (
        <div className="banner" style={{ borderColor: 'var(--color-teal)' }}>
          <span className="footnote text-teal">{savedNotice}</span>
        </div>
      )}

      {/* Theme */}
      <GlassCard>
        <span className="headline">Theme</span>
        <div className="chips-wrap" style={{ marginTop: '4px' }}>
          {['system', 'dark', 'light'].map((t) => (
            <button
              key={t}
              className={`chip ${data.settings.theme === t ? 'selected' : ''}`}
              onClick={() => handleThemeChange(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Monthly Pocket Money */}
      <GlassCard>
        <span className="headline">Monthly pocket money</span>
        <form onSubmit={handlePocketSubmit} style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <input
            type="number"
            className="input-field"
            value={pocketInput}
            onChange={(e) => setPocketInput(e.target.value)}
            min="1"
          />
          <button type="submit" className="btn btn-outlined">
            Update
          </button>
        </form>
      </GlassCard>

      {/* Nightly check-in time */}
      <GlassCard>
        <div className="row-between">
          <span className="headline">Nightly check-in time</span>
          <button
            type="button"
            className="btn btn-outlined"
            onClick={() => setNightlyOpen(true)}
            style={{ fontSize: '13px', minHeight: '36px', padding: '4px 10px' }}
          >
            Preview the reminder
          </button>
        </div>
        <p className="caption text-secondary" style={{ marginTop: '2px' }}>
          When the app opens at or after this time, it prompts for missed expenses.
        </p>
        <input
          type="time"
          className="input-field"
          value={data.settings.reminderTime || '22:30'}
          onChange={handleTimeChange}
          style={{ width: 'fit-content', marginTop: '6px' }}
        />
      </GlassCard>

      {/* Data Management Actions */}
      <GlassCard>
        <span className="headline">Data management</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
          <button
            className="btn btn-outlined"
            onClick={() => {
              startNewMonth();
              setSavedNotice('New month started. Payments cleared.');
              setTimeout(() => setSavedNotice(''), 3000);
            }}
          >
            Start new month
          </button>

          <button
            className="btn btn-outlined"
            onClick={() => {
              resetSampleData();
              setSavedNotice('Sample data restored.');
              setTimeout(() => setSavedNotice(''), 3000);
            }}
          >
            Reset sample data
          </button>

          {!showDeleteConfirm ? (
            <button
              className="btn btn-outlined text-red"
              style={{ borderColor: 'rgba(226, 75, 74, 0.4)' }}
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete all my data
            </button>
          ) : (
            <div className="banner" style={{ borderColor: 'var(--color-red)' }}>
              <span className="footnote text-red">
                This will erase all your pocket money, plans, and payments. Are you sure?
              </span>
              <div className="row-between" style={{ marginTop: '6px' }}>
                <button
                  className="btn btn-plain text-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-filled text-red"
                  style={{ backgroundColor: 'var(--color-red)', color: '#FFFFFF' }}
                  onClick={() => {
                    deleteAllData();
                    setShowDeleteConfirm(false);
                  }}
                >
                  Confirm delete
                </button>
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Privacy Note */}
      <GlassCard>
        <span className="headline">Privacy</span>
        <p className="footnote text-secondary">
          Messages are read on this phone only. Nothing is uploaded to a server.
        </p>
      </GlassCard>

      {/* Link to Report PDF */}
      <GlassCard>
        <span className="headline">Product report</span>
        <p className="footnote text-secondary">
          Read the full CIRCLES framework product report for this app.
        </p>
        <a
          href="report.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outlined"
          style={{ width: 'fit-content', marginTop: '4px' }}
        >
          Open report.pdf
        </a>
      </GlassCard>
    </div>
  );
}
