import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Hash, 
  User, 
  Sparkles, 
  Bot, 
  Coins, 
  Paperclip, 
  Search,
  CheckCheck
} from 'lucide-react';
import { ChatMessage, Project } from '../types';
import { useAuth } from '../context/AuthContext';

interface MessagingViewProps {
  projects: Project[];
  messages: ChatMessage[];
  onSendMessage: (projectId: string, content: string, recipientId?: string) => Promise<void>;
  selectedChatId: string;
  onSelectChat: (chatId: string) => void;
}

export const MessagingView: React.FC<MessagingViewProps> = ({
  projects,
  messages,
  onSendMessage,
  selectedChatId,
  onSelectChat
}) => {
  const { userProfile } = useAuth();
  const [inputContent, setInputContent] = useState('');
  const [sending, setSending] = useState(false);

  // Filter messages for current channel
  const currentMessages = messages.filter(m => m.projectId === selectedChatId);
  const activeProject = projects.find(p => p.id === selectedChatId) || projects[0];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || sending) return;

    setSending(true);
    try {
      await onSendMessage(selectedChatId, inputContent);
      setInputContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setInputContent(promptText);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl shadow-xl h-[700px] flex overflow-hidden">
      
      {/* Channels & Direct Messages Sidebar */}
      <div className="w-full sm:w-72 bg-slate-950/40 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span>Canales de Comunicación</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Mensajería integrada en tiempo real</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
          {/* Project Channels */}
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">
              Canales de Proyectos
            </span>
            <div className="space-y-1">
              {projects.map(proj => (
                <button
                  key={proj.id}
                  onClick={() => onSelectChat(proj.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-2xl font-medium text-xs flex items-center gap-2.5 transition ${
                    selectedChatId === proj.id
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <Hash className="w-4 h-4 shrink-0 text-slate-400" />
                  <span className="truncate">{proj.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Conversation */}
      <div className="flex-1 flex flex-col bg-slate-900">
        
        {/* Chat Channel Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{activeProject?.title || 'Canal General'}</h3>
              <p className="text-[11px] text-slate-400">{activeProject?.members.length || 1} colaboradores activos en esta sala</p>
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {currentMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <MessageSquare className="w-10 h-10 mb-2 opacity-40 text-indigo-400" />
              <p className="text-xs font-medium">No hay mensajes recientes en este canal.</p>
              <p className="text-[11px] text-slate-600 mt-1">Sé el primero en iniciar la conversación con tu equipo.</p>
            </div>
          ) : (
            currentMessages.map((msg) => {
              const isMe = msg.senderId === userProfile?.uid || msg.senderId === 'demo-user-123';
              const isSystem = msg.type === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{msg.content}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex gap-3 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                  <img 
                    src={msg.senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} 
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-slate-800"
                  />

                  <div>
                    <div className={`flex items-center gap-2 mb-1 text-[11px] ${isMe ? 'justify-end' : ''}`}>
                      <span className="font-semibold text-slate-300">{msg.senderName}</span>
                      <span className="text-slate-500">{msg.timestamp}</span>
                    </div>

                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe 
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                        : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Action Pills */}
        <div className="px-6 py-2 bg-slate-950/40 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 font-semibold uppercase text-[10px]">Respuestas rápidas:</span>
          <button 
            onClick={() => handleQuickPrompt("¡Hola equipo! ¿Cómo vamos con los entregables de hoy? 🚀")}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition whitespace-nowrap"
          >
            👋 Saludar al equipo
          </button>
          <button 
            onClick={() => handleQuickPrompt("He enviado los avances a la columna de Revisión en el Panel. 📋")}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition whitespace-nowrap"
          >
            📋 Reportar entregables
          </button>
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center gap-3">
          <input
            type="text"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder={`Escribe un mensaje en #${activeProject?.title || 'canal'}...`}
            className="flex-1 bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />

          <button
            type="submit"
            disabled={!inputContent.trim() || sending}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
