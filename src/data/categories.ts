import {
  Utensils,
  Plane,
  ShoppingBag,
  Receipt,
  GraduationCap,
  HeartPulse,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  RotateCcw,
  Banknote,
  CreditCard,
  Building2,
  Smartphone,
  Wallet
} from 'lucide-react';
import React from 'react';
import { ExpenseCategory, IncomeCategory, PaymentMethod } from '../types';

export interface CategoryInfo {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string; // Tailwind text/bg color class prefix
  bgColor: string;
  textColor: string;
  borderColor: string;
  hexColor: string;
}

export const EXPENSE_CATEGORIES: Record<ExpenseCategory, CategoryInfo> = {
  Food: {
    id: 'Food',
    name: 'Food & Dining',
    icon: Utensils,
    color: 'amber',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    textColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-800',
    hexColor: '#f59e0b',
  },
  Travel: {
    id: 'Travel',
    name: 'Travel & Transport',
    icon: Plane,
    color: 'blue',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800',
    hexColor: '#3b82f6',
  },
  Shopping: {
    id: 'Shopping',
    name: 'Shopping',
    icon: ShoppingBag,
    color: 'rose',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30',
    textColor: 'text-rose-600 dark:text-rose-400',
    borderColor: 'border-rose-200 dark:border-rose-800',
    hexColor: '#f43f5e',
  },
  Bills: {
    id: 'Bills',
    name: 'Bills & Utilities',
    icon: Receipt,
    color: 'orange',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    textColor: 'text-orange-600 dark:text-orange-400',
    borderColor: 'border-orange-200 dark:border-orange-800',
    hexColor: '#ea580c',
  },
  Education: {
    id: 'Education',
    name: 'Education',
    icon: GraduationCap,
    color: 'indigo',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    hexColor: '#6366f1',
  },
  Health: {
    id: 'Health',
    name: 'Health & Medical',
    icon: HeartPulse,
    color: 'emerald',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    hexColor: '#10b981',
  },
  Other: {
    id: 'Other',
    name: 'Other Expense',
    icon: MoreHorizontal,
    color: 'slate',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
    textColor: 'text-slate-600 dark:text-slate-400',
    borderColor: 'border-slate-200 dark:border-slate-700',
    hexColor: '#64748b',
  },
};

export const INCOME_CATEGORIES: Record<IncomeCategory, CategoryInfo> = {
  Salary: {
    id: 'Salary',
    name: 'Salary',
    icon: Briefcase,
    color: 'emerald',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    hexColor: '#10b981',
  },
  Freelance: {
    id: 'Freelance',
    name: 'Freelance & Side Gig',
    icon: Laptop,
    color: 'cyan',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
    hexColor: '#06b6d4',
  },
  Investment: {
    id: 'Investment',
    name: 'Investment & Dividends',
    icon: TrendingUp,
    color: 'violet',
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
    textColor: 'text-violet-600 dark:text-violet-400',
    borderColor: 'border-violet-200 dark:border-violet-800',
    hexColor: '#8b5cf6',
  },
  Gift: {
    id: 'Gift',
    name: 'Gifts & Rewards',
    icon: Gift,
    color: 'pink',
    bgColor: 'bg-pink-50 dark:bg-pink-950/30',
    textColor: 'text-pink-600 dark:text-pink-400',
    borderColor: 'border-pink-200 dark:border-pink-800',
    hexColor: '#ec4899',
  },
  Refund: {
    id: 'Refund',
    name: 'Refunds & Cashback',
    icon: RotateCcw,
    color: 'teal',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
    textColor: 'text-teal-600 dark:text-teal-400',
    borderColor: 'border-teal-200 dark:border-teal-800',
    hexColor: '#14b8a6',
  },
  Other: {
    id: 'Other',
    name: 'Other Income',
    icon: MoreHorizontal,
    color: 'slate',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
    textColor: 'text-slate-600 dark:text-slate-400',
    borderColor: 'border-slate-200 dark:border-slate-700',
    hexColor: '#64748b',
  },
};

export interface PaymentMethodInfo {
  id: PaymentMethod;
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  shortName: string;
}

export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    id: 'UPI / Bank Transfer',
    name: 'UPI / Bank Transfer',
    shortName: 'UPI/Bank',
    icon: Building2,
  },
  {
    id: 'Credit Card',
    name: 'Credit Card',
    shortName: 'Credit Card',
    icon: CreditCard,
  },
  {
    id: 'Debit Card',
    name: 'Debit Card',
    shortName: 'Debit Card',
    icon: CreditCard,
  },
  {
    id: 'Cash',
    name: 'Cash',
    shortName: 'Cash',
    icon: Banknote,
  },
  {
    id: 'Digital Wallet',
    name: 'Digital Wallet',
    shortName: 'Wallet',
    icon: Smartphone,
  },
];

export function getCategoryInfo(category: string, type: 'expense' | 'income' = 'expense'): CategoryInfo {
  if (type === 'income') {
    return (
      INCOME_CATEGORIES[category as IncomeCategory] || {
        id: category,
        name: category,
        icon: TrendingUp,
        color: 'emerald',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
        hexColor: '#10b981',
      }
    );
  }

  return (
    EXPENSE_CATEGORIES[category as ExpenseCategory] || {
      id: category,
      name: category,
      icon: Wallet,
      color: 'slate',
      bgColor: 'bg-slate-100 dark:bg-slate-800',
      textColor: 'text-slate-600 dark:text-slate-400',
      borderColor: 'border-slate-200 dark:border-slate-700',
      hexColor: '#64748b',
    }
  );
}

export function getPaymentMethodInfo(method: PaymentMethod | string): PaymentMethodInfo {
  const found = PAYMENT_METHODS.find((m) => m.id === method);
  return (
    found || {
      id: 'UPI / Bank Transfer' as PaymentMethod,
      name: method || 'Payment',
      shortName: method || 'Payment',
      icon: Banknote,
    }
  );
}
