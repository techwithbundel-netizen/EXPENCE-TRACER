import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  AppTab, 
  BudgetConfig, 
  CurrencySymbol, 
  Transaction, 
  TransactionType 
} from './types';
import { 
  loadTransactions, 
  saveTransactions, 
  loadBudgets, 
  saveBudgets, 
  loadCurrency, 
  saveCurrency, 
  exportTransactionsToCSV, 
  exportBackupJSON, 
  resetToSampleData 
} from './utils/storage';
import { 
  calculateSummary, 
  getCurrentYearMonth, 
  getMonthList 
} from './utils/formatters';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { BudgetProgressCard } from './components/BudgetProgressCard';
import { SpendingCharts } from './components/SpendingCharts';
import { TransactionList } from './components/TransactionList';
import { TransactionFormModal } from './components/TransactionFormModal';
import { BudgetModal } from './components/BudgetModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { 
  LayoutDashboard, 
  PieChart, 
  History, 
  Target, 
  Plus, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function App() {
  // Primary persistent state
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());
  const [budgets, setBudgets] = useState<Record<string, BudgetConfig>>(() => loadBudgets());
  const [currency, setCurrency] = useState<CurrencySymbol>(() => loadCurrency());
  
  // Navigation & selection state
  const [currentMonth, setCurrentMonth] = useState<string>(getCurrentYearMonth());
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [initialTxType, setInitialTxType] = useState<TransactionType>('expense');
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Sync transactions to localStorage on update
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Sync budgets to localStorage
  useEffect(() => {
    saveBudgets(budgets);
  }, [budgets]);

  // Sync currency to localStorage
  useEffect(() => {
    saveCurrency(currency);
  }, [currency]);

  // Computed summary metrics
  const summary = useMemo(() => {
    return calculateSummary(transactions, currentMonth);
  }, [transactions, currentMonth]);

  // Months with transaction data for dropdown
  const availableMonths = useMemo(() => {
    return getMonthList(transactions);
  }, [transactions]);

  // Current month budget config
  const currentBudget = useMemo(() => {
    const monthKey = currentMonth === 'all' ? getCurrentYearMonth() : currentMonth;
    return budgets[monthKey] || {
      month: monthKey,
      monthlyTarget: 2500,
      categoryBudgets: {},
    };
  }, [budgets, currentMonth]);

  // Handler for adding / updating transactions
  const handleSaveTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>, editingId?: string) => {
    if (editingId) {
      setTransactions((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, ...data }
            : item
        )
      );
      showToast('Transaction updated successfully');
    } else {
      const newTx: Transaction = {
        ...data,
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: Date.now(),
      };
      setTransactions((prev) => [newTx, ...prev]);

      if (data.type === 'income') {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.85 },
          colors: ['#10b981', '#34d399', '#6ee7b7'],
        });
        showToast('Income logged successfully!');
      } else {
        showToast('Expense recorded successfully');
      }
    }
  };

  // Handler for deleting transaction
  const handleConfirmDelete = () => {
    if (deletingTransaction) {
      setTransactions((prev) => prev.filter((t) => t.id !== deletingTransaction.id));
      showToast('Transaction deleted', 'info');
      setDeletingTransaction(null);
    }
  };

  // Handler for saving budget
  const handleSaveBudget = (newBudget: BudgetConfig) => {
    setBudgets((prev) => ({
      ...prev,
      [newBudget.month]: newBudget,
    }));
    showToast('Budget preferences saved');
  };

  // Handler for quick opening modal
  const handleOpenAddModal = (type: TransactionType = 'expense') => {
    setEditingTransaction(null);
    setInitialTxType(type);
    setIsAddModalOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    if (target) {
      setDeletingTransaction(target);
    }
  };

  // Export & Import handlers
  const handleExportCSV = () => {
    exportTransactionsToCSV(transactions);
    showToast('Exported CSV file');
  };

  const handleExportJSON = () => {
    exportBackupJSON(transactions, budgets);
    showToast('Backup JSON file downloaded');
  };

  const handleImportJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.transactions && Array.isArray(parsed.transactions)) {
          const sanitizedTransactions: Transaction[] = parsed.transactions
            .map((tx: any, idx: number) => ({
              id: String(tx.id || `restored-tx-${Date.now()}-${idx}`),
              type: tx.type === 'income' ? 'income' : 'expense',
              amount: Math.abs(parseFloat(String(tx.amount)) || 0),
              category: String(tx.category || (tx.type === 'income' ? 'Salary' : 'Other')),
              date: String(tx.date || new Date().toISOString().substring(0, 10)),
              note: String(tx.note || ''),
              paymentMethod: String(tx.paymentMethod || 'UPI / Bank Transfer') as any,
              createdAt: Number(tx.createdAt) || Date.now(),
            }))
            .filter((tx: Transaction) => tx.amount > 0);

          setTransactions(sanitizedTransactions);
          if (parsed.budgets && typeof parsed.budgets === 'object') {
            setBudgets(parsed.budgets);
          }
          showToast(`Successfully restored ${sanitizedTransactions.length} transactions!`);
        } else {
          showToast('Invalid backup file format', 'error');
        }
      } catch (err) {
        showToast('Error reading backup file', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all transactions and budgets to default sample data?')) {
      const reset = resetToSampleData();
      setTransactions(reset.transactions);
      setBudgets(reset.budgets);
      showToast('Reset to sample test data');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear ALL transactions? This cannot be undone.')) {
      setTransactions([]);
      saveTransactions([]);
      showToast('All transaction records cleared', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 sm:pb-12">
      
      {/* Sticky Top Navbar */}
      <Navbar
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
        availableMonths={availableMonths}
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenAddModal={() => handleOpenAddModal('expense')}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        onResetData={handleResetData}
        onClearAll={handleClearAll}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7">
        
        {/* Desktop View Mode Tabs (for quick navigation across sections) */}
        <div className="hidden sm:flex items-center justify-between pb-6 border-b border-slate-200/80 mb-6">
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-2xl border border-slate-200">
            <button
              id="desktop-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>Overview</span>
            </button>

            <button
              id="desktop-tab-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieChart className="w-4 h-4 text-indigo-600" />
              <span>Analytics & Charts</span>
            </button>

            <button
              id="desktop-tab-transactions"
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'transactions'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-4 h-4 text-blue-600" />
              <span>Transactions ({transactions.length})</span>
            </button>

            <button
              id="desktop-tab-budget"
              onClick={() => setActiveTab('budget')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'budget'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-4 h-4 text-rose-600" />
              <span>Monthly Budget</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenAddModal('expense')}
              className="flex items-center gap-1 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200/80 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Expense</span>
            </button>
            <button
              onClick={() => handleOpenAddModal('income')}
              className="flex items-center gap-1 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs rounded-xl border border-emerald-200/80 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Income</span>
            </button>
          </div>
        </div>

        {/* Dynamic Content Views */}
        
        {/* 1. Dashboard Tab (Default / Bento Layout) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Overview cards */}
            <DashboardOverview
              totalIncome={summary.totalIncome}
              totalExpense={summary.totalExpense}
              netBalance={summary.netBalance}
              savingsRate={summary.savingsRate}
              dailyAverageExpense={summary.dailyAverageExpense}
              transactionCount={summary.transactionCount}
              currency={currency}
              currentMonth={currentMonth}
              onOpenAddModal={handleOpenAddModal}
              monthlyBudget={currentBudget.monthlyTarget}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
            />

            {/* Grid with Charts + Budget Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left 7 cols: Charts */}
              <div className="lg:col-span-7">
                <SpendingCharts
                  transactions={transactions}
                  currentMonth={currentMonth}
                  currency={currency}
                  categoryExpenses={summary.categoryExpenses}
                  totalExpense={summary.totalExpense}
                  totalIncome={summary.totalIncome}
                />
              </div>

              {/* Right 5 cols: Budget & Pace */}
              <div className="lg:col-span-5">
                <BudgetProgressCard
                  currentMonth={currentMonth}
                  totalExpense={summary.totalExpense}
                  categoryExpenses={summary.categoryExpenses}
                  budget={currentBudget}
                  currency={currency}
                  onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
                />
              </div>

            </div>

            {/* Recent Transactions List */}
            <div className="pt-2">
              <TransactionList
                transactions={transactions}
                currentMonth={currentMonth}
                currency={currency}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteRequest}
                onOpenAddModal={() => handleOpenAddModal('expense')}
              />
            </div>

          </div>
        )}

        {/* 2. Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <SpendingCharts
              transactions={transactions}
              currentMonth={currentMonth}
              currency={currency}
              categoryExpenses={summary.categoryExpenses}
              totalExpense={summary.totalExpense}
              totalIncome={summary.totalIncome}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardOverview
                totalIncome={summary.totalIncome}
                totalExpense={summary.totalExpense}
                netBalance={summary.netBalance}
                savingsRate={summary.savingsRate}
                dailyAverageExpense={summary.dailyAverageExpense}
                transactionCount={summary.transactionCount}
                currency={currency}
                currentMonth={currentMonth}
                onOpenAddModal={handleOpenAddModal}
                monthlyBudget={currentBudget.monthlyTarget}
                onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
              />

              <BudgetProgressCard
                currentMonth={currentMonth}
                totalExpense={summary.totalExpense}
                categoryExpenses={summary.categoryExpenses}
                budget={currentBudget}
                currency={currency}
                onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
              />
            </div>
          </div>
        )}

        {/* 3. Transactions History Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <TransactionList
              transactions={transactions}
              currentMonth={currentMonth}
              currency={currency}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteRequest}
              onOpenAddModal={() => handleOpenAddModal('expense')}
            />
          </div>
        )}

        {/* 4. Budget Planner Tab */}
        {activeTab === 'budget' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <BudgetProgressCard
              currentMonth={currentMonth}
              totalExpense={summary.totalExpense}
              categoryExpenses={summary.categoryExpenses}
              budget={currentBudget}
              currency={currency}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
            />

            <SpendingCharts
              transactions={transactions}
              currentMonth={currentMonth}
              currency={currency}
              categoryExpenses={summary.categoryExpenses}
              totalExpense={summary.totalExpense}
              totalIncome={summary.totalIncome}
            />
          </div>
        )}

      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddModal={() => handleOpenAddModal('expense')}
      />

      {/* Modals & Dialogs */}
      <TransactionFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveTransaction}
        editingTransaction={editingTransaction}
        currency={currency}
        initialType={initialTxType}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        currentMonth={currentMonth}
        currentBudget={currentBudget}
        currency={currency}
        onSaveBudget={handleSaveBudget}
      />

      <DeleteConfirmModal
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleConfirmDelete}
        transaction={deletingTransaction}
        currency={currency}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs sm:text-sm font-semibold ${
            toast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-800'
              : toast.type === 'info'
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-emerald-900 text-white border-emerald-800'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
}
