import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { CurrencySymbol, Transaction } from '../types';
import { formatCurrency, formatFullDate } from '../utils/formatters';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: Transaction | null;
  currency: CurrencySymbol;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  currency,
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-5 z-10 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900">
            Delete Transaction?
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Are you sure you want to delete this record? This action cannot be undone.
          </p>

          {/* Transaction preview card */}
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span className="truncate">{transaction.note || transaction.category}</span>
              <span className={transaction.type === 'expense' ? 'text-rose-600' : 'text-emerald-600'}>
                {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount, currency)}
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">
              {transaction.category} • {formatFullDate(transaction.date)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirm-delete-tx-btn"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
