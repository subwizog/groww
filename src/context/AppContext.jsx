import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_SAMPLE_DATA, CATEGORIES } from '../constants/initialData';
import { calculateBudgetMetrics } from '../utils/calculator';

const STORAGE_KEY = 'antigravity_pocket_money_store_v1';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Load initial state from LocalStorage or fall back to INITIAL_SAMPLE_DATA
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to read from localStorage', e);
    }
    return INITIAL_SAMPLE_DATA;
  });

  // Tab navigation state (Home, Budget, Insights, Split, Add, or Settings)
  // Sync with URL hash as requested in prompt: "#/home", etc.
  const getTabFromHash = () => {
    const hash = window.location.hash.replace('#/', '').toLowerCase();
    const validTabs = ['home', 'budget', 'insights', 'split', 'add', 'settings'];
    return validTabs.includes(hash) ? hash : 'home';
  };

  const [activeTab, setActiveTabState] = useState(getTabFromHash);
  const [prevTab, setPrevTab] = useState('home');
  const [nightlyOpen, setNightlyOpen] = useState(false);
  const [budgetError, setBudgetError] = useState('');

  // Save to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
  }, [data]);

  // Apply Theme to document root
  useEffect(() => {
    const theme = data.settings.theme || 'dark';
    if (theme === 'system') {
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [data.settings.theme]);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const tab = getTabFromHash();
      setActiveTabState(tab);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setActiveTab = (tab) => {
    if (activeTab !== 'settings') {
      setPrevTab(activeTab);
    }
    setActiveTabState(tab);
    window.location.hash = `#/${tab}`;
  };

  const toggleSettings = () => {
    if (activeTab === 'settings') {
      setActiveTab(prevTab || 'home');
    } else {
      setPrevTab(activeTab);
      setActiveTab('settings');
    }
  };

  // Add Expense
  const addExpense = ({ amount, name, category, type = 'Everyday', source = 'manual', date }) => {
    const today = date || new Date().toISOString().split('T')[0];
    const newExpense = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      amount: Math.round(Number(amount)),
      name: name || 'Expense',
      category: category || 'Food',
      type: type || 'Everyday',
      date: today,
      source
    };

    setData((prev) => ({
      ...prev,
      expenses: [newExpense, ...prev.expenses]
    }));
  };

  // Update Shop Memory
  const rememberShop = (shopName, category, type) => {
    if (!shopName || shopName === 'Unknown') return;
    setData((prev) => ({
      ...prev,
      shopMemory: {
        ...prev.shopMemory,
        [shopName.toLowerCase()]: { category, type }
      }
    }));
  };

  // Set Pocket Money
  const updatePocketMoney = (amount) => {
    const parsed = Math.max(0, Math.round(Number(amount)));
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        pocketMoney: parsed,
        isSample: false
      }
    }));
  };

  // Adjust Plan with Section 6.2 validation:
  // "If a change would push plans above pocket money, block it and show 'That is more than your pocket money.'"
  const adjustPlan = (category, delta) => {
    setBudgetError('');
    const currentPlan = data.plans[category] || 0;
    const newPlan = Math.max(0, currentPlan + delta);
    
    // Calculate new total plans
    const otherPlansSum = CATEGORIES
      .filter((c) => c !== category)
      .reduce((sum, c) => sum + (data.plans[c] || 0), 0);

    const newPlansTotal = otherPlansSum + newPlan;

    if (newPlansTotal > data.settings.pocketMoney) {
      setBudgetError('That is more than your pocket money.');
      return false;
    }

    setData((prev) => ({
      ...prev,
      plans: {
        ...prev.plans,
        [category]: newPlan
      }
    }));
    return true;
  };

  // Update Theme
  const setTheme = (theme) => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme
      }
    }));
  };

  // Update Nightly reminder time
  const setReminderTime = (time) => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        reminderTime: time
      }
    }));
  };

  // Dismiss sample note
  const dismissSampleNote = () => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        sampleNoteDismissed: true
      }
    }));
  };

  // Start new month: "keeps plans and clears payments"
  const startNewMonth = () => {
    setData((prev) => ({
      ...prev,
      expenses: [],
      settings: {
        ...prev.settings,
        monthStart: new Date().toISOString().split('T')[0],
        isSample: false
      }
    }));
  };

  // Reset sample data
  const resetSampleData = () => {
    setData(INITIAL_SAMPLE_DATA);
    setActiveTab('home');
  };

  // Delete all data with Section 6.7: "Delete all my data" with a confirm step
  // Returns to empty state (no pocket money)
  const deleteAllData = () => {
    setData({
      settings: {
        pocketMoney: 0,
        theme: 'dark',
        reminderTime: '22:30',
        monthStart: new Date().toISOString().split('T')[0],
        isSample: false,
        sampleNoteDismissed: true
      },
      plans: {
        Food: 0,
        Travel: 0,
        Friends: 0,
        Shopping: 0,
        Groceries: 0
      },
      expenses: [],
      groups: [],
      shopMemory: {}
    });
    setActiveTab('home');
  };

  // Add a Split (Section 6.4)
  const addSplit = ({ groupId, whatFor, amount, paidBy, sharedWith, studentCategory }) => {
    const numAmount = Math.round(Number(amount));
    if (numAmount <= 0) return { success: false, error: 'Enter an amount first' };
    if (!sharedWith || sharedWith.length === 0) return { success: false, error: 'Pick at least one person' };

    // Equal split rule:
    // Share is amount divided by (people shared plus the student).
    // If a friend paid and is not ticked, add them automatically.
    let peopleSet = new Set(sharedWith);
    if (paidBy !== 'You') {
      peopleSet.add(paidBy);
    }
    const totalPeople = peopleSet.size + 1; // friends + student
    const share = Math.round(numAmount / totalPeople);

    // Update group balances
    setData((prev) => {
      const updatedGroups = prev.groups.map((grp) => {
        if (grp.id !== groupId) return grp;

        const updatedMembers = grp.members.map((m) => {
          let bal = m.balance;
          if (paidBy === 'You') {
            // Student paid -> each ticked friend owes student their share
            if (peopleSet.has(m.id)) {
              bal += share;
            }
          } else if (paidBy === m.id) {
            // Friend paid -> student owes that friend student's share
            bal -= share;
          }
          return { ...m, balance: bal };
        });

        return { ...grp, members: updatedMembers };
      });

      return {
        ...prev,
        groups: updatedGroups
      };
    });

    // Student's own share is added to Insights as a payment typed Group
    addExpense({
      amount: share,
      name: whatFor ? `${whatFor} (Split)` : 'Group split',
      category: studentCategory || 'Food',
      type: 'Group',
      source: 'split'
    });

    return { success: true };
  };

  // Settle a member balance to 0
  const settleMember = (groupId, memberId) => {
    setData((prev) => ({
      ...prev,
      groups: prev.groups.map((grp) => {
        if (grp.id !== groupId) return grp;
        return {
          ...grp,
          members: grp.members.map((m) => {
            if (m.id === memberId) {
              return { ...m, balance: 0 };
            }
            return m;
          })
        };
      })
    }));
  };

  // Add group or members
  const addGroup = (name) => {
    const newGroup = {
      id: `grp-${Date.now()}`,
      name: name || 'New group',
      members: []
    };
    setData((prev) => ({
      ...prev,
      groups: [...prev.groups, newGroup]
    }));
  };

  const addMemberToGroup = (groupId, memberName, paymentId = '') => {
    setData((prev) => ({
      ...prev,
      groups: prev.groups.map((grp) => {
        if (grp.id !== groupId) return grp;
        return {
          ...grp,
          members: [
            ...grp.members,
            {
              id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              name: memberName,
              paymentId: paymentId || '',
              balance: 0
            }
          ]
        };
      })
    }));
  };

  const removeMemberFromGroup = (groupId, memberId) => {
    setData((prev) => ({
      ...prev,
      groups: prev.groups.map((grp) => {
        if (grp.id !== groupId) return grp;
        return {
          ...grp,
          members: grp.members.filter((m) => m.id !== memberId)
        };
      })
    }));
  };

  // Metrics
  const metrics = calculateBudgetMetrics(data);

  return (
    <AppContext.Provider
      value={{
        data,
        metrics,
        activeTab,
        setActiveTab,
        toggleSettings,
        addExpense,
        rememberShop,
        updatePocketMoney,
        adjustPlan,
        budgetError,
        setBudgetError,
        setTheme,
        setReminderTime,
        dismissSampleNote,
        startNewMonth,
        resetSampleData,
        deleteAllData,
        addSplit,
        settleMember,
        addGroup,
        addMemberToGroup,
        removeMemberFromGroup,
        nightlyOpen,
        setNightlyOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
