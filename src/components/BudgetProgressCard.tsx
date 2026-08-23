import React from 'react';
import { 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  Settings2,
  Calendar,
  Sparkles,
  TrendingDown
} from 'lucide-react';
import { BudgetConfig, CurrencySymbol } from '../types';
import { formatCurrency, formatMonthName, getCurrentYearMonth } from '../utils/formatters';
import { EXPENSE_CATEGORIES } from '../data/categories';

interface BudgetProgressCardProps {
  currentMonth: string;
  totalExpense: number;
  categoryExpenses: Record<string, number>;
  budget?: BudgetConfig;
  currency: CurrencySymbol;
  onOpenBudgetModal: () => void;
}

export const BudgetProgressCard: React.FC<BudgetProgressCardProps> = ({
  currentMonth,
  totalExpense,
  categoryExpenses,
  budget,
  currency,
  onOpenBudgetModal,
}) => {
  const isAllTime = currentMonth === 'all';
  const targetMonthlyBudget = budget?.monthlyTarget || 2500;
  const categoryBudgets = budget?.categoryBudgets || {};

  const budgetUsedPercent = Math.round((totalExpense / targetMonthlyBudget) * 100);
  const remainingBudget = targetMonthlyBudget - totalExpense;
  const isOverBudget = remainingBudget < 0;

  // Calculate days status in the selected month
  const now = new Date();
  const [year, month] = (isAllTime ? getCurrentYearMonth() : currentMonth).split('-').map(Number);
  const totalDaysInMonth = new Date(year, month, 0).getDate();
  const isCurrentMonth = !isAllTime && now.getMonth() + 1 === month && now.getFullYear() === year;
  const isPastMonth = !isAllTime && (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1));
  const isFutureMonth = !isAllTime && (year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth() + 1));

  let daysRemaining = 0;
  let daysLabel = '';

  if (isAllTime) {
    daysRemaining = Math.max(0, totalDaysInMonth - now.getDate());
    daysLabel = `${daysRemaining} days left this month`;
  } else if (isCurrentMonth) {
    daysRemaining = Math.max(0, totalDaysInMonth - now.getDate());
    daysLabel = daysRemaining === 0 ? 'Last day of month' : `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left in month`;
  } else if (isPastMonth) {
    daysRemaining = 0;
    daysLabel = 'Month ended (Completed)';
  } else if (isFutureMonth) {
    daysRemaining = totalDaysInMonth;
    daysLabel = `${daysRemaining} days in upcoming month`;
  }
  
  const recommendedDaily = daysRemaining > 0 && remainingBudget > 0 
    ? (remainingBudget / daysRemaining) 
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Monthly Budget Planner
            </h3>
            <p className="text-xs text-slate-500">
              {formatMonthName(currentMonth)} Target & Pace
            </p>
          </div>
        </div>

        <button
          id="configure-budget-btn"
          onClick={onOpenBudgetModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Set Budget</span>
        </button>
      </div>

      {/* Main Budget Progress Card */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div>
            <div className="text-xs font-medium text-slate-500">Total Spent</div>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(totalExpense, currency)}
              <span className="text-sm font-normal text-slate-500 ml-1.5">
                of {formatCurrency(targetMonthlyBudget, currency)}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
              isOverBudget
                ? 'bg-rose-100 text-rose-700'
                : budgetUsedPercent > 80
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isOverBudget ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {budgetUsedPercent}% (Over Limit)
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {budgetUsedPercent}% Used
                </>
              )}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isOverBudget
                ? 'bg-rose-500'
                : budgetUsedPercent > 80
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, budgetUsedPercent)}%` }}
          />
        </div>

        {/* Remaining & Pace Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{daysLabel}</span>
          </div>

          <div className="flex items-center justify-end gap-1.5 font-medium">
            {remainingBudget >= 0 ? (
              <span className="text-emerald-700">
                {formatCurrency(remainingBudget, currency)} remaining
              </span>
            ) : (
              <span className="text-rose-600">
                {formatCurrency(Math.abs(remainingBudget), currency)} overspent
              </span>
            )}
          </div>
        </div>

        {recommendedDaily > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200/80">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              Safe daily spending pace: <strong>{formatCurrency(recommendedDaily, currency)}/day</strong>
            </span>
          </div>
        )}
      </div>

      {/* Category Budgets Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Category Breakdown vs Budgets
          </h4>
          <span className="text-[11px] text-slate-400">
            {Object.keys(categoryExpenses).length} active categories
          </span>
        </div>

        <div className="space-y-2.5">
          {Object.entries(EXPENSE_CATEGORIES).map(([catKey, catInfo]) => {
            const spent = categoryExpenses[catKey] || 0;
            const catTarget = categoryBudgets[catKey] || 0;
            const percent = catTarget > 0 ? Math.round((spent / catTarget) * 100) : (spent > 0 ? 100 : 0);
            const Icon = catInfo.icon;

            return (
              <div
                key={catKey}
                className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors bg-white flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg ${catInfo.bgColor} ${catInfo.textColor} flex items-center justify-center`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-800">{catInfo.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {formatCurrency(spent, currency)}
                    </span>
                    {catTarget > 0 ? (
                      <span className="text-slate-400 text-[11px]">
                        / {formatCurrency(catTarget, currency)}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">no limit</span>
                    )}
                  </div>
                </div>

                {/* Mini progress bar */}
                {catTarget > 0 && (
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        percent > 100
                          ? 'bg-rose-500'
                          : percent > 80
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
