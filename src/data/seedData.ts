import { Project, Task, ChatMessage, NotificationItem, UserProfile } from '../types';

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'EcoTracker - Huella de Carbono Personal con IA',
    description: 'Aplicación para calcular y reducir el impacto ambiental individual utilizando recomendación inteligente de hábitos y escaneo de productos.',
    longDescription: 'EcoTracker es una plataforma comunitaria abierta que busca empoderar a los ciudadanos para medir y compensar su huella de carbono diaria. Incorpora modelos de aprendizaje automático para categorizar consumos y recompensar las prácticas sostenibles con fichas del ecosistema.',
    category: 'Sostenibilidad y Medio Ambiente',
    status: 'recruiting',
    ownerId: 'user-elena',
    ownerName: 'Elena Rostova',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    requiredSkills: ['React', 'Python', 'UX/UI Design', 'Sustainability AI'],
    fichasPool: 500,
    fichasRequiredToJoin: 25,
    deadline: '2026-09-30',
    members: [
      {
        userId: 'user-elena',
        userName: 'Elena Rostova',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: 'Líder del Proyecto & UX',
        fichasStaked: 100,
        joinedAt: '2026-06-01',
        status: 'active'
      },
      {
        userId: 'user-carlos',
        userName: 'Carlos Méndez',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        role: 'Desarrollador FullStack',
        fichasStaked: 25,
        joinedAt: '2026-06-10',
        status: 'active'
      }
    ],
    tasksCount: 6,
    completedTasksCount: 2,
    createdAt: '2026-06-01',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'proj-2',
    title: 'DeFi Wallet para Microfinanzas Rurales',
    description: 'Billetera descentralizada simplificada para apoyar pequeñas cooperativas agrícolas con microcréditos transparentes.',
    longDescription: 'Buscamos eliminar intermediarios en la financiación agrícola conectando directamente inversores sociales con pequeños agricultores. Interfaz ultra accesible sin fricción técnica.',
    category: 'Tecnología y Software',
    status: 'in_progress',
    ownerId: 'user-mateo',
    ownerName: 'Mateo Silva',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    requiredSkills: ['Smart Contracts', 'Web3', 'Mobile Dev', 'Marketing Strategy'],
    fichasPool: 800,
    fichasRequiredToJoin: 40,
    deadline: '2026-11-15',
    members: [
      {
        userId: 'user-mateo',
        userName: 'Mateo Silva',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        role: 'Product Owner',
        fichasStaked: 150,
        joinedAt: '2026-05-15',
        status: 'active'
      },
      {
        userId: 'user-sofia',
        userName: 'Sofía Valenzuela',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        role: 'Blockchain Developer',
        fichasStaked: 40,
        joinedAt: '2026-05-20',
        status: 'active'
      }
    ],
    tasksCount: 8,
    completedTasksCount: 4,
    createdAt: '2026-05-15',
    imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'proj-3',
    title: 'Plataforma EduMentor - Apoyo Escolar Accesible',
    description: 'Red comunitaria de tutorías gratuitas impulsada por estudiantes universitarios con recompensas en habilidades e insignias.',
    longDescription: 'EduMentor conecta estudiantes de secundaria en zonas vulnerables con universitarios mentores. El progreso académico activa reconocimientos y fichas canjeables por cursos avanzados.',
    category: 'Educación y Comunidad',
    status: 'recruiting',
    ownerId: 'user-lucia',
    ownerName: 'Lucía Torres',
    ownerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    requiredSkills: ['Pedagogía', 'Diseño de Interacción', 'Frontend React', 'Copywriting'],
    fichasPool: 350,
    fichasRequiredToJoin: 20,
    deadline: '2026-08-30',
    members: [
      {
        userId: 'user-lucia',
        userName: 'Lucía Torres',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
        role: 'Coordinadora General',
        fichasStaked: 80,
        joinedAt: '2026-06-12',
        status: 'active'
      }
    ],
    tasksCount: 5,
    completedTasksCount: 1,
    createdAt: '2026-06-12',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600'
  }
];

