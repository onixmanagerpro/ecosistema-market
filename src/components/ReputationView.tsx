import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  Trophy, 
  Star, 
  ShieldCheck, 
  Flame, 
  Coins, 
  UserCheck, 
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ReputationHistoryItem } from '../types';

interface ReputationViewProps {
  reputationHistory: ReputationHistoryItem[];
}

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  reputation: number;
  collaborations: number;
  badge: string;
}

const LEADERBOARD_SEED: LeaderboardUser[] = [
  { rank: 1, name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', reputation: 520, collaborations: 18, badge: 'Leyenda del Ecosistema' },
  { rank: 2, name: 'Mateo Silva', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', reputation: 340, collaborations: 12, badge: 'Colaborador Élite' },
  { rank: 3, name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200', reputation: 185, collaborations: 7, badge: 'Colaborador Activo' },
  { rank: 4, name: 'Sofía Valenzuela', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', reputation: 160, collaborations: 6, badge: 'Especialista' },
  { rank: 5, name: 'Carlos Méndez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', reputation: 120, collaborations: 5, badge: 'Colaborador Activo' }
];

export const ReputationView: React.FC<ReputationViewProps> = ({ reputationHistory }) => {
  const { userProfile } = useAuth();

  const currentScore = userProfile?.reputationScore || 0;
  
  // Calculate next tier target
  let nextTier = 'Especialista';
  let targetPoints = 150;
  if (currentScore >= 300) {
    nextTier = 'Leyenda del Ecosistema';
    targetPoints = 500;
  } else if (currentScore >= 150) {
    nextTier = 'Colaborador Élite';
    targetPoints = 300;
  } else if (currentScore >= 50) {
    nextTier = 'Especialista';
    targetPoints = 150;
  } else {
    nextTier = 'Colaborador Activo';
    targetPoints = 50;
  }

  const progressPercent = Math.min(100, Math.round((currentScore / targetPoints) * 100));

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Sistema de Reputación y Mérito</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Reputación Basada en Colaboraciones Reales
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Cada tarea entregada y validada por tus pares incrementa tu puntaje público, desbloquea mayores fondos de fichas y consolida tu perfil profesional en el ecosistema.
            </p>
          </div>

          {/* User Score Badge Box */}
          <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-3xl shrink-0 min-w-[220px]">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tu Nivel Actual</span>
            <div className="text-lg font-bold text-amber-400 mt-1 flex items-center gap-2">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>{userProfile?.badge || 'Novato'}</span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Puntos acumulados:</span>
                <span className="font-bold text-indigo-400">{currentScore} pts</span>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Siguiente nivel: {nextTier}</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Leaderboard */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Líderes de Colaboración del Ecosistema</span>
            </h3>
            <span className="text-xs text-slate-400">Top Colaboradores</span>
          </div>

          <div className="space-y-3">
            {LEADERBOARD_SEED.map((user) => (
              <div 
                key={user.rank}
                className="flex items-center justify-between p-4 rounded-3xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    user.rank === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    user.rank === 2 ? 'bg-slate-300/20 text-slate-200 border border-slate-300/30' :
                    user.rank === 3 ? 'bg-amber-700/20 text-amber-500 border border-amber-700/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    #{user.rank}
                  </span>

                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                  />

                  <div>
                    <h4 className="font-bold text-sm text-white">{user.name}</h4>
                    <span className="text-xs text-indigo-400 font-medium">{user.badge}</span>
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <div className="font-extrabold text-sm text-amber-400 flex items-center justify-end gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>{user.reputation} pts</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {user.collaborations} colaboraciones
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Tiers breakdown & History */}
        <div className="space-y-6">
          
          {/* Reputation Tiers Card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Niveles e Insignias</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-300">🌱 Novato</div>
                  <div className="text-[10px] text-slate-400">0 a 49 pts</div>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold">Nivel Inicial</span>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex justify-between items-center">
                <div>
                  <div className="font-bold text-indigo-300">🥉 Colaborador Activo</div>
                  <div className="text-[10px] text-slate-400">50 a 149 pts</div>
                </div>
                <span className="text-[10px] text-indigo-400 font-bold">+35 Fichas Bono</span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex justify-between items-center">
                <div>
                  <div className="font-bold text-amber-300">🥈 Especialista</div>
                  <div className="text-[10px] text-slate-400">150 a 299 pts</div>
                </div>
                <span className="text-[10px] text-amber-400 font-bold">+50 Fichas Bono</span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center">
                <div>
                  <div className="font-bold text-emerald-300">🥇 Colaborador Élite</div>
                  <div className="text-[10px] text-slate-400">300 a 499 pts</div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">+80 Fichas Bono</span>
              </div>

              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex justify-between items-center">
                <div>
                  <div className="font-bold text-purple-300">👑 Leyenda del Ecosistema</div>
                  <div className="text-[10px] text-slate-400">500+ pts</div>
                </div>
                <span className="text-[10px] text-purple-400 font-bold">Insignia Suprema</span>
              </div>
            </div>
          </div>

          {/* User Recent Reputation Activity */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tu Historial de Méritos</span>
            </h3>

            {reputationHistory.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Completa tu primera tarea para registrar méritos.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                {reputationHistory.map((item) => (
                  <div key={item.id} className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-200">{item.reason}</div>
                      <div className="text-[10px] text-slate-400">{item.createdAt}</div>
                    </div>
                    <span className="font-bold text-indigo-400 text-xs">+{item.points} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
