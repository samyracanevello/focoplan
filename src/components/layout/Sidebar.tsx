import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, CheckSquare, Calendar, Clock,
    BarChart2, Target, Settings, BookOpen, LogOut, Bell, GraduationCap
} from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';
import { useNotificationsStore } from '../../store/useNotificationsStore';

const navItems = [
    { path: '/dashboard', label: 'Painel', icon: LayoutDashboard },
    { path: '/subjects', label: 'Matérias', icon: GraduationCap },
    { path: '/tasks', label: 'Tarefas', icon: CheckSquare },
    { path: '/calendar', label: 'Calendário', icon: Calendar },
    { path: '/pomodoro', label: 'Pomodoro', icon: Clock },
    { path: '/stats', label: 'Estatísticas', icon: BarChart2 },
    { path: '/goals', label: 'Metas', icon: Target },
];

const bottomItems = [
    { path: '/notifications', label: 'Notificações', icon: Bell },
    { path: '/settings', label: 'Configurações', icon: Settings },
];

const Sidebar = () => {
    const { name, logout } = useUserStore();
    const navigate = useNavigate();
    const unreadCount = useNotificationsStore(state => state.notifications.filter(n => !n.read).length);

    const handleLogout = () => { logout(); navigate('/auth'); };

    const initials = (name || 'U').slice(0, 2).toUpperCase();

    return (
        <aside className="sidebar w-60 flex flex-col m-3 rounded-[28px] z-20 relative overflow-hidden">
            {/* Subtle orb decoration */}
            <div className="orb w-40 h-40 -top-10 -left-10 opacity-20" style={{ background: 'radial-gradient(circle, #F2B8C6, transparent)' }} />

            {/* Brand */}
            <div className="relative px-5 pt-6 pb-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl gradient-hero flex items-center justify-center shadow-md flex-shrink-0">
                    <BookOpen size={18} strokeWidth={2} className="text-white" />
                </div>
                <div>
                    <span className="font-extrabold text-lg tracking-tight text-slate-800">FocoPlan</span>
                </div>
            </div>

            {/* Divider */}
            <div className="divider mx-4 mb-4" />

            {/* Main Nav */}
            <nav className="flex-1 px-3 space-y-0.5 relative">
                <p className="section-title">Menu Principal</p>
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <item.icon size={18} strokeWidth={1.8} className="flex-shrink-0" />
                        <span className="text-sm">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Nav */}
            <div className="px-3 pb-3 space-y-0.5">
                <div className="divider mb-3" />
                <p className="section-title">Conta</p>

                {bottomItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <div className="relative flex-shrink-0">
                            <item.icon size={17} strokeWidth={1.8} />
                            {item.path === '/notifications' && unreadCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-pastel-coral text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </div>
                        <span className="text-sm">{item.label}</span>
                        {item.path === '/notifications' && unreadCount > 0 && (
                            <span className="ml-auto badge" style={{ background: 'rgba(238,144,144,0.12)', color: '#EE9090' }}>
                                {unreadCount}
                            </span>
                        )}
                    </NavLink>
                ))}

                {/* User row */}
                <div className="mt-3 pt-3 border-t border-pastel-border/50 flex items-center gap-3 px-2 group">
                    <div className="w-8 h-8 rounded-xl gradient-hero flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate leading-tight">{name}</p>
                        <p className="text-[11px] text-pastel-muted">Conta local</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Sair"
                        className="p-1.5 rounded-lg text-pastel-muted hover:text-pastel-coral hover:bg-red-50 transition-all duration-200"
                    >
                        <LogOut size={14} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
