import React, { useState } from 'react';
import { 
  X, 
  Coins, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { Project, Task } from '../types';
import { useAuth } from '../context/AuthContext';

interface ProjectDetailsModalProps {
  project: Project | null;
  tasks: Task[];
  onClose: () => void;
  onApplyOrJoin: (projectId: string, role: string, pitch: string, fichasStaked: number) => Promise<void>;
  isUserMember: boolean;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  tasks,
  onClose,
  onApplyOrJoin,
  isUserMember
}) => {
  const { userProfile, deductFichas } = useAuth();
  const [selectedRole, setSelectedRole] = useState('');
  const [pitch, setPitch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!project) return null;

  const projectTasks = tasks.filter(t => t.projectId === project.id);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedRole) {
      setErrorMsg('Por favor selecciona un rol para colaborar.');
      return;
    }

    if (userProfile && userProfile.fichasBalance < project.fichasRequiredToJoin) {
      setErrorMsg(`Saldo insuficiente. Requieres ${project.fichasRequiredToJoin} fichas para unirte a este proyecto.`);
      return;
    }

    setSubmitting(true);
    try {
      const success = await deductFichas(project.fichasRequiredToJoin);
      if (!success) {
        setErrorMsg('Error al descontar fichas de compromiso.');
        setSubmitting(false);
        return;
      }

      await onApplyOrJoin(project.id, selectedRole, pitch, project.fichasRequiredToJoin);
      setSuccessMsg('¡Te has unido exitosamente al proyecto! Ya puedes asumir tareas.');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setErrorMsg('No se pudo procesar la solicitud.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 my-8 p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover / Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {project.imageUrl && (
            <img 
              src={project.imageUrl} 
              alt={project.title}
              className="w-full md:w-48 h-36 object-cover rounded-xl border border-slate-800"
            />
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {project.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300">
                Límite: {project.deadline}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <img 
                src={project.ownerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                alt={project.ownerName}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>Creado por <strong className="text-slate-200">{project.ownerName}</strong></span>
            </div>
          </div>
        </div>

        {/* Description & Pitch */}
        <div className="space-y-4 mb-6 text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-4 rounded-xl border border-slate-800">
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-slate-400">Descripción General</h4>
          <p>{project.longDescription || project.description}</p>
        </div>

        {/* Fichas & Skills Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-500/80 font-semibold uppercase">Fondo de Recompensas</span>
              <div className="text-xl font-extrabold text-amber-400">{project.fichasPool} Fichas</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Se distribuyen al completar tareas</p>
            </div>
            <Coins className="w-8 h-8 text-amber-400 opacity-80" />
          </div>

          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs text-indigo-400/80 font-semibold uppercase">Fichas para Unirse</span>
              <div className="text-xl font-extrabold text-indigo-400">{project.fichasRequiredToJoin} Fichas</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Fichas de compromiso requeridas</p>
            </div>
            <Sparkles className="w-8 h-8 text-indigo-400 opacity-80" />
          </div>
        </div>

        {/* Required Skills */}
        <div className="mb-6">
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-slate-400 mb-2">Habilidades Requeridas</h4>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills.map((s, i) => (
              <span key={i} className="px-3 py-1 rounded-lg bg-slate-800 text-xs text-slate-200 border border-slate-700">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Current Team Members */}
        <div className="mb-6">
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Equipo Actual ({project.members.length})</span>
            <Users className="w-4 h-4 text-slate-500" />
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.members.map((member, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-800">
                <img 
                  src={member.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} 
                  alt={member.userName} 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-xs text-white">{member.userName}</div>
                  <div className="text-[11px] text-indigo-400">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Tasks Preview */}
        <div className="mb-6">
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-slate-400 mb-3">
            Tareas Disponibles ({projectTasks.length})
          </h4>

          {projectTasks.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Aún no hay tareas publicadas en este proyecto.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {projectTasks.map((t) => (
                <div key={t.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-200">{t.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{t.description}</div>
                  </div>
                  <div className="flex items-center gap-2 text-amber-400 font-semibold shrink-0">
                    <Coins className="w-3.5 h-3.5" />
                    <span>+{t.fichasReward} Fichas</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Join / Application Form */}
        {!isUserMember ? (
          <div className="mt-8 pt-6 border-t border-slate-800 bg-slate-900/90 rounded-2xl p-5 border border-indigo-500/30">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <span>Unirme a este Proyecto</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Aporta tu talento al ecosistema. Se reservarán <strong className="text-amber-400">{project.fichasRequiredToJoin} fichas</strong> como compromiso colaborativo.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Elige tu rol sugerido</label>
                <select
                  required
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Seleccionar Rol --</option>
                  {project.requiredSkills.map((sk, idx) => (
                    <option key={idx} value={`Especialista en ${sk}`}>Especialista en {sk}</option>
                  ))}
                  <option value="Desarrollador Frontend / Backend">Desarrollador Frontend / Backend</option>
                  <option value="Diseñador UI/UX">Diseñador UI/UX</option>
                  <option value="Creador de Contenido & Marketing">Creador de Contenido & Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mensaje de motivación / Pitch breve (opcional)</label>
                <textarea
                  rows={2}
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  placeholder="Explica brevemente tu experiencia o cómo quieres contribuir..."
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition"
              >
                {submitting ? (
                  <span>Procesando unión...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirmar y Reservar {project.fichasRequiredToJoin} Fichas</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Ya eres colaborador activo de este proyecto.</span>
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 transition"
            >
              Ir al Panel de Tareas
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
