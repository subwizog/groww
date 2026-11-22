import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import { parseBankMessage } from '../utils/messageParser';
import { CATEGORIES } from '../constants/initialData';
import { formatINR } from '../utils/formatters';

const SAMPLE_MESSAGES = [
  'Rs.240.00 debited from A/c XX1234 on 12-Nov to SWIGGY via UPI. Ref 4821.',
  'INR 1,100 paid to MYNTRA on 10-Nov. Ref 9930.',
  'Rs.450 credited to A/c XX1234 on 11-Nov from RAHUL.'
];

export default function AddScreen() {
  const { data, addExpense, rememberShop, setActiveTab } = useApp();

  const [rawText, setRawText] = useState('');
  const [sampleIdx, setSampleIdx] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Parsed result card state
  const [showResult, setShowResult] = useState(false);
  const [amount, setAmount] = useState('');
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('Everyday'); // Everyday | Luxury | Group

  const handleUseSample = () => {
    const msg = SAMPLE_MESSAGES[sampleIdx % SAMPLE_MESSAGES.length];
    setRawText(msg);
    setSampleIdx(sampleIdx + 1);
    setErrorMessage('');
    setShowResult(false);
  };

  const handleReadMessage = () => {
    setErrorMessage('');
    const parsed = parseBankMessage(rawText, data.shopMemory);

    if (!parsed.success) {
      setErrorMessage(parsed.error);
      // Keep manual fields accessible if error occurs so student can still save
      if (!showResult) {
        setAmount('');
        setShopName('Manual entry');
        setCategory('Food');
        setType('Everyday');
      }
      return;
    }

    setAmount(parsed.amount.toString());
    setShopName(parsed.shopName);
    setCategory(parsed.category);
    setType(parsed.type);
    setShowResult(true);
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setErrorMessage('Enter a valid amount.');
      return;
    }

    addExpense({
      amount: Number(amount),
      name: shopName.trim() || 'Expense',
      category,
      type,
      source: 'message'
    });

    // Learning from messages: remember user choice per shop
    if (shopName && shopName !== 'Unknown' && shopName !== 'Manual entry') {
      rememberShop(shopName, category, type);
    }

    // Reset and return to Home
    setRawText('');
    setShowResult(false);
    setActiveTab('home');
  };

  return (
    <div className="screen-content">
      <GlassCard>
        <label htmlFor="bank-message-input" className="headline" style={{ display: 'block' }}>
          Paste a bank message
        </label>
        <p className="footnote text-secondary">
          Read on this phone only. Nothing is uploaded.
        </p>

        <textarea
          id="bank-message-input"
          className="input-field"
          rows="4"
          placeholder="Paste SMS or notification text here..."
          value={rawText}
          onChange={(e) => {
            setRawText(e.target.value);
            if (errorMessage) setErrorMessage('');
          }}
          style={{ resize: 'vertical' }}
        />

        <div className="row-between" style={{ marginTop: '4px' }}>
          <button
            type="button"
            className="btn btn-outlined"
            onClick={handleUseSample}
          >
            Use sample message
          </button>
          {/* Exactly one filled button per screen */}
          <button
            type="button"
            className={`btn ${showResult ? 'btn-outlined' : 'btn-filled'}`}
            onClick={handleReadMessage}
          >
            Read message
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="banner" style={{ borderColor: 'var(--color-red)', marginTop: '4px' }}>
            <span className="footnote text-red">{errorMessage}</span>
          </div>
        )}
      </GlassCard>

      {/* Result Card: editable fields */}
      {showResult && (
        <GlassCard>
          <span className="headline">Confirm payment</span>

          <form onSubmit={handleSaveExpense} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label className="caption text-secondary" style={{ display: 'block', marginBottom: '4px' }}>
                Amount (₹)
              </label>
              <input
                type="number"
                className="input-field"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
              />
            </div>

            <div>
              <label className="caption text-secondary" style={{ display: 'block', marginBottom: '4px' }}>
                Shop or place
              </label>
              <input
                type="text"
                className="input-field"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
              />
            </div>

            <div>
              <label className="caption text-secondary" style={{ display: 'block', marginBottom: '4px' }}>
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

            <div>
              <label className="caption text-secondary" style={{ display: 'block', marginBottom: '4px' }}>
                Type
              </label>
              <div className="chips-wrap">
                {['Everyday', 'Luxury', 'Group'].map((t) => (
                  <button
                    type="button"
                    key={t}
                    className={`chip ${type === t ? 'selected' : ''}`}
                    onClick={() => setType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Exactly one filled button */}
            <button type="submit" className="btn btn-filled" style={{ marginTop: '8px' }}>
              Save expense
            </button>
          </form>
        </GlassCard>
      )}
    </div>
  );
}
