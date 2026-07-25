import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { UserProfile } from '../types';
import { demoUser } from '../data/seedData';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isDemoMode: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  enableDemoMode: () => void;
  updateProfileData: (updates: Partial<UserProfile>) => Promise<void>;
  addFichas: (amount: number) => Promise<void>;
  deductFichas: (amount: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(demoUser);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Calculate badge based on reputation points
  const calculateBadge = (points: number): UserProfile['badge'] => {
    if (points >= 500) return 'Leyenda del Ecosistema';
    if (points >= 300) return 'Colaborador Élite';
    if (points >= 150) return 'Especialista';
    if (points >= 50) return 'Colaborador Activo';
    return 'Novato';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        setIsDemoMode(false);
        // Sync with Firestore user doc
        const userDocRef = doc(db, 'users', user.uid);
        
        // Listen to live updates on user profile
        const unsubDoc = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as UserProfile;
            setUserProfile(data);
          } else {
            // Create initial user document
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'Usuario',
              photoURL: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
              skills: ['Colaboración', 'Gestión de Proyectos'],
              reputationScore: 50, // Initial welcome bonus
              completedCollaborations: 0,
              fichasBalance: 100, // Initial welcome tokens
              badge: 'Novato',
              createdAt: new Date().toISOString()
            };
            setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        });

        setLoading(false);
        return () => unsubDoc();
      } else {
        // If not logged in, keep demoUser or null
        if (isDemoMode) {
          setUserProfile(demoUser);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      alert(`Error al iniciar sesión con Google: ${error.message || 'Verifica los permisos de tu navegador.'}`);
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await updateProfile(res.user, { displayName: name });
      const newProfile: UserProfile = {
        uid: res.user.uid,
        email,
        displayName: name,
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        skills: ['Innovación', 'Trabajo en equipo'],
        reputationScore: 50,
        completedCollaborations: 0,
        fichasBalance: 100,
        badge: 'Novato',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', res.user.uid), newProfile);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setIsDemoMode(true);
    setUserProfile(demoUser);
  };

  const enableDemoMode = () => {
    setIsDemoMode(true);
    setUserProfile(demoUser);
  };

  const updateProfileData = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    
    const updatedBadge = updates.reputationScore !== undefined 
      ? calculateBadge(updates.reputationScore) 
      : userProfile.badge;

    const fullUpdates = { ...updates, badge: updatedBadge };

    if (!isDemoMode && firebaseUser) {
      const userRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userRef, fullUpdates);
    } else {
      setUserProfile(prev => prev ? { ...prev, ...fullUpdates } : null);
    }
  };

  const addFichas = async (amount: number) => {
    if (!userProfile) return;
    const newBalance = userProfile.fichasBalance + amount;
    await updateProfileData({ fichasBalance: newBalance });
  };

  const deductFichas = async (amount: number): Promise<boolean> => {
    if (!userProfile) return false;
    if (userProfile.fichasBalance < amount) return false;
    const newBalance = userProfile.fichasBalance - amount;
    await updateProfileData({ fichasBalance: newBalance });
    return true;
  };

  return (
    <AuthContext.Provider value={{
      firebaseUser,
      userProfile,
      loading,
      isDemoMode,
      loginWithGoogle,
      loginWithEmail,
      signupWithEmail,
      logout,
      enableDemoMode,
      updateProfileData,
      addFichas,
      deductFichas
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
