import React from 'react';
import { LayoutDashboard, PieChart, History, Target, Plus } from 'lucide-react';
import { AppTab } from '../types';

interface MobileBottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onOpenAddModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenAddModal,
}) => {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 pb-safe shadow-lg">
      <div className="flex items-center justify-around">
        
        {/* Dashboard Tab */}
        <button
          id="mobile-nav-dashboard"
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
            activeTab === 'dashboard'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Overview</span>
        </button>

        {/* Analytics Tab */}
        <button
          id="mobile-nav-analytics"
          onClick={() => onTabChange('analytics')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
            activeTab === 'analytics'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span className="text-[10px]">Charts</span>
        </button>

        {/* Center Quick Add FAB */}
        <div className="relative -top-3">
          <button
            id="mobile-fab-add-btn"
            onClick={onOpenAddModal}
            className="w-12 h-12 rounded-full bg-emerald-600 active:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 border-2 border-white transition-transform active:scale-95"
            aria-label="Add transaction"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Transactions Tab */}
        <button
          id="mobile-nav-history"
          onClick={() => onTabChange('transactions')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
            activeTab === 'transactions'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px]">History</span>
        </button>

        {/* Budget Tab */}
        <button
          id="mobile-nav-budget"
          onClick={() => onTabChange('budget')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
            activeTab === 'budget'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Target className="w-5 h-5" />
          <span className="text-[10px]">Budget</span>
        </button>

      </div>
    </nav>
  );
};

