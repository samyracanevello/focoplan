import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, Clock, BarChart2, Target, DownloadCloud, Settings, BookOpen } from 'lucide-react';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tasks', label: 'Tarefas', icon: CheckSquare },
    { path: '/calendar', label: 'Calendário', icon: Calendar },
    { path: '/pomodoro', label: 'Pomodoro', icon: Clock },
    { path: '/stats', label: 'Stats', icon: BarChart2 },
    { path: '/goals', label: 'Metas', icon: Target },
];

const bottomItems = [
    { path: '/export', label: 'Exportar/Backup', icon: DownloadCloud },
    { path: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
    return (
        <aside className="w-64 flex flex-col glassmorphism bg-white/60 border-r border-white/40 m-4 rounded-[24px] shadow-sm">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-blush-mint flex items-center justify-center text-white shadow-sm">
                    <BookOpen size={24} strokeWidth={1.5} />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-800">FocoPlan</span>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                <div className="mb-4 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu Principal</div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-medium transition-all duration-200 ${isActive
                                ? 'bg-white shadow-sm text-pastel-mint border border-white/50'
                                : 'text-slate-500 hover:bg-white/40 hover:text-slate-700'
                            }`
                        }
                    >
                        <item.icon size={20} className="opacity-90" strokeWidth={1.5} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 mt-auto border-t border-white/20">
                <div className="space-y-1">
                    {bottomItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-medium transition-all duration-200 text-sm ${isActive
                                    ? 'bg-white shadow-sm text-pastel-mint border border-white/50'
                                    : 'text-slate-500 hover:bg-white/40 hover:text-slate-700'
                                }`
                            }
                        >
                            <item.icon size={18} className="opacity-80" strokeWidth={1.5} />
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
