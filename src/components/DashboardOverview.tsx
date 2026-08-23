import React from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Wallet, 
  Percent, 
  Calendar,
  AlertCircle,
  Plus
} from 'lucide-react';
import { CurrencySymbol } from '../types';
import { formatCurrency, formatMonthName } from '../utils/formatters';

interface DashboardOverviewProps {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number;
  dailyAverageExpense: number;
  transactionCount: number;
  currency: CurrencySymbol;
  currentMonth: string;
  onOpenAddModal: (type?: 'expense' | 'income') => void;
  monthlyBudget?: number;
  onOpenBudgetModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  totalIncome,
  totalExpense,
  netBalance,
  savingsRate,
  dailyAverageExpense,
  transactionCount,
  currency,
  currentMonth,
  onOpenAddModal,
  monthlyBudget = 0,
  onOpenBudgetModal,
}) => {
  const isPositiveBalance = netBalance >= 0;
  const budgetUsedPercent = monthlyBudget > 0 ? Math.round((totalExpense / monthlyBudget) * 100) : 0;
  const isOverBudget = monthlyBudget > 0 && totalExpense > monthlyBudget;

  return (
    <div className="space-y-4">
      {/* Header with Monthly Title & Quick Action on Mobile */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {currentMonth === 'all' ? 'Financial Overview' : formatMonthName(currentMonth)}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {transactionCount} {transactionCount === 1 ? 'transaction' : 'transactions'} recorded
          </p>
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <button
            id="mobile-quick-add-btn"
            onClick={() => onOpenAddModal('expense')}
            className="flex items-center gap-1 bg-emerald-600 active:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Income */}
        <div 
          id="stat-total-income-card"
          className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-emerald-200 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Income
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
              {formatCurrency(totalIncome, currency)}
            </div>
            <button
              onClick={() => onOpenAddModal('income')}
              className="mt-2 text-[11px] font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
            >
              + Log income
            </button>
          </div>
        </div>

        {/* Total Expenses */}
        <div 
          id="stat-total-expenses-card"
          className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-rose-200 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Expenses
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
              {formatCurrency(totalExpense, currency)}
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
              <span>Avg {formatCurrency(dailyAverageExpense, currency)}/day</span>
            </div>
          </div>
        </div>

        {/* Net Remaining Balance */}
        <div 
          id="stat-net-balance-card"
          className={`rounded-2xl p-4 border shadow-xs transition-all flex flex-col justify-between ${
            isPositiveBalance 
              ? 'bg-white border-slate-200/80' 
              : 'bg-rose-50/50 border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Net Balance
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isPositiveBalance ? 'bg-blue-50 text-blue-600' : 'bg-rose-100 text-rose-700'
            }`}>
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className={`text-lg sm:text-2xl font-bold tracking-tight ${
              isPositiveBalance ? 'text-slate-900' : 'text-rose-600'
            }`}>
              {formatCurrency(netBalance, currency)}
            </div>
            <div className="mt-2 flex items-center gap-1">
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                isPositiveBalance ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {isPositiveBalance ? 'Positive cash flow' : 'Deficit'}
              </span>
            </div>
          </div>
        </div>

        {/* Savings Rate / Budget Preview */}
        <div 
          id="stat-savings-rate-card"
          className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Savings Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
              {savingsRate}%
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{savingsRate >= 20 ? 'Healthy savings' : 'Needs attention'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Budget Glance Banner (if active month) */}
      {monthlyBudget > 0 && (
        <div className={`rounded-2xl p-4 border transition-all ${
          isOverBudget
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : budgetUsedPercent >= 85
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              {isOverBudget ? (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              ) : (
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  budgetUsedPercent >= 85 ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
              )}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider opacity-75">
                  Monthly Budget Goal
                </div>
                <div className="text-sm font-semibold mt-0.5">
                  {formatCurrency(totalExpense, currency)} spent of {formatCurrency(monthlyBudget, currency)} budget ({budgetUsedPercent}%)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs font-medium">
                {monthlyBudget - totalExpense >= 0 ? (
                  <span><strong className="font-bold">{formatCurrency(monthlyBudget - totalExpense, currency)}</strong> left</span>
                ) : (
                  <span className="text-rose-700 font-bold">{formatCurrency(Math.abs(monthlyBudget - totalExpense), currency)} over budget</span>
                )}
              </div>
              <button
                id="edit-budget-banner-btn"
                onClick={onOpenBudgetModal}
                className="text-xs font-semibold px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
              >
                Adjust
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget
                  ? 'bg-rose-500'
                  : budgetUsedPercent >= 85
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, budgetUsedPercent)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
