export type TransactionType = 'expense' | 'income';

export type ExpenseCategory = 
  | 'Food'
  | 'Travel'
  | 'Shopping'
  | 'Bills'
  | 'Education'
  | 'Health'
  | 'Other';

export type IncomeCategory =
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Gift'
  | 'Refund'
  | 'Other';

export type PaymentMethod = 
  | 'Cash'
  | 'Credit Card'
  | 'Debit Card'
  | 'UPI / Bank Transfer'
  | 'Digital Wallet';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  note: string;
  paymentMethod: PaymentMethod;
  createdAt: number;
}

export interface BudgetConfig {
  month: string; // YYYY-MM
  monthlyTarget: number;
  categoryBudgets?: Record<string, number>;
}

export type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

export interface FilterState {
  search: string;
  type: 'all' | 'expense' | 'income';
  category: string;
  paymentMethod: string;
  month: string; // YYYY-MM or 'all'
  sortBy: SortOption;
}

export type AppTab = 'dashboard' | 'analytics' | 'transactions' | 'budget';

export type CurrencySymbol = '$' | '₹' | '€' | '£' | '¥' | 'A$' | 'C$';
