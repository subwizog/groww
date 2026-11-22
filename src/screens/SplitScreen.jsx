import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import { formatINR } from '../utils/formatters';
import { CATEGORIES } from '../constants/initialData';
import { buildUpiLink } from '../utils/upi';

export default function SplitScreen() {
  const {
    data,
    addSplit,
    settleMember,
    addGroup,
    addMemberToGroup,
    removeMemberFromGroup
  } = useApp();

  // Form State
  const [selectedGroup, setSelectedGroup] = useState(data.groups[0]?.id || '');
  const [whatFor, setWhatFor] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('You'); // 'You' or member.id
  const [sharedWith, setSharedWith] = useState([]); // array of member ids
  const [studentCategory, setStudentCategory] = useState('Food');
  const [formError, setFormError] = useState('');
  const [upiToast, setUpiToast] = useState('');

  // Group manager state
  const [showGroupManager, setShowGroupManager] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberUpi, setNewMemberUpi] = useState('');

  const currentGroup = data.groups.find((g) => g.id === selectedGroup) || data.groups[0];

  // Initialize sharedWith when group changes (all on by default as per Section 6.4)
  React.useEffect(() => {
    if (currentGroup && currentGroup.members) {
      setSharedWith(currentGroup.members.map((m) => m.id));
    }
  }, [selectedGroup, data.groups]);

  const toggleMemberShare = (memberId) => {
    if (sharedWith.includes(memberId)) {
      setSharedWith(sharedWith.filter((id) => id !== memberId));
    } else {
      setSharedWith([...sharedWith, memberId]);
    }
  };

  const handleCreateSplit = (e) => {
    e.preventDefault();
    setFormError('');

    const res = addSplit({
      groupId: selectedGroup,
      whatFor,
      amount,
      paidBy,
      sharedWith,
      studentCategory
    });

    if (!res.success) {
      setFormError(res.error);
      return;
    }

    // Reset form
    setWhatFor('');
    setAmount('');
    if (currentGroup) {
      setSharedWith(currentGroup.members.map((m) => m.id));
    }
  };

  // Payment Link settlement handler
  const handleSettleOwed = (member, appName) => {
    const isDesktop = window.innerWidth >= 600;
    const upiLink = buildUpiLink({
      paymentId: member.paymentId,
      name: member.name,
      amount: Math.abs(member.balance),
      note: `Split payment to ${member.name}`
    });

    if (!member.paymentId) {
      setUpiToast('Add their payment ID to fill this in.');
      setTimeout(() => setUpiToast(''), 4000);
    }

    if (isDesktop) {
      alert('Open this on your phone.');
    } else {
      window.location.href = upiLink;
    }

    // Balance resets to zero as specified in Section 6.4
    settleMember(selectedGroup, member.id);
  };

  const handleMarkReceived = (member) => {
    settleMember(selectedGroup, member.id);
  };

  return (
    <div className="screen-content">
      {/* Toast message for UPI without payee */}
      {upiToast && (
        <div className="banner" style={{ borderColor: 'var(--accent)' }}>
          <span className="footnote">{upiToast}</span>
        </div>
      )}

      {/* Group selector tabs */}
      {data.groups.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {data.groups.map((grp) => (
            <button
              key={grp.id}
              className={`chip ${selectedGroup === grp.id ? 'selected' : ''}`}
              onClick={() => setSelectedGroup(grp.id)}
            >
              {grp.name}
            </button>
          ))}
          <button
            className="chip"
            onClick={() => setShowGroupManager(!showGroupManager)}
            style={{ borderStyle: 'dashed' }}
          >
            {showGroupManager ? 'Close manager' : '+ Groups'}
          </button>
        </div>
      )}

      {/* Group Manager modal/tile */}
      {showGroupManager && (
        <GlassCard>
          <span className="headline">Manage groups & friends</span>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="New group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              style={{ minHeight: '38px' }}
            />
            <button
              className="btn btn-outlined"
              onClick={() => {
                if (newGroupName.trim()) {
                  addGroup(newGroupName.trim());
                  setNewGroupName('');
                }
              }}
              style={{ minHeight: '38px' }}
            >
              Add group
            </button>
          </div>

          {currentGroup && (
            <div style={{ marginTop: '12px' }}>
              <span className="subhead">Add friend to {currentGroup.name}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Friend name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  style={{ minHeight: '38px' }}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Payment ID (e.g. name@upi)"
                  value={newMemberUpi}
                  onChange={(e) => setNewMemberUpi(e.target.value)}
                  style={{ minHeight: '38px' }}
                />
                <button
                  className="btn btn-outlined"
                  onClick={() => {
                    if (newMemberName.trim()) {
                      addMemberToGroup(currentGroup.id, newMemberName.trim(), newMemberUpi.trim());
                      setNewMemberName('');
                      setNewMemberUpi('');
                    }
                  }}
                  style={{ minHeight: '38px' }}
                >
                  Add friend
                </button>
              </div>
            </div>
          )}
        </GlassCard>
      )}

      {/* Current Group balances card */}
      {currentGroup && (
        <GlassCard>
          <div className="row-between">
            <span className="headline">{currentGroup.name}</span>
            {data.settings.isSample && <span className="sample-badge">Sample</span>}
          </div>

          {currentGroup.members.length === 0 ? (
            <p className="footnote text-secondary">No members yet. Add friends above.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
              {currentGroup.members.map((m) => {
                const bal = m.balance;
                let statusLabel = 'settled';
                if (bal > 0) statusLabel = `owes you ${formatINR(bal)}`;
                if (bal < 0) statusLabel = `you owe ${formatINR(Math.abs(bal))}`;

                return (
                  <div key={m.id} className="row-between" style={{ paddingBottom: '8px', borderBottom: '0.5px solid var(--input-border)' }}>
                    <div>
                      <div className="subhead">{m.name}</div>
                      <div className={`footnote ${bal > 0 ? 'text-teal' : bal < 0 ? 'text-amber' : 'text-secondary'}`}>
                        {statusLabel}
                      </div>
                    </div>

                    <div className="row-gap-8">
                      {bal < 0 && (
                        <>
                          <button
                            className="btn btn-outlined"
                            onClick={() => handleSettleOwed(m, 'GPay')}
                            style={{ minHeight: '34px', padding: '4px 8px', fontSize: '13px' }}
                          >
                            GPay
                          </button>
                          <button
                            className="btn btn-outlined"
                            onClick={() => handleSettleOwed(m, 'PhonePe')}
                            style={{ minHeight: '34px', padding: '4px 8px', fontSize: '13px' }}
                          >
                            PhonePe
                          </button>
                        </>
                      )}

                      {bal > 0 && (
                        <button
                          className="btn btn-outlined"
                          onClick={() => handleMarkReceived(m)}
                          style={{ minHeight: '34px', padding: '4px 8px', fontSize: '13px' }}
                        >
                          Mark received
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      )}

      {/* New Split Card */}
      {currentGroup && (
        <GlassCard>
          <span className="headline">New split</span>
          <form onSubmit={handleCreateSplit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
            <div>
              <label className="caption text-secondary" style={{ display: 'block', marginBottom: '4px' }}>
                Amount (₹)
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
              />
            </div>

            <div>
              <label className="caption text-secondary" style={{ display: 'block', marginBottom: '4px' }}>
                What for (optional)
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Dinner, cab"
                value={whatFor}
                onChange={(e) => setWhatFor(e.target.value)}
              />
            </div>

            <div>
              <label className="caption text-secondary" style={{ display: 'block', marginBottom: '4px' }}>
                Who paid
              </label>
              <div className="chips-wrap">
                <button
                  type="button"
                  className={`chip ${paidBy === 'You' ? 'selected' : ''}`}
                  onClick={() => setPaidBy('You')}
                >
                  You
                </button>
                {currentGroup.members.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    className={`chip ${paidBy === m.id ? 'selected' : ''}`}
                    onClick={() => setPaidBy(m.id)}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="caption text-secondary" style={{ display: 'block', marginBottom: '4px' }}>
                Who shared (chips)
              </label>
              <div className="chips-wrap">
                {currentGroup.members.map((m) => {
                  const isChecked = sharedWith.includes(m.id);
                  return (
                    <button
                      type="button"
                      key={m.id}
                      className={`chip ${isChecked ? 'selected' : ''}`}
                      onClick={() => toggleMemberShare(m.id)}
                    >
                      {isChecked ? '✓ ' : ''}{m.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="caption text-secondary" style={{ display: 'block', marginBottom: '4px' }}>
                Your share category
              </label>
              <div className="chips-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    className={`chip ${studentCategory === cat ? 'selected' : ''}`}
                    onClick={() => setStudentCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Error message under the form as per Section 6.4 */}
            {formError && (
              <p className="footnote text-red" style={{ marginTop: '2px' }}>
                {formError}
              </p>
            )}

            {/* At most one filled button per screen */}
            <button type="submit" className="btn btn-filled" style={{ marginTop: '6px' }}>
              Split expense
            </button>
          </form>
        </GlassCard>
      )}
    </div>
  );
}
