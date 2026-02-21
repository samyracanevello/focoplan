import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const dates = [21, 22, 23, 24, 25, 26, 27];
const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

const CalendarView = () => {
    return (
        <div className="py-6 flex flex-col h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-slate-800">Maio 2024</h1>
                    <div className="flex bg-white/60 rounded-xl p-1 shadow-sm">
                        <button className="p-1 hover:bg-white rounded-lg transition-colors"><ChevronLeft size={20} className="text-slate-500" /></button>
                        <button className="px-3 py-1 font-medium text-sm text-slate-700 hover:bg-white rounded-lg transition-colors">Hoje</button>
                        <button className="p-1 hover:bg-white rounded-lg transition-colors"><ChevronRight size={20} className="text-slate-500" /></button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white/60 p-1 rounded-xl flex text-sm shadow-sm hidden md:flex">
                        <button className="px-4 py-1.5 font-medium rounded-lg text-slate-500 hover:text-slate-700">Mês</button>
                        <button className="px-4 py-1.5 font-medium rounded-lg bg-white shadow-sm text-pastel-mint">Semana</button>
                        <button className="px-4 py-1.5 font-medium rounded-lg text-slate-500 hover:text-slate-700">Dia</button>
                    </div>
                    <Button><Plus size={18} className="mr-2" /> Novo Evento</Button>
                </div>
            </div>

            <Card className="flex-1 p-0 overflow-hidden flex flex-col min-h-[600px]">
                {/* Calendar Header */}
                <div className="grid grid-cols-8 border-b border-white/60 bg-white/40 sticky top-0 z-10">
                    <div className="col-span-1 p-4 border-r border-white/60">
                        <div className="text-xs text-slate-400 font-medium">Fuso: BRT</div>
                    </div>
                    {days.map((day, i) => (
                        <div key={day} className={`col-span-1 p-4 text-center border-r border-white/60 last:border-0 ${i === 3 ? 'bg-pastel-mint/10' : ''}`}>
                            <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">{day}</div>
                            <div className={`text-xl font-bold ${i === 3 ? 'text-pastel-mint' : 'text-slate-700'}`}>
                                {i === 3 ? (
                                    <span className="bg-pastel-mint text-white w-8 h-8 rounded-full inline-flex items-center justify-center">{dates[i]}</span>
                                ) : dates[i]}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Calendar Body Grid */}
                <div className="flex-1 overflow-y-auto min-h-0 relative">
                    <div className="grid grid-cols-8">
                        {/* Time column */}
                        <div className="col-span-1 border-r border-white/60 bg-white/20">
                            {hours.map(hour => (
                                <div key={hour} className="h-20 border-b border-white/60 p-2 text-right relative">
                                    <span className="text-xs font-medium text-slate-400 absolute -top-2.5 right-4 bg-pastel-cream px-1">{hour}:00</span>
                                </div>
                            ))}
                        </div>

                        {/* Days columns */}
                        {days.map((day, i) => (
                            <div key={day} className={`col-span-1 border-r border-white/60 last:border-0 bg-white/20 relative ${i === 3 ? 'bg-pastel-mint/5' : ''}`}>
                                {hours.map(hour => (
                                    <div key={`${day}-${hour}`} className="h-20 border-b border-white/60 border-dashed"></div>
                                ))}

                                {/* Mock Event 1 */}
                                {i === 1 && (
                                    <div className="absolute top-[80px] left-2 right-2 h-[120px] bg-pastel-mint rounded-xl p-2 shadow-sm border border-pastel-mint/50 flex flex-col text-white cursor-pointer hover:shadow-md transition-all">
                                        <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">TCC</span>
                                        <span className="text-xs font-medium mt-1 leading-tight">Escrever referencial teórico</span>
                                        <span className="text-[10px] opacity-75 mt-auto">09:00 - 10:30</span>
                                    </div>
                                )}

                                {/* Mock Event 2 */}
                                {i === 3 && (
                                    <div className="absolute top-[240px] left-2 right-2 h-[160px] bg-pastel-coral/90 rounded-xl p-2 shadow-sm border border-pastel-coral/50 flex flex-col text-white cursor-pointer hover:shadow-md transition-all">
                                        <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">Exame OAB</span>
                                        <span className="text-xs font-medium mt-1 leading-tight">Simulado de Direito Civil</span>
                                        <span className="text-[10px] opacity-75 mt-auto">11:00 - 13:00</span>
                                    </div>
                                )}

                                {/* Mock Event 3 */}
                                {i === 4 && (
                                    <div className="absolute top-[400px] left-2 right-2 h-[80px] bg-pastel-peach/90 rounded-xl p-2 shadow-sm border border-pastel-peach/50 flex flex-col text-white cursor-pointer hover:shadow-md transition-all">
                                        <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">Trabalho</span>
                                        <span className="text-xs font-medium mt-1 leading-tight">Reunião de Alinhamento</span>
                                        <span className="text-[10px] opacity-75 mt-auto">13:00 - 14:00</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CalendarView;