export const initialTasks: Task[] = [
  {
    id: 'task-101',
    projectId: 'proj-1',
    projectTitle: 'EcoTracker - Huella de Carbono',
    title: 'Diseñar Mockups del Dashboard Principal',
    description: 'Crear componentes de gráficos para visualización de emisiones semanales y desglose por categorías (transporte, alimentación, energía).',
    assignedToId: 'user-elena',
    assignedToName: 'Elena Rostova',
    assignedToAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    status: 'completed',
    fichasReward: 50,
    reputationPoints: 25,
    deadline: '2026-07-10',
    createdAt: '2026-06-02'
  },
  {
    id: 'task-102',
    projectId: 'proj-1',
    projectTitle: 'EcoTracker - Huella de Carbono',
    title: 'Integrar API de Cálculo de Emisiones de Co2',
    description: 'Conectar endpoint del backend para calcular huella en función de kilómetros recorridos e insumos consumidos.',
    assignedToId: 'user-carlos',
    assignedToName: 'Carlos Méndez',
    assignedToAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    status: 'in_progress',
    fichasReward: 80,
    reputationPoints: 40,
    deadline: '2026-07-28',
    createdAt: '2026-06-15'
  },
  {
    id: 'task-103',
    projectId: 'proj-1',
    projectTitle: 'EcoTracker - Huella de Carbono',
    title: 'Crear Sistema de Insignias y Logros Ambientales',
    description: 'Diseñar e implementar lógica para desbloquear medallas al mantener 7 días seguidos reduciendo emisiones.',
    status: 'todo',
    fichasReward: 60,
    reputationPoints: 30,
    deadline: '2026-08-05',
    createdAt: '2026-06-20'
  },
  {
    id: 'task-104',
    projectId: 'proj-1',
    projectTitle: 'EcoTracker - Huella de Carbono',
    title: 'Testing de Usabilidad y Modales de Consejos',
    description: 'Revisión final de experiencia de usuario en dispositivos móviles y ajuste de contrastes.',
    status: 'in_review',
    assignedToId: 'user-carlos',
    assignedToName: 'Carlos Méndez',
    assignedToAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    fichasReward: 40,
    reputationPoints: 20,
    deadline: '2026-07-26',
    createdAt: '2026-07-01'
  },
  {
    id: 'task-201',
    projectId: 'proj-2',
    projectTitle: 'DeFi Wallet Rural',
    title: 'Audit de Seguridad en Contratos Inteligentes',
    description: 'Verificar vulnerabilidades en funciones de transferencia y depósito de microcréditos.',
    assignedToId: 'user-sofia',
    assignedToName: 'Sofía Valenzuela',
    assignedToAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    status: 'in_review',
    fichasReward: 120,
    reputationPoints: 60,
    deadline: '2026-07-30',
    createdAt: '2026-06-10'
  }
];

export const initialMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    projectId: 'proj-1',
    senderId: 'user-elena',
    senderName: 'Elena Rostova',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    content: '¡Bienvenidos al equipo de EcoTracker! Ya tenemos los primeros prototipos listos en el panel de tareas.',
    timestamp: '10:30 AM'
  },
  {
    id: 'msg-2',
    projectId: 'proj-1',
    senderId: 'user-carlos',
    senderName: 'Carlos Méndez',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    content: 'Excelente Elena, estoy avanzando con la API de emisiones. Debería estar lista para revisión este viernes.',
    timestamp: '10:42 AM'
  },
  {
    id: 'msg-3',
    projectId: 'proj-1',
    senderId: 'user-elena',
    senderName: 'Elena Rostova',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    content: 'Perfecto, recuerda que cada tarea completada otorga reputación e incrementa tus fichas en la comunidad. 🌟',
    timestamp: '10:45 AM'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'current-user',
    title: '⏰ Próximo vencimiento de tarea',
    message: 'La tarea "Testing de Usabilidad" vence en menos de 48 horas (26 Jul).',
    type: 'deadline',
    read: false,
    linkId: 'task-104',
    createdAt: 'Hace 1 hora'
  },
  {
    id: 'notif-2',
    userId: 'current-user',
    title: '🌟 Nueva insignia alcanzada',
    message: 'Has alcanzado el nivel "Colaborador Activo" con 145 puntos de reputación.',
    type: 'reputation',
    read: false,
    createdAt: 'Hace 3 horas'
  },
  {
    id: 'notif-3',
    userId: 'current-user',
    title: '📩 Solicitud de colaboración aceptada',
    message: 'Elena te ha aceptado en el proyecto "EcoTracker". Se han reservado 25 fichas.',
    type: 'application',
    read: true,
    linkId: 'proj-1',
    createdAt: 'Ayer'
  }
];

export const demoUser: UserProfile = {
  uid: 'demo-user-123',
  email: 'colaborador@ecosistema.io',
  displayName: 'Alex Rivera',
  photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
  bio: 'Desarrollador FullStack & entusiasta del software de impacto social. Apasionado por la economía colaborativa.',
  skills: ['React', 'TypeScript', 'Node.js', 'UI/UX', 'TailwindCSS'],
  reputationScore: 185,
  completedCollaborations: 7,
  fichasBalance: 150,
  badge: 'Colaborador Activo',
  createdAt: '2026-01-10'
};
