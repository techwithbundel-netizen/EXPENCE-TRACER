import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { CurrencySymbol, Transaction } from '../types';
import { getCategoryInfo, getPaymentMethodInfo } from '../data/categories';
import { formatCurrency, formatFullDate } from '../utils/formatters';

interface TransactionItemProps {
  transaction: Transaction;
  currency: CurrencySymbol;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  currency,
  onEdit,
  onDelete,
}) => {
  const isExpense = transaction.type === 'expense';
  const categoryInfo = getCategoryInfo(transaction.category, transaction.type);
  const paymentInfo = getPaymentMethodInfo(transaction.paymentMethod);
  const CategoryIcon = categoryInfo.icon;
  const PaymentIcon = paymentInfo.icon;

  return (
    <div 
      id={`transaction-item-${transaction.id}`}
      className="group relative bg-white hover:bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
    >
      {/* Left: Category Icon & Details */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={`w-11 h-11 rounded-2xl ${categoryInfo.bgColor} ${categoryInfo.textColor} flex items-center justify-center shrink-0 border ${categoryInfo.borderColor}`}>
          <CategoryIcon className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {transaction.note || categoryInfo.name}
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              {transaction.category}
            </span>

            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
              <PaymentIcon className="w-3 h-3" />
              <span>{paymentInfo.shortName}</span>
            </span>

            <span className="hidden sm:inline-block text-slate-400">
              • {formatFullDate(transaction.date)}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Amount & Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="text-right">
          <div className={`text-sm sm:text-base font-bold font-mono ${
            isExpense ? 'text-slate-900' : 'text-emerald-600'
          }`}>
            {isExpense ? '-' : '+'}
            {formatCurrency(Math.abs(transaction.amount), currency)}
          </div>
          <div className="text-[10px] text-slate-400 sm:hidden">
            {transaction.date}
          </div>
        </div>

        {/* Edit & Delete Action Buttons */}
        <div className="flex items-center gap-1 sm:opacity-90 sm:group-hover:opacity-100 transition-opacity">
          <button
            id={`edit-tx-${transaction.id}-btn`}
            onClick={() => onEdit(transaction)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            title="Edit Transaction"
            aria-label="Edit transaction"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            id={`delete-tx-${transaction.id}-btn`}
            onClick={() => onDelete(transaction.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Transaction"
            aria-label="Delete transaction"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
