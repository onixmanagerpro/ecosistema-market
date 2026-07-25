import React, { useState } from 'react';
import { 
  Kanban, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Coins, 
  User, 
  Award, 
  ChevronRight, 
  Send, 
  ShieldCheck,
  Check,
  Filter
} from 'lucide-react';
import { Task, Project, TaskStatus } from '../types';
import { useAuth } from '../context/AuthContext';

interface TaskBoardProps {
  tasks: Task[];
  projects: Project[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus, assignedUserId?: string) => Promise<void>;
  onAddTask: (taskData: Partial<Task>) => Promise<void>;
  onSelectProjectFilter: (projectId: string) => void;
  selectedProjectId: string;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  projects,
  onUpdateTaskStatus,
  onAddTask,
  onSelectProjectFilter,
  selectedProjectId
}) => {
  const { userProfile } = useAuth();
  
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskProjectId, setNewTaskProjectId] = useState(projects[0]?.id || '');
  const [newTaskReward, setNewTaskReward] = useState(50);
  const [newTaskPoints, setNewTaskPoints] = useState(25);
  const [newTaskDeadline, setNewTaskDeadline] = useState('2026-08-30');

  // Filter tasks based on selected project
  const filteredTasks = selectedProjectId === 'all' 
    ? tasks 
    : tasks.filter(t => t.projectId === selectedProjectId);

  const columns: Array<{ id: TaskStatus; title: string; color: string; badgeBg: string }> = [
    { id: 'todo', title: 'Pendientes', color: 'border-slate-700', badgeBg: 'bg-slate-800 text-slate-300' },
    { id: 'in_progress', title: 'En Progreso', color: 'border-amber-500/30', badgeBg: 'bg-amber-500/10 text-amber-400' },
    { id: 'in_review', title: 'En Revisión', color: 'border-blue-500/30', badgeBg: 'bg-blue-500/10 text-blue-400' },
    { id: 'completed', title: 'Completados', color: 'border-emerald-500/30', badgeBg: 'bg-emerald-500/10 text-emerald-400' }
  ];

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskProjectId) return;

    const selectedProj = projects.find(p => p.id === newTaskProjectId);

    await onAddTask({
      projectId: newTaskProjectId,
      projectTitle: selectedProj?.title || 'Proyecto',
      title: newTaskTitle,
      description: newTaskDesc,
      status: 'todo',
      fichasReward: Number(newTaskReward),
      reputationPoints: Number(newTaskPoints),
      deadline: newTaskDeadline,
      createdAt: new Date().toISOString().split('T')[0]
    });

    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddTaskModal(false);
  };

  const getDeadlineStatus = (deadlineStr: string) => {
    if (!deadlineStr) return { text: 'Sin fecha', color: 'text-slate-400', isUrgent: false };
    
    const today = new Date().getTime();
    const target = new Date(deadlineStr).getTime();
    const diffDays = Math.ceil((target - today) / (1000 * 3600 * 24));

    if (diffDays < 0) return { text: '⚠️ Vencido', color: 'text-rose-400 font-semibold', isUrgent: true };
    if (diffDays <= 2) return { text: `⏰ Vence en ${diffDays} días`, color: 'text-amber-400 font-semibold', isUrgent: true };
    return { text: `📅 Límite: ${deadlineStr}`, color: 'text-slate-400', isUrgent: false };
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Kanban className="w-5 h-5 text-indigo-400" />
            <span>Panel de Gestión y Seguimiento de Tareas</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Asigna tareas, valida entregables y transfiere reputación y fichas a los colaboradores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Project Selector Filter */}
          <div className="flex items-center gap-2 bg-slate-800/60 px-3.5 py-2 rounded-2xl border border-slate-700/80">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedProjectId}
              onChange={(e) => onSelectProjectFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">Todos los Proyectos ({tasks.length})</option>
              {projects.map(p => (
                <option key={p.id} value={p.id} className="bg-slate-900">{p.title}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddTaskModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);

          return (
            <div key={col.id} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 flex flex-col h-[650px]">
              
              {/* Column Title */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-200">{col.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${col.badgeBg}`}>
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Task Cards List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 no-scrollbar">
                {colTasks.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center text-xs text-slate-500 italic">
                    Sin tareas
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const deadlineInfo = getDeadlineStatus(task.deadline);

                    return (
                      <div 
                        key={task.id}
                        className={`bg-slate-800/40 border ${col.color} hover:border-indigo-500/50 rounded-2xl p-4 shadow-md transition-all duration-200 flex flex-col justify-between space-y-3`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 truncate max-w-[140px]">
                              {task.projectTitle || 'Proyecto'}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                              <Coins className="w-3 h-3" />
                              <span>+{task.fichasReward}</span>
                            </div>
                          </div>

                          <h4 className="font-bold text-xs text-white line-clamp-2 mb-1">
                            {task.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                            {task.description}
                          </p>
                        </div>

                        {/* Deadlines & Assignee */}
                        <div className="pt-2 border-t border-slate-800/80 space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className={deadlineInfo.color}>{deadlineInfo.text}</span>
                            <span className="text-slate-400 flex items-center gap-1">
                              <Award className="w-3 h-3 text-indigo-400" />
                              <span>+{task.reputationPoints} pts</span>
                            </span>
                          </div>

                          {/* Assignee Avatar */}
                          <div className="flex items-center justify-between pt-1">
                            {task.assignedToName ? (
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                                <img 
                                  src={task.assignedToAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                                  alt={task.assignedToName}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                                <span className="truncate max-w-[90px]">{task.assignedToName}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic">Sin asignar</span>
                            )}

                            {/* Actions by column state */}
                            {task.status === 'todo' && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, 'in_progress', userProfile?.uid)}
                                className="px-2 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-[10px] font-semibold transition"
                              >
                                Tomar Tarea
                              </button>
                            )}

                            {task.status === 'in_progress' && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, 'in_review')}
                                className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold transition flex items-center gap-1"
                              >
                                <span>Enviar a Revisión</span>
                                <Send className="w-2.5 h-2.5" />
                              </button>
                            )}

                            {task.status === 'in_review' && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, 'completed', task.assignedToId)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1"
                                title="Aprobar entregable, transferir fichas y aumentar reputación del colaborador"
                              >
                                <Check className="w-3 h-3" />
                                <span>Aprobar Tarea</span>
                              </button>
                            )}

                            {task.status === 'completed' && (
                              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Validado</span>
                              </span>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
            <h3 className="text-lg font-bold text-white mb-4">Crear Nueva Tarea</h3>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Proyecto Asociado</label>
                <select
                  value={newTaskProjectId}
                  onChange={(e) => setNewTaskProjectId(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título de la Tarea</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Integración de Pasarela de Pagos"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción del Entregable</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre lo que debe entregar el colaborador..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1">Recompensa (Fichas)</label>
                  <input
                    type="number"
                    min={10}
                    value={newTaskReward}
                    onChange={(e) => setNewTaskReward(Number(e.target.value))}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-amber-400 font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-indigo-400 mb-1">Puntos Reputación</label>
                  <input
                    type="number"
                    min={5}
                    value={newTaskPoints}
                    onChange={(e) => setNewTaskPoints(Number(e.target.value))}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-indigo-400 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha Límite</label>
                <input
                  type="date"
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/20"
                >
                  Publicar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
