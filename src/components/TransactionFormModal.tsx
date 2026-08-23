import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Calendar as CalendarIcon, 
  Tag, 
  CreditCard, 
  FileText, 
  AlertCircle,
  Check
} from 'lucide-react';
import { 
  CurrencySymbol, 
  ExpenseCategory, 
  IncomeCategory, 
  PaymentMethod, 
  Transaction, 
  TransactionType 
} from '../types';
import { 
  EXPENSE_CATEGORIES, 
  INCOME_CATEGORIES, 
  PAYMENT_METHODS 
} from '../data/categories';
import { getTodayDateString } from '../utils/formatters';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id' | 'createdAt'>, editingId?: string) => void;
  editingTransaction?: Transaction | null;
  currency: CurrencySymbol;
  initialType?: TransactionType;
}

const QUICK_AMOUNTS = [10, 25, 50, 100, 250, 500];

const COMMON_EXPENSE_NOTES = [
  'Grocery shopping',
  'Restaurant dinner',
  'Coffee & snacks',
  'Uber ride',
  'Electric & internet bill',
  'Online shopping',
  'Pharmacy / medicine',
  'Subscription payment',
];

const COMMON_INCOME_NOTES = [
  'Monthly salary',
  'Freelance project',
  'Investment dividend',
  'Gift from friend',
  'Cashback / refund',
];

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTransaction,
  currency,
  initialType = 'expense',
}) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('Food');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI / Bank Transfer');
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Sync when editingTransaction changes or modal opens
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setPaymentMethod(editingTransaction.paymentMethod);
      setNote(editingTransaction.note || '');
      setError(null);
    } else {
      setType(initialType);
      setAmount('');
      setCategory(initialType === 'expense' ? 'Food' : 'Salary');
      setDate(getTodayDateString());
      setPaymentMethod('UPI / Bank Transfer');
      setNote('');
      setError(null);
    }
  }, [editingTransaction, initialType, isOpen]);

  // If type switches, adjust default category if mismatched
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'expense' && !EXPENSE_CATEGORIES[category as ExpenseCategory]) {
      setCategory('Food');
    } else if (newType === 'income' && !INCOME_CATEGORIES[category as IncomeCategory]) {
      setCategory('Salary');
    }
  };

  const handleQuickAmount = (val: number) => {
    const current = parseFloat(amount) || 0;
    const next = Math.round((current + val) * 100) / 100;
    setAmount(next.toString());
  };

  const getYesterdayDateString = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const handleDatePreset = (preset: 'today' | 'yesterday') => {
    if (preset === 'yesterday') {
      setDate(getYesterdayDateString());
    } else {
      setDate(getTodayDateString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    const cleanAmount = Math.round(parsedAmount * 100) / 100;

    if (!category) {
      setError('Please select a category.');
      return;
    }

    if (!date) {
      setError('Please select a valid date.');
      return;
    }

    onSave(
      {
        type,
        amount: cleanAmount,
        category,
        date,
        note: note.trim(),
        paymentMethod,
      },
      editingTransaction ? editingTransaction.id : undefined
    );

    onClose();
  };

  if (!isOpen) return null;

  const currentCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal / Bottom Sheet */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col z-10 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
            </h3>
            <p className="text-xs text-slate-500">
              {editingTransaction ? 'Update details of this record' : 'Add your income or expense entry'}
            </p>
          </div>
          <button
            id="close-tx-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body with Scroll */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-4 space-y-5 flex-1">
          
          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Type Toggle: Expense vs Income */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                id="type-expense-btn"
                onClick={() => handleTypeChange('expense')}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  type === 'expense'
                    ? 'bg-white text-rose-600 shadow-xs ring-1 ring-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Expense</span>
              </button>

              <button
                type="button"
                id="type-income-btn"
                onClick={() => handleTypeChange('income')}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  type === 'income'
                    ? 'bg-white text-emerald-600 shadow-xs ring-1 ring-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Income</span>
              </button>
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Amount
            </label>
            <div className="relative rounded-2xl shadow-xs">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold text-xl pointer-events-none">
                {currency}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                id="transaction-amount-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xl sm:text-2xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-300"
                autoFocus={!editingTransaction}
              />
            </div>

            {/* Quick Increment Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200/60"
                >
                  +{currency}{val}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Category
              </label>
              <span className="text-[11px] font-medium text-slate-400">
                Selected: <strong className="text-slate-800">{category}</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {Object.entries(currentCategories).map(([key, catInfo]) => {
                const Icon = catInfo.icon;
                const isSelected = category === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${catInfo.bgColor} ${catInfo.textColor} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-800 truncate w-full">
                      {key}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker & Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Date
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="date"
                  required
                  id="transaction-date-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="button"
                onClick={() => handleDatePreset('today')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                  date === getTodayDateString()
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleDatePreset('yesterday')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                  date === getYesterdayDateString()
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                Yesterday
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Payment Method
            </label>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((pm) => {
                const Icon = pm.icon;
                const isSelected = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{pm.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note / Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Note / Description
            </label>
            <input
              type="text"
              id="transaction-note-input"
              placeholder="e.g. Weekly grocery stock, Dinner with client..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
            />

            {/* Quick Note suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(type === 'expense' ? COMMON_EXPENSE_NOTES : COMMON_INCOME_NOTES).slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setNote(suggestion)}
                  className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            id="save-transaction-btn"
            onClick={handleSubmit}
            className={`px-5 py-2.5 text-xs sm:text-sm font-bold text-white rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 ${
              type === 'expense'
                ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
                : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{editingTransaction ? 'Update Transaction' : 'Save Transaction'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
