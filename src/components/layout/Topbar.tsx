import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const Topbar = () => {
    return (
        <header className="h-20 px-8 flex items-center justify-between mt-4 mr-4 glass-card py-0 rounded-[24px]">
            <div className="relative w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
                </div>
                <input
                    type="text"
                    placeholder="Buscar tarefas, tags, etc..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-white/40 rounded-[14px] leading-5 bg-white/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pastel-peach focus:bg-white/80 transition-all duration-300 sm:text-sm text-slate-700 shadow-sm"
                />
            </div>

            <div className="flex items-center gap-5">
                <button className="relative p-2 rounded-[12px] text-slate-400 hover:text-slate-600 hover:bg-white/60 transition-all duration-200">
                    <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-pastel-coral ring-2 ring-white"></span>
                    <Bell className="h-6 w-6" strokeWidth={1.5} />
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-white/40 cursor-pointer group">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-slate-700 leading-tight">Alex</p>
                        <p className="text-xs text-slate-500">Free Plan</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gradient-blush-lavender flex items-center justify-center text-white shadow-sm ring-2 ring-white/50 group-hover:ring-pastel-peach transition-all duration-300">
                        <User className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
