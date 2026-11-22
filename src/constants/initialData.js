export const CATEGORIES = ['Food', 'Travel', 'Friends', 'Shopping', 'Groceries'];

export const CUTOFFS = {
  high: 1.25,     // Above 1.25 -> red
  medium: 1.05,   // Above 1.05 -> amber
  low: 0.7        // Below 0.7 -> teal ("below plan"), otherwise teal ("on plan")
};

export const INITIAL_SAMPLE_DATA = {
  settings: {
    pocketMoney: 8000,
    theme: 'dark', // 'system' | 'dark' | 'light'
    reminderTime: '22:30',
    monthStart: '2026-11-01',
    isSample: true,
    sampleNoteDismissed: false
  },
  plans: {
    Food: 3200,
    Travel: 1000,
    Friends: 1000,
    Shopping: 800,
    Groceries: 600
  },
  expenses: [
    // Food
    { id: 'exp-1', amount: 900, name: 'Mess extra', category: 'Food', type: 'Everyday', date: '2026-11-12', source: 'manual' },
    { id: 'exp-2', amount: 240, name: 'Swiggy', category: 'Food', type: 'Everyday', date: '2026-11-13', source: 'message' },
    { id: 'exp-3', amount: 310, name: 'Zomato', category: 'Food', type: 'Everyday', date: '2026-11-14', source: 'message' },
    { id: 'exp-4', amount: 260, name: 'Cafe night', category: 'Food', type: 'Group', date: '2026-11-15', source: 'split' },
    // Travel
    { id: 'exp-5', amount: 420, name: 'Auto to station', category: 'Travel', type: 'Everyday', date: '2026-11-10', source: 'manual' },
    { id: 'exp-6', amount: 180, name: 'Rapido', category: 'Travel', type: 'Everyday', date: '2026-11-11', source: 'message' },
    // Friends
    { id: 'exp-7', amount: 700, name: 'Birthday gift', category: 'Friends', type: 'Luxury', date: '2026-11-09', source: 'manual' },
    // Shopping
    { id: 'exp-8', amount: 1100, name: 'Myntra tee', category: 'Shopping', type: 'Luxury', date: '2026-11-08', source: 'message' },
    // Groceries
    { id: 'exp-9', amount: 180, name: 'Blinkit', category: 'Groceries', type: 'Everyday', date: '2026-11-15', source: 'message' }
  ],
  groups: [
    {
      id: 'grp-1',
      name: 'Hostel gang',
      members: [
        { id: 'm-1', name: 'Rahul', paymentId: 'rahul@upi', balance: 450 }, // Rahul owes student 450
        { id: 'm-2', name: 'Aman', paymentId: '', balance: 200 },          // Aman owes student 200
        { id: 'm-3', name: 'Neha', paymentId: 'neha@upi', balance: -150 }   // Student owes Neha 150
      ]
    },
    {
      id: 'grp-2',
      name: 'Goa trip',
      members: [
        { id: 'm-4', name: 'Rahul', paymentId: 'rahul@upi', balance: 0 },   // Settled
        { id: 'm-5', name: 'Isha', paymentId: 'isha@upi', balance: 320 }    // Isha owes student 320
      ]
    }
  ],
  shopMemory: {
    swiggy: { category: 'Food', type: 'Everyday' },
    zomato: { category: 'Food', type: 'Everyday' },
    myntra: { category: 'Shopping', type: 'Luxury' },
    rapido: { category: 'Travel', type: 'Everyday' },
    blinkit: { category: 'Groceries', type: 'Everyday' }
  }
};
