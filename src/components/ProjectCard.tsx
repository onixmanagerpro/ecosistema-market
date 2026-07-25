import React from 'react';
import { Coins, Calendar, Users, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onSelectProject: (project: Project) => void;
  onJoinClick: (project: Project) => void;
  isUserMember: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelectProject,
  onJoinClick,
  isUserMember
}) => {
  const progressPercent = project.tasksCount > 0 
    ? Math.round((project.completedTasksCount / project.tasksCount) * 100) 
    : 0;

  return (
    <div className="group relative bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 shadow-xl hover:bg-slate-800/40 transition-all duration-300 flex flex-col justify-between">
      
      <div>
        {/* Top Bar: Category & Status */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {project.category}
          </span>
          <span className={`px-3 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${
            project.status === 'completed'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : project.status === 'in_progress'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              project.status === 'completed' ? 'bg-emerald-400' : project.status === 'in_progress' ? 'bg-amber-400' : 'bg-blue-400 animate-pulse'
            }`} />
            {project.status === 'completed' ? 'Completado' : project.status === 'in_progress' ? 'En Progreso' : 'Reclutando'}
          </span>
        </div>

        {/* Image Preview if available */}
        {project.imageUrl && (
          <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-4 bg-slate-800 border border-slate-700/50">
            <img 
              src={project.imageUrl} 
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>
        )}

        {/* Title & Description */}
        <h3 
          onClick={() => onSelectProject(project)}
          className="text-lg font-bold text-white hover:text-indigo-400 cursor-pointer transition line-clamp-1 mb-2"
        >
          {project.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.requiredSkills.map((skill, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-800/80 text-[10px] font-semibold text-slate-300 border border-slate-700/50">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-[11px] mb-1.5">
            <span className="text-slate-400 font-medium">Progreso de tareas</span>
            <span className="text-indigo-400 font-bold">{project.completedTasksCount} / {project.tasksCount} ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Owner & Tokens Pool */}
        <div className="flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <img 
              src={project.ownerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
              alt={project.ownerName}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-800"
            />
            <span className="text-slate-400 text-[11px] font-medium truncate max-w-[100px]">{project.ownerName}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 text-amber-400 font-mono font-bold text-xs">
            <Coins className="w-3.5 h-3.5" />
            <span>Fondo: {project.fichasPool} Fichas</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onSelectProject(project)}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition text-center"
          >
            Ver Detalle
          </button>

          {isUserMember ? (
            <span className="px-3.5 py-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Miembro</span>
            </span>
          ) : (
            <button
              onClick={() => onJoinClick(project)}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition shrink-0"
            >
              <span>Unirme ({project.fichasRequiredToJoin} 🪙)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
