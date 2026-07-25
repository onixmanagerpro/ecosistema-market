import React, { useState } from 'react';
import { X, Plus, Trash2, Rocket, Coins, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Project, ProjectCategory } from '../types';
import { useAuth } from '../context/AuthContext';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (newProj: Partial<Project>, initialTasks: Array<{ title: string; description: string; reward: number; points: number; deadline: string }>) => Promise<void>;
}

const CATEGORIES: ProjectCategory[] = [
  'Tecnología y Software',
  'IA y Ciencia de Datos',
  'Diseño y Arte',
  'Sostenibilidad y Medio Ambiente',
  'Educación y Comunidad',
  'Negocios y Startups'
];

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject
}) => {
  const { userProfile } = useAuth();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Tecnología y Software');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('React, TypeScript, UX/UI');
  const [fichasPool, setFichasPool] = useState(400);
  const [fichasRequiredToJoin, setFichasRequiredToJoin] = useState(20);
  const [deadline, setDeadline] = useState('2026-10-15');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600');
  
  // Initial tasks created alongside project
  const [tasksList, setTasksList] = useState<Array<{ title: string; description: string; reward: number; points: number; deadline: string }>>([
    {
      title: 'Diseño de la Arquitectura & Prototipos',
      description: 'Definir especificaciones técnicas iniciales y diagramas de flujo.',
      reward: 60,
      points: 30,
      deadline: '2026-08-15'
    },
    {
      title: 'Desarrollo del MVP e Interfaz Principal',
      description: 'Construir pantallas principales y conexión con servicios del ecosistema.',
      reward: 100,
      points: 50,
      deadline: '2026-09-01'
    }
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAddTaskField = () => {
    setTasksList(prev => [
      ...prev,
      { title: '', description: '', reward: 40, points: 20, deadline: deadline }
    ]);
  };

  const handleRemoveTaskField = (index: number) => {
    setTasksList(prev => prev.filter((_, i) => i !== index));
  };

  const handleTaskChange = (index: number, field: string, value: any) => {
    setTasksList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !description.trim()) {
      setErrorMsg('Por favor completa el título y la descripción del proyecto.');
      return;
    }

    const parsedSkills = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    setSubmitting(true);
    try {
      const newProjData: Partial<Project> = {
        title,
        category,
        description,
        longDescription: longDescription || description,
        requiredSkills: parsedSkills.length > 0 ? parsedSkills : ['Colaboración'],
        fichasPool: Number(fichasPool),
        fichasRequiredToJoin: Number(fichasRequiredToJoin),
        deadline,
        imageUrl,
        status: 'recruiting',
        ownerId: userProfile?.uid || 'demo-user-123',
        ownerName: userProfile?.displayName || 'Usuario Colaborador',
        ownerAvatar: userProfile?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        members: [
          {
            userId: userProfile?.uid || 'demo-user-123',
            userName: userProfile?.displayName || 'Usuario Colaborador',
            userAvatar: userProfile?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
            role: 'Líder del Proyecto',
            fichasStaked: Number(fichasRequiredToJoin),
            joinedAt: new Date().toISOString().split('T')[0],
            status: 'active'
          }
        ],
        tasksCount: tasksList.length,
        completedTasksCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };

      await onCreateProject(newProjData, tasksList);
      setSubmitting(false);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Ocurrió un error al publicar el proyecto.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 my-8 p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Publicar Nuevo Proyecto</h2>
            <p className="text-xs text-slate-400">Expón tu idea y reúne talento colaborativo del ecosistema</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Título del Proyecto</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Plataforma AgroIA de Monitoreo"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción Corta (Resumen)</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Un resumen de 1 a 2 oraciones para mostrar en la tarjeta..."
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Detalles & Visión del Proyecto</label>
            <textarea
              rows={3}
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Explica en detalle los objetivos, impacto y el perfil de los colaboradores que buscas..."
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Skills required & Cover Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Habilidades Requeridas (separadas por coma)</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="React, Python, Figma, Marketing"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">URL Imagen Portada (Opcional)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Tokens Pool & Required to join */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="block text-[11px] font-semibold text-amber-400 mb-1">Fondo de Recompensas (Fichas)</label>
              <input
                type="number"
                min={50}
                max={5000}
                value={fichasPool}
                onChange={(e) => setFichasPool(Number(e.target.value))}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-amber-400 font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-indigo-400 mb-1">Fichas para Unirse (Stake)</label>
              <input
                type="number"
                min={5}
                max={200}
                value={fichasRequiredToJoin}
                onChange={(e) => setFichasRequiredToJoin(Number(e.target.value))}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-indigo-400 font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Fecha Límite</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Initial Tasks Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider">Tareas Iniciales del Proyecto</label>
              <button
                type="button"
                onClick={handleAddTaskField}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Tarea</span>
              </button>
            </div>

            <div className="space-y-3">
              {tasksList.map((task, idx) => (
                <div key={idx} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 relative space-y-2">
                  {tasksList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTaskField(idx)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Título de la tarea..."
                      value={task.title}
                      onChange={(e) => handleTaskChange(idx, 'title', e.target.value)}
                      className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none"
                    />

                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="Recompensa Fichas"
                          value={task.reward}
                          onChange={(e) => handleTaskChange(idx, 'reward', Number(e.target.value))}
                          className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-amber-400 font-semibold focus:outline-none"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="Pts Reputación"
                          value={task.points}
                          onChange={(e) => handleTaskChange(idx, 'points', Number(e.target.value))}
                          className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-indigo-400 font-semibold focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Descripción rápida del entregable..."
                    value={task.description}
                    onChange={(e) => handleTaskChange(idx, 'description', e.target.value)}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition mt-6"
          >
            {submitting ? (
              <span>Publicando proyecto...</span>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                <span>Publicar Proyecto en el Ecosistema</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
