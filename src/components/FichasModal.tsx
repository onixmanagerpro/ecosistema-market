import React, { useState } from 'react';
import { Coins, Sparkles, CheckCircle2, Gift, ShieldAlert, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FichasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FichasModal: React.FC<FichasModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, addFichas } = useAuth();
  const [claimedBonus, setClaimedBonus] = useState(false);

  if (!isOpen) return null;

  const handleClaimDailyBonus = async () => {
    await addFichas(35);
    setClaimedBonus(true);
    setTimeout(() => {
      setClaimedBonus(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Coins className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Sistema de Fichas (Tokens)</h3>
            <p className="text-xs text-slate-400">El motor de colaboración del ecosistema</p>
          </div>
        </div>

        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Tu Saldo Actual</span>
            <div className="text-3xl font-extrabold text-amber-400 flex items-center gap-2 mt-0.5">
              <span>{userProfile?.fichasBalance || 0}</span>
              <span className="text-sm font-medium text-amber-500/80">Fichas</span>
            </div>
          </div>
          <button
            onClick={handleClaimDailyBonus}
            disabled={claimedBonus}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition shadow-lg ${
              claimedBonus 
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 cursor-default' 
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-amber-500/20'
            }`}
          >
            {claimedBonus ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>+35 Fichas Recibidas</span>
              </>
            ) : (
              <>
                <Gift className="w-4 h-4" />
                <span>Reclamar Bono Diario (+35)</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-3 mb-6 text-sm text-slate-300">
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-slate-400">¿Cómo funcionan las fichas?</h4>
          
          <div className="flex items-start gap-3 bg-slate-800/30 p-3 rounded-lg border border-slate-800">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-200">Gana Fichas Completando Tareas</p>
              <p className="text-xs text-slate-400 mt-0.5">Cada tarea aprobada por el dueño del proyecto transfiere las fichas recompensadas directamente a tu billetera.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-800/30 p-3 rounded-lg border border-slate-800">
            <Coins className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-200">Comprométete con Fichas para Unirte</p>
              <p className="text-xs text-slate-400 mt-0.5">Para garantizar el compromiso en proyectos colaborativos, reservas un número simbólico de fichas al postularte.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-800/30 p-3 rounded-lg border border-slate-800">
            <ShieldAlert className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-200">Sube de Nivel de Reputación</p>
              <p className="text-xs text-slate-400 mt-0.5">Las fichas acumuladas y las tareas validadas incrementan tu puntaje de reputación pública e insignias.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
