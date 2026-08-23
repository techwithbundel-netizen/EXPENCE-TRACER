import { BudgetConfig, CurrencySymbol, Transaction } from '../types';
import { getInitialSampleTransactions } from '../data/sampleData';
import { getCurrentYearMonth } from './formatters';

const STORAGE_KEYS = {
  TRANSACTIONS: 'expense_tracker_transactions_v1',
  BUDGETS: 'expense_tracker_budgets_v1',
  CURRENCY: 'expense_tracker_currency_v1',
  THEME: 'expense_tracker_theme_v1',
};

export function loadTransactions(): Transaction[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!data) {
      const initial = getInitialSampleTransactions();
      saveTransactions(initial);
      return initial;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    // If empty array saved by user, return empty
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return getInitialSampleTransactions();
  } catch (err) {
    console.error('Error loading transactions from localStorage:', err);
    return getInitialSampleTransactions();
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (err) {
    console.error('Error saving transactions to localStorage:', err);
  }
}

export function loadBudgets(): Record<string, BudgetConfig> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (!data) {
      const currentMonth = getCurrentYearMonth();
      const defaultBudget: Record<string, BudgetConfig> = {
        [currentMonth]: {
          month: currentMonth,
          monthlyTarget: 2500,
          categoryBudgets: {
            Food: 600,
            Bills: 400,
            Shopping: 350,
            Travel: 300,
            Health: 200,
            Education: 150,
            Other: 200,
          },
        },
      };
      saveBudgets(defaultBudget);
      return defaultBudget;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading budgets from localStorage:', err);
    return {};
  }
}

export function saveBudgets(budgets: Record<string, BudgetConfig>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  } catch (err) {
    console.error('Error saving budgets to localStorage:', err);
  }
}

export function loadCurrency(): CurrencySymbol {
  try {
    return (localStorage.getItem(STORAGE_KEYS.CURRENCY) as CurrencySymbol) || '$';
  } catch {
    return '$';
  }
}

export function saveCurrency(symbol: CurrencySymbol): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, symbol);
  } catch (err) {
    console.error('Error saving currency:', err);
  }
}

export function exportTransactionsToCSV(transactions: Transaction[]): void {
  const headers = ['ID', 'Type', 'Amount', 'Category', 'Date', 'Note', 'Payment Method'];
  const rows = transactions.map((tx) => [
    tx.id,
    tx.type,
    tx.amount.toFixed(2),
    `"${tx.category.replace(/"/g, '""')}"`,
    tx.date,
    `"${(tx.note || '').replace(/"/g, '""')}"`,
    `"${tx.paymentMethod.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `expense_tracker_export_${getCurrentYearMonth()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportBackupJSON(transactions: Transaction[], budgets: Record<string, BudgetConfig>): void {
  const backup = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    transactions,
    budgets,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `expense_tracker_backup_${getCurrentYearMonth()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function resetToSampleData(): { transactions: Transaction[]; budgets: Record<string, BudgetConfig> } {
  const sampleTx = getInitialSampleTransactions();
  const currentMonth = getCurrentYearMonth();
  const defaultBudget: Record<string, BudgetConfig> = {
    [currentMonth]: {
      month: currentMonth,
      monthlyTarget: 2500,
      categoryBudgets: {
        Food: 600,
        Bills: 400,
        Shopping: 350,
        Travel: 300,
        Health: 200,
        Education: 150,
        Other: 200,
      },
    },
  };
  saveTransactions(sampleTx);
  saveBudgets(defaultBudget);
  return { transactions: sampleTx, budgets: defaultBudget };
}
