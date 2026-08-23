import { CurrencySymbol, Transaction } from '../types';

export function formatCurrency(amount: number, symbol: CurrencySymbol = '$'): string {
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${amount < 0 ? '-' : ''}${symbol}${formatted}`;
}

export function formatDateLabel(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return dateString;

  const targetDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const targetCheck = new Date(targetDate);
  targetCheck.setHours(0, 0, 0, 0);

  if (targetCheck.getTime() === today.getTime()) {
    return 'Today';
  }
  if (targetCheck.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }

  return targetDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatFullDate(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return dateString;

  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatMonthName(yearMonth: string): string {
  if (!yearMonth || yearMonth === 'all') return 'All Time';
  const [year, month] = yearMonth.split('-').map(Number);
  if (!year || !month) return yearMonth;

  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getCurrentYearMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getMonthList(transactions: Transaction[]): string[] {
  const months = new Set<string>();
  months.add(getCurrentYearMonth());
  
  transactions.forEach((tx) => {
    if (tx.date && tx.date.length >= 7) {
      months.add(tx.date.substring(0, 7));
    }
  });

  return Array.from(months).sort((a, b) => b.localeCompare(a));
}

export function calculateSummary(transactions: Transaction[], targetMonth: string = 'all') {
  const filtered = targetMonth === 'all'
    ? transactions
    : transactions.filter((t) => t.date.startsWith(targetMonth));

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryExpenses: Record<string, number> = {};
  const categoryIncomes: Record<string, number> = {};

  filtered.forEach((tx) => {
    const amt = typeof tx.amount === 'number' ? tx.amount : parseFloat(String(tx.amount)) || 0;
    if (tx.type === 'income') {
      totalIncome += amt;
      categoryIncomes[tx.category] = (categoryIncomes[tx.category] || 0) + amt;
    } else {
      totalExpense += amt;
      categoryExpenses[tx.category] = (categoryExpenses[tx.category] || 0) + amt;
    }
  });

  // Round values to 2 decimals to prevent floating point imprecision
  totalIncome = Math.round(totalIncome * 100) / 100;
  totalExpense = Math.round(totalExpense * 100) / 100;
  const netBalance = Math.round((totalIncome - totalExpense) * 100) / 100;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  // Days in month calculation for daily average
  let daysCount = 30;
  if (targetMonth !== 'all') {
    const [year, month] = targetMonth.split('-').map(Number);
    const now = new Date();
    const isCurrentMonth = now.getFullYear() === year && now.getMonth() + 1 === month;
    const isPastMonth = year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1);

    if (isCurrentMonth) {
      daysCount = Math.max(1, now.getDate());
    } else if (isPastMonth) {
      daysCount = new Date(year, month, 0).getDate();
    } else {
      // Future month
      daysCount = new Date(year, month, 0).getDate();
    }
  } else {
    // For 'all time', calculate active distinct days or default to total transaction dates count
    const distinctDates = new Set(filtered.map((t) => t.date));
    daysCount = Math.max(1, distinctDates.size);
  }

  const dailyAverageExpense = daysCount > 0 ? totalExpense / daysCount : 0;

  return {
    totalIncome,
    totalExpense,
    netBalance,
    savingsRate,
    dailyAverageExpense,
    categoryExpenses,
    categoryIncomes,
    transactionCount: filtered.length,
  };
}
