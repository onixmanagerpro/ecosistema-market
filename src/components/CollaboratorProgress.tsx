import React from 'react';
import { Users, CheckCircle2, Clock, AlertTriangle, Coins, Award, MessageSquare, ShieldCheck, TrendingUp } from 'lucide-react';
import { Project, Task } from '../types';

interface CollaboratorProgressProps {
  project: Project;
  tasks: Task[];
  onOpenDirectChat: (collaboratorId: string, collaboratorName: string) => void;
}

export const CollaboratorProgress: React.FC<CollaboratorProgressProps> = ({
  project,
  tasks,
  onOpenDirectChat
}) => {
  const projectTasks = tasks.filter(t => t.projectId === project.id);

  // Group task stats by member
  const memberStats = project.members.map(member => {
    const memberTasks = projectTasks.filter(t => t.assignedToId === member.userId);
    const completedTasks = memberTasks.filter(t => t.status === 'completed');
    const inProgressTasks = memberTasks.filter(t => t.status === 'in_progress' || t.status === 'in_review');
    
    const totalFichasEarned = completedTasks.reduce((acc, t) => acc + t.fichasReward, 0);
    const totalReputationPoints = completedTasks.reduce((acc, t) => acc + t.reputationPoints, 0);

    const completionRate = memberTasks.length > 0 
      ? Math.round((completedTasks.length / memberTasks.length) * 100)
      : 0;

    return {
      ...member,
      totalTasks: memberTasks.length,
      completedCount: completedTasks.length,
      inProgressCount: inProgressTasks.length,
      completionRate,
      fichasEarned: totalFichasEarned,
      reputationEarned: totalReputationPoints
    };
  });

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Seguimiento y Progreso de Colaboradores</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Métricas de cumplimiento, tareas completadas e hitos alcanzados por cada integrante.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-700/80">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Proyecto: {project.title}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memberStats.map((stat) => (
          <div key={stat.userId} className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 space-y-4 hover:border-indigo-500/40 transition">
            
            {/* Member Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={stat.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                  alt={stat.userName}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">{stat.userName}</h4>
                  <span className="text-xs text-indigo-400 font-medium">{stat.role}</span>
                </div>
              </div>

              <button
                onClick={() => onOpenDirectChat(stat.userId, stat.userName)}
                className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Iniciar chat directo"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>

            {/* Completion Progress Bar */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Cumplimiento de tareas</span>
                <span className="font-bold text-indigo-400">{stat.completedCount} de {stat.totalTasks} ({stat.completionRate}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)] rounded-full transition-all duration-500"
                  style={{ width: `${stat.completionRate}%` }}
                />
              </div>
            </div>

            {/* Badges / Metrics Row */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
              <div className="bg-slate-900/60 p-2 rounded-lg">
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">En Proceso</span>
                <span className="text-xs font-bold text-amber-400">{stat.inProgressCount} Tareas</span>
              </div>

              <div className="bg-slate-900/60 p-2 rounded-lg">
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Fichas Ganadas</span>
                <span className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1">
                  <Coins className="w-3 h-3" />
                  <span>{stat.fichasEarned}</span>
                </span>
              </div>

              <div className="bg-slate-900/60 p-2 rounded-lg">
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Reputación</span>
                <span className="text-xs font-bold text-indigo-400 flex items-center justify-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>+{stat.reputationEarned}</span>
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
