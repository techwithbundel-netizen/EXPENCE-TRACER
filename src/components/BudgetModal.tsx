import React, { useState, useEffect } from 'react';
import { X, Target, Check, AlertCircle, Sparkles } from 'lucide-react';
import { BudgetConfig, CurrencySymbol } from '../types';
import { EXPENSE_CATEGORIES } from '../data/categories';
import { formatMonthName, getCurrentYearMonth } from '../utils/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMonth: string;
  currentBudget?: BudgetConfig;
  currency: CurrencySymbol;
  onSaveBudget: (budget: BudgetConfig) => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  currentMonth,
  currentBudget,
  currency,
  onSaveBudget,
}) => {
  const [monthlyTarget, setMonthlyTarget] = useState<string>('2500');
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentBudget) {
      setMonthlyTarget(currentBudget.monthlyTarget.toString());
      const catObj: Record<string, string> = {};
      Object.entries(currentBudget.categoryBudgets || {}).forEach(([k, v]) => {
        catObj[k] = v ? v.toString() : '';
      });
      setCategoryBudgets(catObj);
    } else {
      setMonthlyTarget('2500');
      setCategoryBudgets({
        Food: '600',
        Bills: '400',
        Shopping: '350',
        Travel: '300',
        Health: '200',
        Education: '150',
        Other: '200',
      });
    }
  }, [currentBudget, isOpen]);

  if (!isOpen) return null;

  const handleCategoryChange = (categoryKey: string, val: string) => {
    setCategoryBudgets((prev) => ({
      ...prev,
      [categoryKey]: val,
    }));
  };

  const handleQuickPreset = (total: number) => {
    setMonthlyTarget(total.toString());
    // allocate standard splits
    setCategoryBudgets({
      Food: (total * 0.25).toFixed(0),
      Bills: (total * 0.20).toFixed(0),
      Shopping: (total * 0.15).toFixed(0),
      Travel: (total * 0.15).toFixed(0),
      Health: (total * 0.10).toFixed(0),
      Education: (total * 0.05).toFixed(0),
      Other: (total * 0.10).toFixed(0),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedTotal = parseFloat(monthlyTarget);
    if (isNaN(parsedTotal) || parsedTotal <= 0) {
      setError('Please provide a valid monthly budget target greater than 0.');
      return;
    }

    const cleanCatBudgets: Record<string, number> = {};
    Object.entries(categoryBudgets).forEach(([k, v]) => {
      const val = parseFloat(String(v));
      if (!isNaN(val) && val > 0) {
        cleanCatBudgets[k] = val;
      }
    });

    onSaveBudget({
      month: currentMonth === 'all' ? getCurrentYearMonth() : currentMonth,
      monthlyTarget: parsedTotal,
      categoryBudgets: cleanCatBudgets,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col z-10 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Monthly Budget Settings
              </h3>
              <p className="text-xs text-slate-500">
                Target for {formatMonthName(currentMonth)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-4 space-y-5 flex-1">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Overall Monthly Target */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Overall Monthly Spending Limit
            </label>
            <div className="relative rounded-xl shadow-xs">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-lg pointer-events-none">
                {currency}
              </span>
              <input
                type="number"
                min="1"
                step="10"
                required
                id="monthly-budget-target-input"
                placeholder="2500"
                value={monthlyTarget}
                onChange={(e) => setMonthlyTarget(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
              <span className="text-[11px] font-semibold text-slate-400">Quick presets:</span>
              {[1000, 2000, 3000, 5000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleQuickPreset(preset)}
                  className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                >
                  {currency}{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Category Budgets */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Category Spending Budgets (Optional)
              </label>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Target per category
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(EXPENSE_CATEGORIES).map(([catKey, catInfo]) => {
                const Icon = catInfo.icon;
                return (
                  <div
                    key={catKey}
                    className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-7 h-7 rounded-lg ${catInfo.bgColor} ${catInfo.textColor} flex items-center justify-center shrink-0`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {catKey}
                      </span>
                    </div>

                    <div className="relative w-24 shrink-0">
                      <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-slate-400 text-xs pointer-events-none">
                        {currency}
                      </span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={categoryBudgets[catKey] || ''}
                        onChange={(e) => handleCategoryChange(catKey, e.target.value)}
                        className="w-full pl-6 pr-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            id="save-budget-btn"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save Budget</span>
          </button>
        </div>

      </div>
    </div>
  );
};
