import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../constants/initialData';

export default function NightlyCheckinSheet() {
  const { nightlyOpen, setNightlyOpen, addExpense } = useApp();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');

  if (!nightlyOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    addExpense({
      amount: Number(amount),
      name: description.trim() || 'Nightly check-in',
      category,
      type: 'Everyday',
      source: 'nightly'
    });

    setAmount('');
    setDescription('');
    setNightlyOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setNightlyOpen(false)}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="row-between">
          <h2 className="title-2">Nightly check-in</h2>
          <button
            className="btn btn-plain"
            onClick={() => setNightlyOpen(false)}
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <p className="body-text text-secondary">
          Anything you paid for today that was not picked up?
        </p>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="caption text-secondary" style={{ display: 'block', marginBottom: '6px' }}>
              Amount (₹)
            </label>
            <input
              type="number"
              className="input-field"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
              required
              min="1"
            />
          </div>

          <div>
            <label className="caption text-secondary" style={{ display: 'block', marginBottom: '6px' }}>
              What for (optional)
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Chai, stationery"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="caption text-secondary" style={{ display: 'block', marginBottom: '6px' }}>
              Category
            </label>
            <div className="chips-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  className={`chip ${category === cat ? 'selected' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* At most one filled button */}
          <button type="submit" className="btn btn-filled" style={{ marginTop: '8px' }}>
            Save payment
          </button>
        </form>
      </div>
    </div>
  );
}
