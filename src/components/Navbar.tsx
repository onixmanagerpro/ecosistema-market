import React, { useState } from 'react';
import { 
  Rocket, 
  Kanban, 
  MessageSquare, 
  Award, 
  Coins, 
  Bell, 
  Plus, 
  User as UserIcon, 
  LogOut, 
  Sparkles,
  ChevronDown,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NotificationItem } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: NotificationItem[];
  onOpenFichasModal: () => void;
  onOpenCreateProjectModal: () => void;
  onOpenAuthModal: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenFichasModal,
  onOpenCreateProjectModal,
  onOpenAuthModal,
  onOpenNotifications,
  unreadNotificationsCount
}) => {
  const { userProfile, isDemoMode, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('explorar')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              Σ
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-white tracking-tight">Collab<span className="text-indigo-400">Hub</span></span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Bento Grid
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Ecosistema & Fichas</p>
            </div>
          </button>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('explorar')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'explorar' 
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Rocket className="w-4 h-4" />
              <span>Proyectos</span>
            </button>

            <button
              onClick={() => setActiveTab('panel')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'panel' 
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Panel & Tareas</span>
            </button>

            <button
              onClick={() => setActiveTab('mensajes')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'mensajes' 
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Mensajería</span>
            </button>

            <button
              onClick={() => setActiveTab('reputacion')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'reputacion' 
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Reputación</span>
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Fichas Balance Token Pill */}
          <button
            onClick={onOpenFichasModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-semibold transition group"
            title="Ver saldo e historial de fichas"
          >
            <Coins className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>{userProfile?.fichasBalance || 0}</span>
            <span className="hidden sm:inline text-[11px] text-amber-500/80">Fichas</span>
          </button>

          {/* Notifications Bell Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Notificaciones en tiempo real"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Create Project Button */}
          <button
            onClick={onOpenCreateProjectModal}
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Proyecto</span>
          </button>

          {/* User Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800/80 transition text-left"
            >
              <img
                src={userProfile?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                alt={userProfile?.displayName}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/30"
              />
              <div className="hidden lg:block text-xs">
                <div className="font-semibold text-slate-200">{userProfile?.displayName || 'Usuario'}</div>
                <div className="text-[10px] text-indigo-400 font-medium">{userProfile?.badge || 'Novato'}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            {/* Dropdown Content */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 text-slate-200 text-xs animate-in fade-in zoom-in-95">
                <div className="p-2 bg-slate-800/50 rounded-xl mb-2">
                  <p className="font-bold text-white text-sm">{userProfile?.displayName}</p>
                  <p className="text-slate-400 truncate mt-0.5">{userProfile?.email}</p>
                  <div className="mt-2 pt-2 border-t border-slate-700/50 flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Reputación:</span>
                    <span className="font-semibold text-indigo-400">⭐ {userProfile?.reputationScore || 0} pts</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('reputacion');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center gap-2 transition"
                  >
                    <Award className="w-4 h-4 text-indigo-400" />
                    <span>Insignias y Reputación</span>
                  </button>

                  {isDemoMode ? (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenAuthModal();
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center gap-2 text-indigo-400 transition"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Registrarse / Iniciar Sesión</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-rose-500/10 text-rose-400 flex items-center gap-2 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Subnav Bar */}
      <div className="md:hidden flex items-center justify-around mt-3 pt-2 border-t border-slate-800/60 text-xs font-medium">
        <button
          onClick={() => setActiveTab('explorar')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'explorar' ? 'text-indigo-400' : 'text-slate-400'}`}
        >
          <Rocket className="w-4 h-4" />
          <span>Explorar</span>
        </button>
        <button
          onClick={() => setActiveTab('panel')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'panel' ? 'text-indigo-400' : 'text-slate-400'}`}
        >
          <Kanban className="w-4 h-4" />
          <span>Tareas</span>
        </button>
        <button
          onClick={() => setActiveTab('mensajes')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'mensajes' ? 'text-indigo-400' : 'text-slate-400'}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Mensajes</span>
        </button>
        <button
          onClick={() => setActiveTab('reputacion')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'reputacion' ? 'text-indigo-400' : 'text-slate-400'}`}
        >
          <Award className="w-4 h-4" />
          <span>Reputación</span>
        </button>
      </div>
    </header>
  );
};
