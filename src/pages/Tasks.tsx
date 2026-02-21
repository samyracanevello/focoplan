import React from 'react';
import { Plus, Filter, Calendar as CalendarIcon, MoreVertical, Tag } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const mockTasks = [
    { id: 1, title: 'Revisão de Contabilidade de Custos para o CRC', tag: 'Exame 24/05', tagColor: 'bg-pastel-lavender text-slate-700', priority: 'High', date: 'Hoje' },
    { id: 2, title: 'Fichamento de artigos sobre perfil de egressos', tag: 'TCC', tagColor: 'bg-pastel-mint text-slate-700', priority: 'Med', date: 'Amanhã' },
    { id: 3, title: 'Lista de Exercícios: Matemática Financeira', tag: 'Faculdade', tagColor: 'bg-pastel-peach text-slate-700', priority: 'Low', date: 'Sex, 26 Mai' },
    { id: 4, title: 'Ler Cap. 4 de Macroeconomia', tag: 'Leitura', tagColor: 'bg-pastel-cream text-slate-700', priority: 'Med', date: 'Sáb, 27 Mai' },
    { id: 5, title: 'Simulado Geral OAB', tag: 'Exame 24/05', tagColor: 'bg-pastel-lavender text-slate-700', priority: 'High', date: 'Dom, 28 Mai' },
];

const Tasks = () => {
    return (
        <div className="py-6 px-2 md:px-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Minhas Tarefas</h1>
                    <p className="text-slate-500">Organize seus estudos e acompanhe seu progresso.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline"><Filter size={18} className="mr-2" /> Filtros</Button>
                    <Button><Plus size={18} className="mr-2" /> Nova Tarefa</Button>
                </div>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-slate-100/50">
                    <div className="hidden md:grid grid-cols-12 gap-4 p-4 text-xs font-semibold tracking-wider text-slate-400 uppercase bg-slate-50/50">
                        <div className="col-span-6">Tarefa</div>
                        <div className="col-span-2">Tag</div>
                        <div className="col-span-2">Data</div>
                        <div className="col-span-1 text-center">Prioridade</div>
                        <div className="col-span-1"></div>
                    </div>

                    {mockTasks.map(task => (
                        <div key={task.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-white transition-colors group">
                            <div className="col-span-1 md:col-span-6 flex items-center gap-3">
                                <div className="w-5 h-5 rounded border border-slate-300 flex-shrink-0 cursor-pointer hover:border-pastel-mint transition-colors"></div>
                                <span className="font-medium text-slate-700">{task.title}</span>
                            </div>

                            <div className="col-span-1 md:col-span-2 flex items-center gap-2 text-sm">
                                <Tag size={14} className="text-slate-400 hidden md:block" />
                                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium ${task.tagColor}`}>{task.tag}</span>
                            </div>

                            <div className="col-span-1 md:col-span-2 flex items-center gap-2 text-sm text-slate-500">
                                <CalendarIcon size={14} className="hidden md:block" />
                                {task.date}
                            </div>

                            <div className="col-span-1 md:col-span-1 flex items-center md:justify-center">
                                <span className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-pastel-coral' : task.priority === 'Med' ? 'bg-pastel-amber' : 'bg-pastel-mint'}`}></span>
                            </div>

                            <div className="col-span-1 hidden md:flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-slate-400 hover:text-slate-600 p-1"><MoreVertical size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Empty State Example */}
            {/* <div className="text-center py-20">
        <div className="w-24 h-24 bg-pastel-cream rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckSquare size={40} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">Nenhuma tarefa encontrada</h3>
        <p className="text-slate-500 mb-6">Você não tem tarefas agendadas para hoje. Que tal criar uma?</p>
        <Button><Plus size={18} className="mr-2" /> Criar Primeira Tarefa</Button>
      </div> */}
        </div>
    );
};

export default Tasks;
