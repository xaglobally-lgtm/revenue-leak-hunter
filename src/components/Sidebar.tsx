import React, { useRef, useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Target,
  CircleDollarSign,
  Users,
  FileBarChart2,
  Boxes,
  Settings,
  ShieldCheck,
  BookOpen,
  Info,
  ChevronDown,
  ChevronRight,
  GripVertical,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export type NavTab =
  | 'dashboard'
  | 'opportunities'
  | 'recoveries'
  | 'customers'
  | 'reports'
  | 'integration'
  | 'settings'
  | 'tests'
  | 'docs';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  opportunityCount: number;
  onOpenPublicSite: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  opportunityCount,
  onOpenPublicSite,
}) => {
  const { t, theme, sidebarWidth, setSidebarWidth, setIsAboutOpen } = useApp();
  const [isAdminOpen, setIsAdminOpen] = useState(true);
  const isDraggingRef = useRef(false);

  const isDark = theme === 'dark';
  const isCompact = sidebarWidth < 140;

  // Drag handler for resizable boundary
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const newWidth = e.clientX;
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [setSidebarWidth]);

  const handleStartDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // Daily User Tools
  const dailyNavItems = [
    { id: 'dashboard' as NavTab, label: t.overview, icon: LayoutDashboard },
    { id: 'opportunities' as NavTab, label: t.opportunities, icon: Target, badge: opportunityCount },
    { id: 'recoveries' as NavTab, label: t.recoveries, icon: CircleDollarSign },
    { id: 'customers' as NavTab, label: t.customers, icon: Users },
  ];

  // Administrator & System Tools (separated per requirements)
  const adminNavItems = [
    { id: 'integration' as NavTab, label: t.integration, icon: Boxes },
    { id: 'tests' as NavTab, label: t.tests, icon: ShieldCheck },
    { id: 'reports' as NavTab, label: t.reports, icon: FileBarChart2 },
    { id: 'settings' as NavTab, label: t.settings, icon: Settings },
    { id: 'docs' as NavTab, label: t.docs, icon: BookOpen },
  ];

  return (
    <aside
      style={{ width: `${sidebarWidth}px` }}
      className={`relative select-none shrink-0 h-screen flex flex-col justify-between border-r transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}
    >
      {/* Brand Header */}
      <div className={`p-3.5 border-b flex items-center justify-between shrink-0 ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
            RLH
          </div>
          {!isCompact && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className={`text-xs font-bold tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Revenue Leak Hunter
              </h1>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                Financial Ops
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-2.5 py-3 space-y-4 overflow-y-auto no-scrollbar">
        {/* 1. Daily Operations Section */}
        <div>
          {!isCompact && (
            <div className={`px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {t.dailyOps}
            </div>
          )}
          <div className="space-y-0.5">
            {dailyNavItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  title={item.label}
                  className={`w-full flex items-center ${isCompact ? 'justify-center px-1' : 'justify-between px-2.5'} py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? isDark
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                        : 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    {!isCompact && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isCompact && item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      isActive
                        ? isDark ? 'bg-emerald-400 text-slate-950' : 'bg-white text-emerald-800'
                        : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Administrator & Governance Tools (Bifurcated Menu) */}
        <div>
          {!isCompact && (
            <button
              onClick={() => setIsAdminOpen(!isAdminOpen)}
              className={`w-full px-2 pb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>{t.adminTools}</span>
              {isAdminOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
          {(isAdminOpen || isCompact) && (
            <div className="space-y-0.5 pt-0.5">
              {adminNavItems.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    title={item.label}
                    className={`w-full flex items-center ${isCompact ? 'justify-center px-1' : 'justify-start gap-2.5 px-2.5'} py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? isDark
                          ? 'bg-slate-800 text-white border border-slate-700 font-semibold'
                          : 'bg-slate-200 text-slate-900 font-semibold'
                        : isDark
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                    {!isCompact && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions: About / Contact & Public Site */}
      <div className={`p-2.5 border-t space-y-1 shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <button
          onClick={() => setIsAboutOpen(true)}
          title={t.aboutContact}
          className={`w-full flex items-center ${isCompact ? 'justify-center' : 'justify-start gap-2 px-2.5'} py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Info className="w-4 h-4 text-emerald-500 shrink-0" />
          {!isCompact && <span>{t.aboutContact}</span>}
        </button>

        <button
          onClick={onOpenPublicSite}
          title="Public Site"
          className={`w-full flex items-center ${isCompact ? 'justify-center' : 'justify-start gap-2 px-2.5'} py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
          }`}
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          {!isCompact && <span>Landing &amp; Free Scan</span>}
        </button>
      </div>

      {/* Resizable / Slide Boundary Gripper Handle */}
      <div
        onMouseDown={handleStartDrag}
        title="Drag to slide sidebar boundary"
        className="absolute top-0 right-0 w-1.5 h-full hover:w-2 bg-transparent hover:bg-emerald-500/50 cursor-col-resize flex items-center justify-center transition-all group z-30"
      >
        <div className="w-0.5 h-6 bg-slate-400/40 rounded-full group-hover:bg-emerald-400 transition-colors" />
      </div>
    </aside>
  );
};
