import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Legend
} from 'recharts';
import { CurrencySymbol, Transaction } from '../types';
import { EXPENSE_CATEGORIES, getCategoryInfo } from '../data/categories';
import { formatCurrency, formatMonthName } from '../utils/formatters';
import { PieChart as PieIcon, BarChart3, TrendingDown, Inbox } from 'lucide-react';

interface SpendingChartsProps {
  transactions: Transaction[];
  currentMonth: string;
  currency: CurrencySymbol;
  categoryExpenses: Record<string, number>;
  totalExpense: number;
  totalIncome: number;
}

export const SpendingCharts: React.FC<SpendingChartsProps> = ({
  transactions,
  currentMonth,
  currency,
  categoryExpenses,
  totalExpense,
  totalIncome,
}) => {
  const [chartView, setChartView] = useState<'category' | 'comparison'>('category');

  // Prepare data for Category Donut Chart
  const pieData = Object.entries(categoryExpenses)
    .filter((entry): entry is [string, number] => typeof entry[1] === 'number' && entry[1] > 0)
    .map(([category, amount]) => {
      const info = getCategoryInfo(category, 'expense');
      const numericAmount = Number(amount);
      const percentage = totalExpense > 0 ? ((numericAmount / totalExpense) * 100).toFixed(1) : '0';
      return {
        name: info.name,
        categoryKey: category,
        value: Number(numericAmount.toFixed(2)),
        color: info.hexColor,
        percentage,
      };
    })
    .sort((a, b) => b.value - a.value);

  // Prepare comparison data (Income vs Expense breakdown by payment method or overall)
  const comparisonData = [
    {
      name: 'Cash Flow',
      Income: Number(totalIncome.toFixed(2)),
      Expenses: Number(totalExpense.toFixed(2)),
    },
  ];

  // Spending & Income timeline pattern
  const isAllTime = currentMonth === 'all';
  const timelineDataMap: Record<string, { key: string; label: string; expense: number; income: number }> = {};

  transactions
    .filter((tx) => isAllTime || tx.date.startsWith(currentMonth))
    .forEach((tx) => {
      const groupKey = isAllTime ? tx.date.substring(0, 7) : tx.date; // YYYY-MM or YYYY-MM-DD
      const groupLabel = isAllTime
        ? formatMonthName(groupKey)
        : `Day ${tx.date.substring(8, 10)}`;

      if (!timelineDataMap[groupKey]) {
        timelineDataMap[groupKey] = {
          key: groupKey,
          label: groupLabel,
          expense: 0,
          income: 0,
        };
      }
      const amt = typeof tx.amount === 'number' ? tx.amount : parseFloat(String(tx.amount)) || 0;
      if (tx.type === 'expense') {
        timelineDataMap[groupKey].expense += amt;
      } else {
        timelineDataMap[groupKey].income += amt;
      }
    });

  const timelineTrendData = Object.values(timelineDataMap)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((item) => ({
      day: item.label,
      expense: Number(item.expense.toFixed(2)),
      income: Number(item.income.toFixed(2)),
    }));

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200 text-xs z-50">
          <div className="font-bold text-slate-800">{data.name}</div>
          <div className="text-slate-600 mt-1 font-mono">
            {formatCurrency(data.value, currency)} ({data.percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200 text-xs z-50">
          <div className="font-bold text-slate-800 mb-1">{label}</div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span>
              <span className="font-mono font-bold">{formatCurrency(entry.value, currency)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-6">
      
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Spending Analytics & Breakdown
          </h3>
          <p className="text-xs text-slate-500">
            {currentMonth === 'all' ? 'All-Time Categories' : `${formatMonthName(currentMonth)} Distribution`}
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200/80">
          <button
            id="tab-chart-category-btn"
            onClick={() => setChartView('category')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              chartView === 'category'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Categories</span>
          </button>

          <button
            id="tab-chart-comparison-btn"
            onClick={() => setChartView('comparison')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              chartView === 'comparison'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Cash Flow</span>
          </button>
        </div>
      </div>

      {/* Main Charts View */}
      {totalExpense === 0 && totalIncome === 0 ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <Inbox className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
          <p className="text-sm font-medium text-slate-600">No transactions recorded for this period</p>
          <p className="text-xs text-slate-400">Add an income or expense to see visual charts</p>
        </div>
      ) : chartView === 'category' ? (
        totalExpense === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <TrendingDown className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
            <p className="text-sm font-medium text-slate-600">No expenses recorded for this month</p>
            <p className="text-xs text-slate-400">Log an expense to see category distributions</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Donut Chart Visual */}
            <div className="lg:col-span-6 h-64 sm:h-72 w-full flex items-center justify-center relative min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={800}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Total Spent
                </span>
                <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                  {formatCurrency(totalExpense, currency)}
                </span>
              </div>
            </div>

            {/* Ranked Category List */}
            <div className="lg:col-span-6 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Top Spending Categories
              </div>
              {pieData.map((item) => {
                const info = getCategoryInfo(item.categoryKey, 'expense');
                const Icon = info.icon;
                return (
                  <div
                    key={item.categoryKey}
                    className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-all flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className={`w-5 h-5 rounded-md ${info.bgColor} ${info.textColor} flex items-center justify-center`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <span className="font-semibold text-slate-800">{info.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">
                          {formatCurrency(item.value, currency)}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px] w-12 text-right">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )
      ) : (
        /* Comparison & Trend View */
        <div className="space-y-6">
          <div className="h-64 sm:h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Income" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={60} />
                <Bar dataKey="Expenses" fill="#f43f5e" radius={[8, 8, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {timelineTrendData.length > 1 && (
            <div className="pt-4 border-t border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                {currentMonth === 'all' ? 'Monthly Flow Trend' : 'Daily Timeline Flow'}
              </div>
              <div className="h-48 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timelineTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
