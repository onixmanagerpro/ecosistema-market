export type ProjectCategory = 
  | 'Tecnología y Software'
  | 'Diseño y Arte'
  | 'IA y Ciencia de Datos'
  | 'Sostenibilidad y Medio Ambiente'
  | 'Educación y Comunidad'
  | 'Negocios y Startups';

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'completed';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  skills: string[];
  reputationScore: number; // Points earned from completed tasks
  completedCollaborations: number; // Total tasks/projects completed
  fichasBalance: number; // Token balance
  badge: 'Novato' | 'Colaborador Activo' | 'Especialista' | 'Colaborador Élite' | 'Leyenda del Ecosistema';
  createdAt: string;
}

export interface ProjectMember {
  userId: string;
  userName: string;
  userAvatar?: string;
  role: string;
  fichasStaked: number;
  joinedAt: string;
  status: 'active' | 'pending' | 'completed';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: ProjectCategory;
  status: 'recruiting' | 'in_progress' | 'completed';
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  requiredSkills: string[];
  fichasPool: number; // Total reward tokens reserved
  fichasRequiredToJoin: number; // Tokens required to stake or participate
  deadline: string; // ISO date string or formatted date
  members: ProjectMember[];
  tasksCount: number;
  completedTasksCount: number;
  createdAt: string;
  imageUrl?: string;
}

export interface Task {
  id: string;
  projectId: string;
  projectTitle?: string;
  title: string;
  description: string;
  assignedToId?: string;
  assignedToName?: string;
  assignedToAvatar?: string;
  status: TaskStatus;
  fichasReward: number;
  deadline: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt?: string;
  reputationPoints: number;
}

export interface ChatMessage {
  id: string;
  projectId?: string;
  conversationId?: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string; // formatted or ISO
  type?: 'text' | 'system' | 'task_link';
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'task' | 'application' | 'deadline' | 'reputation' | 'chat';
  read: boolean;
  linkId?: string; // projectId or taskId
  createdAt: string;
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  projectTitle: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar?: string;
  applicantSkills: string[];
  applicantReputation: number;
  roleApplied: string;
  pitch: string;
  fichasStaked: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface ReputationHistoryItem {
  id: string;
  userId: string;
  points: number;
  reason: string;
  projectId?: string;
  projectTitle?: string;
  createdAt: string;
}
