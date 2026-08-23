import React, { useState } from 'react';
import { 
  Plus, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  Coins,
  Receipt
} from 'lucide-react';
import { CurrencySymbol } from '../types';
import { formatMonthName, getCurrentYearMonth } from '../utils/formatters';

interface NavbarProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  availableMonths: string[];
  currency: CurrencySymbol;
  onCurrencyChange: (symbol: CurrencySymbol) => void;
  onOpenAddModal: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
  onResetData: () => void;
  onClearAll: () => void;
}

const CURRENCIES: { symbol: CurrencySymbol; name: string }[] = [
  { symbol: '$', name: 'USD ($)' },
  { symbol: '₹', name: 'INR (₹)' },
  { symbol: '€', name: 'EUR (€)' },
  { symbol: '£', name: 'GBP (£)' },
  { symbol: '¥', name: 'JPY (¥)' },
  { symbol: 'A$', name: 'AUD (A$)' },
  { symbol: 'C$', name: 'CAD (C$)' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentMonth,
  onMonthChange,
  availableMonths,
  currency,
  onCurrencyChange,
  onOpenAddModal,
  onExportCSV,
  onExportJSON,
  onImportJSON,
  onResetData,
  onClearAll,
}) => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Month navigation helpers
  const handlePrevMonth = () => {
    if (currentMonth === 'all') {
      onMonthChange(getCurrentYearMonth());
      return;
    }
    const [y, m] = currentMonth.split('-').map(Number);
    const d = new Date(y, m - 2, 1);
    const prev = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(prev);
  };

  const handleNextMonth = () => {
    if (currentMonth === 'all') {
      onMonthChange(getCurrentYearMonth());
      return;
    }
    const [y, m] = currentMonth.split('-').map(Number);
    const d = new Date(y, m, 1);
    const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(next);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
      e.target.value = '';
    }
  };

  const displayMonths = React.useMemo(() => {
    const set = new Set<string>(availableMonths);
    const thisMonth = getCurrentYearMonth();
    set.add(thisMonth);
    if (currentMonth && currentMonth !== 'all') {
      set.add(currentMonth);
    }
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [availableMonths, currentMonth]);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Logo and App Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                Expense Tracker
              </h1>
              <p className="text-xs text-slate-600 hidden sm:block">
                Smart Money & Budgeting
              </p>
            </div>
          </div>

          {/* Month Switcher Controls */}
          <div className="flex items-center bg-slate-100/90 rounded-xl p-1 border border-slate-200/80">
            <button
              id="prev-month-btn"
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
              title="Previous Month"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="relative">
              <select
                id="month-selector"
                value={currentMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 px-2 py-1 cursor-pointer focus:outline-none appearance-none pr-6 text-center"
              >
                <option value={getCurrentYearMonth()}>This Month ({formatMonthName(getCurrentYearMonth())})</option>
                {displayMonths
                  .filter((m) => m !== getCurrentYearMonth())
                  .map((m) => (
                    <option key={m} value={m}>
                      {formatMonthName(m)}
                    </option>
                  ))}
                <option value="all">All Time History</option>
              </select>
              <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                ▼
              </span>
            </div>

            <button
              id="next-month-btn"
              onClick={handleNextMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
              title="Next Month"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Actions & Settings Right Side */}
          <div className="flex items-center gap-2">
            
            {/* Currency Selector */}
            <div className="relative">
              <button
                id="currency-selector-btn"
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors"
                title="Change Currency Symbol"
              >
                <Coins className="w-3.5 h-3.5 text-slate-500" />
                <span>{currency}</span>
              </button>

              {showCurrencyDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowCurrencyDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Currency
                    </div>
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.symbol}
                        onClick={() => {
                          onCurrencyChange(c.symbol);
                          setShowCurrencyDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          currency === c.symbol
                            ? 'font-bold text-emerald-600 bg-emerald-50/50'
                            : 'text-slate-700'
                        }`}
                      >
                        <span>{c.name}</span>
                        {currency === c.symbol && <span>✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Desktop Add Transaction Button */}
            <button
              id="desktop-add-tx-btn"
              onClick={onOpenAddModal}
              className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-xs hover:shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>

            {/* More Menu (Backup / Reset / Export) */}
            <div className="relative">
              <button
                id="more-options-btn"
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                title="Data Options"
                aria-label="Data and backup options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showSettingsMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSettingsMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-700 text-xs">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Data & Backup
                    </div>
                    
                    <button
                      id="export-csv-btn"
                      onClick={() => {
                        onExportCSV();
                        setShowSettingsMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Export Transactions (CSV)</span>
                    </button>

                    <button
                      id="export-json-btn"
                      onClick={() => {
                        onExportJSON();
                        setShowSettingsMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Backup All Data (JSON)</span>
                    </button>

                    <button
                      id="import-json-btn"
                      onClick={() => {
                        fileInputRef.current?.click();
                        setShowSettingsMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Restore Backup (JSON)</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      id="reset-sample-btn"
                      onClick={() => {
                        onResetData();
                        setShowSettingsMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                      <span>Reload Sample Data</span>
                    </button>

                    <button
                      id="clear-all-data-btn"
                      onClick={() => {
                        onClearAll();
                        setShowSettingsMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Clear All Data</span>
                    </button>
                  </div>
                </>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
