import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  X, 
  Inbox, 
  Plus, 
  SlidersHorizontal,
  Calendar,
  Check
} from 'lucide-react';
import { CurrencySymbol, FilterState, SortOption, Transaction } from '../types';
import { TransactionItem } from './TransactionItem';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../data/categories';
import { formatCurrency, formatDateLabel, formatMonthName } from '../utils/formatters';

interface TransactionListProps {
  transactions: Transaction[];
  currentMonth: string;
  currency: CurrencySymbol;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onOpenAddModal: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  currentMonth,
  currency,
  onEdit,
  onDelete,
  onOpenAddModal,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Filter & Sort logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Month filter (if not 'all')
      if (currentMonth !== 'all' && !tx.date.startsWith(currentMonth)) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && tx.category !== categoryFilter) {
        return false;
      }

      // Payment Method filter
      if (paymentFilter !== 'all' && tx.paymentMethod !== paymentFilter) {
        return false;
      }

      // Search query (search in note, category, payment method, amount string)
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchesNote = (tx.note || '').toLowerCase().includes(query);
        const matchesCat = tx.category.toLowerCase().includes(query);
        const matchesPayment = tx.paymentMethod.toLowerCase().includes(query);
        const matchesAmount = tx.amount.toString().includes(query);

        if (!matchesNote && !matchesCat && !matchesPayment && !matchesAmount) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') {
        return b.date.localeCompare(a.date) || b.createdAt - a.createdAt;
      }
      if (sortBy === 'date-asc') {
        return a.date.localeCompare(b.date) || a.createdAt - b.createdAt;
      }
      if (sortBy === 'amount-desc') {
        return b.amount - a.amount;
      }
      if (sortBy === 'amount-asc') {
        return a.amount - b.amount;
      }
      return 0;
    });
  }, [transactions, currentMonth, typeFilter, categoryFilter, paymentFilter, search, sortBy]);

  // Group by Date for visually organized lists
  const groupedTransactions = useMemo(() => {
    const groups: { date: string; dateLabel: string; items: Transaction[]; totalDayExpense: number; totalDayIncome: number }[] = [];
    const dateMap = new Map<string, Transaction[]>();

    filteredTransactions.forEach((tx) => {
      const list = dateMap.get(tx.date) || [];
      list.push(tx);
      dateMap.set(tx.date, list);
    });

    dateMap.forEach((items, date) => {
      const totalDayExpense = items
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalDayIncome = items
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      groups.push({
        date,
        dateLabel: formatDateLabel(date),
        items,
        totalDayExpense,
        totalDayIncome,
      });
    });

    return groups;
  }, [filteredTransactions]);

  const activeFilterCount = (typeFilter !== 'all' ? 1 : 0) + 
    (categoryFilter !== 'all' ? 1 : 0) + 
    (paymentFilter !== 'all' ? 1 : 0) + 
    (search.trim() ? 1 : 0);

  const handleResetFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setPaymentFilter('all');
    setSortBy('date-desc');
  };

  return (
    <div className="space-y-4">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Transaction History
          </h3>
          <p className="text-xs text-slate-500">
            {filteredTransactions.length} of {transactions.length} entries shown
            {currentMonth !== 'all' && ` for ${formatMonthName(currentMonth)}`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="search-transactions-input"
              placeholder="Search notes, category, amount..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            id="filter-toggle-btn"
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all ${
              activeFilterCount > 0
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Chips & Controls Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        
        {/* Type Filter Buttons */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
          {(['all', 'expense', 'income'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                typeFilter === t
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t === 'all' ? 'All Types' : t === 'expense' ? 'Expenses' : 'Income'}
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="relative">
          <select
            id="sort-selector"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none pr-7"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
          <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Quick Clear Filter Link */}
        {activeFilterCount > 0 && (
          <button
            onClick={handleResetFilters}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 flex items-center gap-1 hover:underline"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Expanded Filter Panel */}
      {showFilterDrawer && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Detailed Filter Options
            </h4>
            <button
              onClick={() => setShowFilterDrawer(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Categories</option>
                <optgroup label="Expenses">
                  {Object.keys(EXPENSE_CATEGORIES).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
                <optgroup label="Income">
                  {Object.keys(INCOME_CATEGORIES).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Payment Method
              </label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Payment Methods</option>
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm.id} value={pm.id}>{pm.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Transaction List Feed */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800">
              No transactions found
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {activeFilterCount > 0
                ? 'Try adjusting or clearing your search and filters to find what you are looking for.'
                : 'You have no transactions recorded for this period yet.'}
            </p>
          </div>

          <div className="pt-2">
            {activeFilterCount > 0 ? (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              >
                Clear all filters
              </button>
            ) : (
              <button
                id="empty-state-add-btn"
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add first transaction</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedTransactions.map((group) => (
            <div key={group.date} className="space-y-2">
              
              {/* Date Header with Daily Summary */}
              <div className="flex items-center justify-between px-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{group.dateLabel}</span>
                  <span className="text-[11px] font-normal text-slate-400">({group.date})</span>
                </div>

                <div className="text-[11px] font-medium space-x-2">
                  {group.totalDayExpense > 0 && (
                    <span className="text-rose-600 font-mono">
                      -{formatCurrency(group.totalDayExpense, currency)}
                    </span>
                  )}
                  {group.totalDayIncome > 0 && (
                    <span className="text-emerald-600 font-mono">
                      +{formatCurrency(group.totalDayIncome, currency)}
                    </span>
                  )}
                </div>
              </div>

              {/* Items in date group */}
              <div className="space-y-2">
                {group.items.map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    currency={currency}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
