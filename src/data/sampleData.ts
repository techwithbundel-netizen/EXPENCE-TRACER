import { Transaction } from '../types';

export function getInitialSampleTransactions(): Transaction[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  // Helper to format date offset in days
  const getDateStr = (dayOffset: number): string => {
    const d = new Date(now);
    d.setDate(d.getDate() - dayOffset);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  return [
    {
      id: 'tx-1',
      type: 'income',
      amount: 4500,
      category: 'Salary',
      date: getDateStr(1),
      note: 'Monthly salary from TechCorp',
      paymentMethod: 'UPI / Bank Transfer',
      createdAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'tx-2',
      type: 'expense',
      amount: 64.50,
      category: 'Food',
      date: getDateStr(0),
      note: 'Organic grocery store & snacks',
      paymentMethod: 'Credit Card',
      createdAt: Date.now() - 3600000 * 3,
    },
    {
      id: 'tx-3',
      type: 'expense',
      amount: 28.00,
      category: 'Travel',
      date: getDateStr(0),
      note: 'Uber ride downtown for meeting',
      paymentMethod: 'UPI / Bank Transfer',
      createdAt: Date.now() - 3600000 * 6,
    },
    {
      id: 'tx-4',
      type: 'expense',
      amount: 145.00,
      category: 'Bills',
      date: getDateStr(2),
      note: 'High-speed internet & electricity bill',
      paymentMethod: 'Debit Card',
      createdAt: Date.now() - 86400000 * 2,
    },
    {
      id: 'tx-5',
      type: 'expense',
      amount: 89.99,
      category: 'Shopping',
      date: getDateStr(3),
      note: 'Running shoes & sports socks',
      paymentMethod: 'Credit Card',
      createdAt: Date.now() - 86400000 * 3,
    },
    {
      id: 'tx-6',
      type: 'income',
      amount: 650.00,
      category: 'Freelance',
      date: getDateStr(4),
      note: 'Landing page UI design milestone',
      paymentMethod: 'UPI / Bank Transfer',
      createdAt: Date.now() - 86400000 * 4,
    },
    {
      id: 'tx-7',
      type: 'expense',
      amount: 49.00,
      category: 'Education',
      date: getDateStr(5),
      note: 'Web Dev & TypeScript Mastery Course',
      paymentMethod: 'Credit Card',
      createdAt: Date.now() - 86400000 * 5,
    },
    {
      id: 'tx-8',
      type: 'expense',
      amount: 75.00,
      category: 'Health',
      date: getDateStr(6),
      note: 'Dental routine checkup & cleaning',
      paymentMethod: 'Debit Card',
      createdAt: Date.now() - 86400000 * 6,
    },
    {
      id: 'tx-9',
      type: 'expense',
      amount: 35.20,
      category: 'Food',
      date: getDateStr(7),
      note: 'Dinner with friends at Italian bistro',
      paymentMethod: 'Cash',
      createdAt: Date.now() - 86400000 * 7,
    },
    {
      id: 'tx-10',
      type: 'expense',
      amount: 19.99,
      category: 'Other',
      date: getDateStr(8),
      note: 'Cloud storage subscription',
      paymentMethod: 'Credit Card',
      createdAt: Date.now() - 86400000 * 8,
    },
    {
      id: 'tx-11',
      type: 'income',
      amount: 120.00,
      category: 'Investment',
      date: getDateStr(9),
      note: 'Quarterly index dividend payout',
      paymentMethod: 'UPI / Bank Transfer',
      createdAt: Date.now() - 86400000 * 9,
    },
    {
      id: 'tx-12',
      type: 'expense',
      amount: 110.00,
      category: 'Travel',
      date: getDateStr(11),
      note: 'Monthly metro pass & train ticket',
      paymentMethod: 'Debit Card',
      createdAt: Date.now() - 86400000 * 11,
    }
  ];
}
