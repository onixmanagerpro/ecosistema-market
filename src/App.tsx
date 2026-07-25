import React, { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  setDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './lib/firebase';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetailsModal } from './components/ProjectDetailsModal';
import { CreateProjectModal } from './components/CreateProjectModal';
import { TaskBoard } from './components/TaskBoard';
import { MessagingView } from './components/MessagingView';
import { ReputationView } from './components/ReputationView';
import { FichasModal } from './components/FichasModal';
import { AuthModal } from './components/AuthModal';
import { NotificationPopover } from './components/NotificationPopover';
import { CollaboratorProgress } from './components/CollaboratorProgress';
import { 
  initialProjects, 
  initialTasks, 
  initialMessages, 
  initialNotifications 
} from './data/seedData';
import { 
  Project, 
  Task, 
  ChatMessage, 
  NotificationItem, 
  ReputationHistoryItem,
  ProjectCategory,
  TaskStatus
} from './types';
import { 
  Rocket, 
  Search, 
  Filter, 
  Layers, 
  Plus, 
  Award, 
  Coins, 
  CheckCircle2, 
  Kanban, 
  Sparkles,
  Users
} from 'lucide-react';

function AppContent() {
  const { userProfile, updateProfileData, addFichas, isDemoMode } = useAuth();

  // Navigation & View States
  const [activeTab, setActiveTab] = useState<string>('explorar');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProjectIdForTasks, setSelectedProjectIdForTasks] = useState<string>('all');
  const [selectedChatChannelId, setSelectedChatChannelId] = useState<string>('proj-1');

  // Modals States
  const [isFichasModalOpen, setIsFichasModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<Project | null>(null);

  // App Main Data Collections
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [reputationHistory, setReputationHistory] = useState<ReputationHistoryItem[]>([
    {
      id: 'rep-1',
      userId: userProfile?.uid || 'demo-user-123',
      points: 25,
      reason: 'Diseño Mockups Dashboard EcoTracker',
      projectTitle: 'EcoTracker',
      createdAt: '2026-07-10'
    },
    {
      id: 'rep-2',
      userId: userProfile?.uid || 'demo-user-123',
      points: 40,
      reason: 'Integración API Cálculo Co2',
      projectTitle: 'EcoTracker',
      createdAt: '2026-07-18'
    }
  ]);

  // Firestore Realtime Synchronization
  useEffect(() => {
    try {
      // Sync Projects
      const projectsRef = collection(db, 'projects');
      const unsubProjects = onSnapshot(projectsRef, (snapshot) => {
        if (!snapshot.empty) {
          const fetchedProjects: Project[] = [];
          snapshot.forEach(docSnap => {
            fetchedProjects.push({ id: docSnap.id, ...docSnap.data() } as Project);
          });
          setProjects(fetchedProjects);
        }
      }, (err) => console.log('Firestore offline fallback for projects:', err.message));

      // Sync Tasks
      const tasksRef = collection(db, 'tasks');
      const unsubTasks = onSnapshot(tasksRef, (snapshot) => {
        if (!snapshot.empty) {
          const fetchedTasks: Task[] = [];
          snapshot.forEach(docSnap => {
            fetchedTasks.push({ id: docSnap.id, ...docSnap.data() } as Task);
          });
          setTasks(fetchedTasks);
        }
      }, (err) => console.log('Firestore offline fallback for tasks:', err.message));

      // Sync Messages
      const messagesRef = collection(db, 'messages');
      const unsubMessages = onSnapshot(messagesRef, (snapshot) => {
        if (!snapshot.empty) {
          const fetchedMsgs: ChatMessage[] = [];
          snapshot.forEach(docSnap => {
            fetchedMsgs.push({ id: docSnap.id, ...docSnap.data() } as ChatMessage);
          });
          setMessages(fetchedMsgs);
        }
      }, (err) => console.log('Firestore offline fallback for messages:', err.message));

      return () => {
        unsubProjects();
        unsubTasks();
        unsubMessages();
      };
    } catch (e) {
      console.log('Firebase local sync mode');
    }
  }, []);

  // Filtered Projects for Ecosystem View
  const filteredProjects = projects.filter(p => {
    const matchesCategory = selectedCategoryFilter === 'Todas' || p.category === selectedCategoryFilter;
    const matchesSearch = searchQuery === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Action: Create Project
  const handleCreateProject = async (newProjData: Partial<Project>, initialTasksList: Array<any>) => {
    const projId = `proj-${Date.now()}`;
    const fullProj: Project = {
      id: projId,
      title: newProjData.title || 'Nuevo Proyecto',
      description: newProjData.description || '',
      longDescription: newProjData.longDescription || '',
      category: newProjData.category || 'Tecnología y Software',
      status: 'recruiting',
      ownerId: userProfile?.uid || 'demo-user-123',
      ownerName: userProfile?.displayName || 'Usuario Colaborador',
      ownerAvatar: userProfile?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      requiredSkills: newProjData.requiredSkills || [],
      fichasPool: newProjData.fichasPool || 300,
      fichasRequiredToJoin: newProjData.fichasRequiredToJoin || 20,
      deadline: newProjData.deadline || '2026-10-30',
      imageUrl: newProjData.imageUrl,
      members: newProjData.members || [],
      tasksCount: initialTasksList.length,
      completedTasksCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Save to State & Firestore
    setProjects(prev => [fullProj, ...prev]);
    try {
      await setDoc(doc(db, 'projects', projId), fullProj);
    } catch (e) { console.error(e); }

    // Save Initial Tasks
    const newTasks: Task[] = initialTasksList.map((t, idx) => ({
      id: `task-${Date.now()}-${idx}`,
      projectId: projId,
      projectTitle: fullProj.title,
      title: t.title,
      description: t.description,
      status: 'todo',
      fichasReward: t.reward,
      reputationPoints: t.points,
      deadline: t.deadline,
      createdAt: new Date().toISOString().split('T')[0]
    }));

    setTasks(prev => [...newTasks, ...prev]);
    for (const t of newTasks) {
      try { await setDoc(doc(db, 'tasks', t.id), t); } catch (e) { }
    }

    // Add welcome notification
    addNotification({
      title: '🚀 Proyecto publicado con éxito',
      message: `Tu proyecto "${fullProj.title}" ya está visible en el ecosistema.`,
      type: 'application'
    });
  };

  // Action: Join Project
  const handleJoinProject = async (projectId: string, role: string, pitch: string, fichasStaked: number) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    const newMember = {
      userId: userProfile?.uid || 'demo-user-123',
      userName: userProfile?.displayName || 'Alex Rivera',
      userAvatar: userProfile?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      role,
      fichasStaked,
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'active' as const
    };

    const updatedMembers = [...proj.members, newMember];

    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, members: updatedMembers } : p));
    
    try {
      await updateDoc(doc(db, 'projects', projectId), { members: updatedMembers });
    } catch (e) { console.error(e); }

    addNotification({
      title: '🎉 Te has unido al proyecto',
      message: `Te has integrado como "${role}" en ${proj.title}. Se han comprometido ${fichasStaked} fichas.`,
      type: 'application',
      linkId: projectId
    });

    // Add System Chat Message
    addChatMessage(projectId, `🎉 ${userProfile?.displayName || 'Un nuevo colaborador'} se ha unido como ${role}.`, 'system');
  };

  // Action: Update Task Status
  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus, assignedUserId?: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updates: Partial<Task> = { 
      status: newStatus,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (assignedUserId) {
      updates.assignedToId = assignedUserId;
      updates.assignedToName = userProfile?.displayName || 'Alex Rivera';
      updates.assignedToAvatar = userProfile?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';
    }

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));

    try {
      await updateDoc(doc(db, 'tasks', taskId), updates);
    } catch (e) { console.error(e); }

    // If task is completed -> AWARD REPUTATION & TOKENS!
    if (newStatus === 'completed') {
      const rewardUser = assignedUserId || userProfile?.uid || 'demo-user-123';
      const pointsEarned = task.reputationPoints || 25;
      const fichasEarned = task.fichasReward || 50;

      // Update current user profile if it was me or demo user
      const newScore = (userProfile?.reputationScore || 0) + pointsEarned;
      const newCollabs = (userProfile?.completedCollaborations || 0) + 1;

      await updateProfileData({
        reputationScore: newScore,
        completedCollaborations: newCollabs
      });

      await addFichas(fichasEarned);

      // Record reputation history
      const newRepItem: ReputationHistoryItem = {
        id: `rep-${Date.now()}`,
        userId: rewardUser,
        points: pointsEarned,
        reason: `Completó la tarea: "${task.title}"`,
        projectTitle: task.projectTitle,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setReputationHistory(prev => [newRepItem, ...prev]);

      // Update project completed tasks counter
      setProjects(prev => prev.map(p => {
        if (p.id === task.projectId) {
          return { ...p, completedTasksCount: p.completedTasksCount + 1 };
        }
        return p;
      }));

      // Trigger Notification
      addNotification({
        title: '🏆 Tarea Aprobada & Recompensa Transferida',
        message: `¡Completaste "${task.title}"! Recibiste +${fichasEarned} Fichas y +${pointsEarned} Puntos de Reputación.`,
        type: 'reputation',
        linkId: task.id
      });

      // System chat message
      addChatMessage(
        task.projectId, 
        `✅ La tarea "${task.title}" fue aprobada y completada. ¡Felicidades a ${task.assignedToName || 'colaborador'} por ganar ${fichasEarned} fichas!`, 
        'system'
      );
    }
  };

  // Action: Add Task
  const handleAddTask = async (taskData: Partial<Task>) => {
    const taskId = `task-${Date.now()}`;
    const newTask: Task = {
      id: taskId,
      projectId: taskData.projectId || 'proj-1',
      projectTitle: taskData.projectTitle || 'Proyecto',
      title: taskData.title || 'Nueva Tarea',
      description: taskData.description || '',
      status: 'todo',
      fichasReward: taskData.fichasReward || 40,
      reputationPoints: taskData.reputationPoints || 20,
      deadline: taskData.deadline || '2026-09-01',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTasks(prev => [newTask, ...prev]);

    // Update project tasks count
    setProjects(prev => prev.map(p => p.id === newTask.projectId ? { ...p, tasksCount: p.tasksCount + 1 } : p));

    try {
      await setDoc(doc(db, 'tasks', taskId), newTask);
    } catch (e) { console.error(e); }

    addNotification({
      title: '📋 Nueva tarea disponible',
      message: `Se ha publicado la tarea "${newTask.title}" en ${newTask.projectTitle}.`,
      type: 'task',
      linkId: taskId
    });
  };

  // Action: Send Chat Message
  const handleSendMessage = async (projectId: string, content: string) => {
    const msgId = `msg-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: msgId,
      projectId,
      senderId: userProfile?.uid || 'demo-user-123',
      senderName: userProfile?.displayName || 'Alex Rivera',
      senderAvatar: userProfile?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setMessages(prev => [...prev, newMsg]);

    try {
      await setDoc(doc(db, 'messages', msgId), newMsg);
    } catch (e) { console.error(e); }
  };

  const addChatMessage = (projectId: string, content: string, type: 'text' | 'system' = 'system') => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      projectId,
      senderId: 'system',
      senderName: 'Sistema CollabHub',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const addNotification = (notif: { title: string; message: string; type: NotificationItem['type']; linkId?: string }) => {
    const newItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: userProfile?.uid || 'demo-user-123',
      title: notif.title,
      message: notif.message,
      type: notif.type,
      read: false,
      linkId: notif.linkId,
      createdAt: 'Ahora mismo'
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        unreadNotificationsCount={notifications.filter(n => !n.read).length}
        onOpenFichasModal={() => setIsFichasModalOpen(true)}
        onOpenCreateProjectModal={() => setIsCreateProjectModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
      />

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        
        {/* VIEW 1: EXPLORAR PROYECTOS (Bento Grid Ecosystem Showcase) */}
        {activeTab === 'explorar' && (
          <div className="space-y-8">
            
            {/* Bento Grid Featured Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Left Bento Tile: Profile & Reputation */}
              <div className="lg:col-span-3 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-between">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 p-1 shadow-lg shadow-indigo-500/10">
                      <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
                        <img 
                          src={userProfile?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} 
                          alt="Avatar" 
                          className="w-20 h-20 object-cover rounded-full"
                        />
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-950 uppercase ring-4 ring-slate-950 shadow-md">
                      Nivel {Math.floor((userProfile?.reputationScore || 100) / 10) || 12}
                    </div>
                  </div>

                  <h2 className="mt-4 text-lg font-bold text-white">{userProfile?.displayName || 'Julian Duarte'}</h2>
                  <p className="text-slate-400 text-xs italic">{userProfile?.badge || 'Full Stack Architect'}</p>
                </div>

                <div className="w-full h-[1px] bg-slate-800 my-4" />

                <div className="w-full flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Reputación</span>
                    <span className="text-emerald-400 font-mono font-bold">{( (userProfile?.reputationScore || 185) / 40 ).toFixed(2)} / 5</span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[94%] shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-700/50">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Colabs</p>
                      <p className="text-base font-bold text-white">{userProfile?.completedCollaborations || 128}</p>
                    </div>
                    <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-700/50">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Fichas</p>
                      <p className="text-base font-bold text-amber-400">{userProfile?.fichasBalance || 42}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Bento Tile: Featured Projects Showcase */}
              <div className="lg:col-span-6 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-6 bg-indigo-500 rounded-full" />
                      Proyectos Destacados del Ecosistema
                    </h3>
                    <button 
                      onClick={() => {
                        setActiveTab('explorar');
                        setSelectedCategoryFilter('Todas');
                        setSearchQuery('');
                        setTimeout(() => {
                          document.getElementById('todos-los-proyectos')?.scrollIntoView({ behavior: 'smooth' });
                        }, 50);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      Ver todos ({projects.length}) →
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {projects.slice(0, 2).map((proj) => (
                      <div 
                        key={proj.id}
                        onClick={() => setSelectedProjectForDetail(proj)}
                        className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-3xl hover:bg-slate-800/70 transition-all cursor-pointer flex gap-4 items-center"
                      >
                        <div className="w-14 h-14 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center text-2xl shrink-0">
                          {proj.category.includes('IA') ? '🧪' : proj.category.includes('Diseño') ? '🛰️' : '🚀'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-white truncate">{proj.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{proj.description}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold rounded-md border border-indigo-500/20">
                              {proj.category.split(' ')[0]}
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold rounded-md border border-emerald-500/20">
                              Activo
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className="text-xs text-amber-400 font-bold font-mono">{proj.fichasPool} Fichas</span>
                          <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[10px] font-bold text-white uppercase tracking-wider transition">
                            Unirse
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>💡 Tareas activas listadas: {tasks.filter(t => t.status !== 'completed').length}</span>
                  <button 
                    onClick={() => setIsCreateProjectModalOpen(true)}
                    className="text-xs font-bold text-indigo-400 hover:underline"
                  >
                    + Publicar nuevo proyecto
                  </button>
                </div>
              </div>

              {/* Right Bento Tile: Integrated Messaging Preview */}
              <div className="lg:col-span-3 bg-slate-900/50 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
                    <h3 className="font-bold text-white text-sm">Mensajería en Vivo</h3>
                  </div>

                  <div className="space-y-3 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-[10px] text-slate-400 ml-1">Lucas (Lead)</span>
                      <div className="bg-slate-800 rounded-2xl rounded-tl-none p-2.5 text-xs text-slate-200 border border-slate-700/50">
                        ¡Bienvenidos! ¿Podemos revisar la entrega de las tareas hoy?
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-[10px] text-slate-400 mr-1">Tú</span>
                      <div className="bg-indigo-600 rounded-2xl rounded-tr-none p-2.5 text-xs text-white shadow-md">
                        Claro, enviaré las fichas y entregables a revisión.
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('mensajes')}
                  className="w-full mt-3 py-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-bold text-indigo-400 text-center transition"
                >
                  Abrir Sala de Mensajes →
                </button>
              </div>

              {/* Bottom Left Bento Tile: Task Manager Quick View */}
              <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Kanban className="w-4 h-4 text-indigo-400" />
                    <span>Gestión de Tareas Activas</span>
                  </h3>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-900" />
                    <div className="w-6 h-6 rounded-full bg-indigo-700 border border-slate-900 text-[8px] font-bold flex items-center justify-center text-white">+3</div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 bg-slate-800/30 p-2.5 rounded-2xl border border-slate-800">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${task.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-indigo-500/50'}`}>
                        {task.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-slate-950" />}
                      </div>
                      <span className="text-xs text-slate-200 flex-1 truncate font-medium">{task.title}</span>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        +{task.fichasReward} 🪙
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Right Bento Tile: Deadlines & Progress */}
              <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">Notificaciones de Plazos y Sprints</h3>
                  <div className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Sincronizado</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative p-4 bg-slate-950/40 rounded-2xl border-l-4 border-amber-500">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Sprint Final: OpenBio</p>
                    <p className="text-sm font-bold text-white mt-1">En 4 horas</p>
                    <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full">
                      <div className="bg-amber-500 h-full w-[85%] rounded-full" />
                    </div>
                  </div>

                  <div className="relative p-4 bg-slate-950/40 rounded-2xl border-l-4 border-indigo-500">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Review: UI System</p>
                    <p className="text-sm font-bold text-white mt-1">Mañana, 10:00 AM</p>
                    <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full">
                      <div className="bg-indigo-500 h-full w-[40%] rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-[11px] text-slate-400">Progreso Global Colab: 72%</span>
                  </div>
                  <button 
                    onClick={() => setActiveTab('panel')}
                    className="text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl transition"
                  >
                    Ver Panel Completo
                  </button>
                </div>
              </div>

            </div>

            {/* Search & Category Filter Bar */}
            <div id="todos-los-proyectos" className="scroll-mt-24 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/50 border border-slate-800 p-4 rounded-3xl">
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar proyectos, tecnologías o roles..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs no-scrollbar">
                {['Todas', 'Tecnología y Software', 'IA y Ciencia de Datos', 'Diseño y Arte', 'Sostenibilidad y Medio Ambiente', 'Educación y Comunidad'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-3.5 py-2 rounded-xl font-medium transition whitespace-nowrap ${
                      selectedCategoryFilter === cat 
                        ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20' 
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>

            {/* Projects Directory Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-indigo-400" />
                  <span>Todos los Proyectos del Ecosistema ({filteredProjects.length})</span>
                </h2>
              </div>

              {filteredProjects.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
                  <Layers className="w-12 h-12 mx-auto mb-3 opacity-30 text-indigo-400" />
                  <p className="text-sm font-semibold">No se encontraron proyectos con el criterio seleccionado.</p>
                  <p className="text-xs mt-1">Sé el primero en exponer un nuevo proyecto en esta categoría.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => {
                    const isMember = project.members.some(m => m.userId === (userProfile?.uid || 'demo-user-123'));
                    return (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        isUserMember={isMember}
                        onSelectProject={(p) => setSelectedProjectForDetail(p)}
                        onJoinClick={(p) => setSelectedProjectForDetail(p)}
                      />
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* VIEW 2: PANEL DE CONTROL DE TAREAS Y SEGUIMIENTO */}
        {activeTab === 'panel' && (
          <div className="space-y-8">
            <TaskBoard
              tasks={tasks}
              projects={projects}
              selectedProjectId={selectedProjectIdForTasks}
              onSelectProjectFilter={setSelectedProjectIdForTasks}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onAddTask={handleAddTask}
            />

            {/* Collaborator Progress Tracking Section */}
            {projects.length > 0 && (
              <CollaboratorProgress
                project={projects.find(p => p.id === (selectedProjectIdForTasks === 'all' ? projects[0].id : selectedProjectIdForTasks)) || projects[0]}
                tasks={tasks}
                onOpenDirectChat={(cId, cName) => {
                  setActiveTab('mensajes');
                }}
              />
            )}
          </div>
        )}

        {/* VIEW 3: MENSAJERÍA INTEGRADA */}
        {activeTab === 'mensajes' && (
          <MessagingView
            projects={projects}
            messages={messages}
            selectedChatId={selectedChatChannelId}
            onSelectChat={setSelectedChatChannelId}
            onSendMessage={handleSendMessage}
          />
        )}

        {/* VIEW 4: SISTEMA DE REPUTACIÓN */}
        {activeTab === 'reputacion' && (
          <ReputationView
            reputationHistory={reputationHistory}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">CollabHub Ecosistema</span>
            <span>— Plataforma de Colaboración por Tokens & Reputación</span>
          </div>
          <div className="text-slate-600">
            Conectado con Firebase Firestore y Auth
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <FichasModal
        isOpen={isFichasModalOpen}
        onClose={() => setIsFichasModalOpen(false)}
      />

      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <ProjectDetailsModal
        project={selectedProjectForDetail}
        tasks={tasks}
        isUserMember={selectedProjectForDetail?.members.some(m => m.userId === (userProfile?.uid || 'demo-user-123')) || false}
        onClose={() => setSelectedProjectForDetail(null)}
        onApplyOrJoin={handleJoinProject}
      />

      <NotificationPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationRead}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
