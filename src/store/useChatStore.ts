import { create } from 'zustand';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

interface Message {
  id: string;
  text: string;
  userId: string;
  role: 'user' | 'bot';
  createdAt: any;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  sending: boolean;
  error: string | null;
  subscribeMessages: (userId: string) => () => void;
  sendMessage: (text: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: true,
  sending: false,
  error: null,

  subscribeMessages: (userId: string) => {
    set({ loading: true, error: null });
    const q = query(
      collection(db, 'messages'),
      where('userId', '==', userId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        set({ messages, loading: false });
      },
      (error) => {
        console.error('Firestore subscription error:', error);
        set({ loading: false, error: 'Permission denied or connection lost. Check your Firestore Rules.' });
      }
    );

    return unsubscribe;
  },

  sendMessage: async (text: string) => {
    const user = auth.currentUser;
    if (!user) return;

    set({ sending: true, error: null });

    try {
      // 1. Save User Message to Firestore
      await addDoc(collection(db, 'messages'), {
        text,
        userId: user.uid,
        role: 'user',
        createdAt: serverTimestamp(),
      });

      // 2. Call Backend
      const token = await user.getIdToken();
      const response = await fetch('http://localhost:3001/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Backend error');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      set({ error: error.message });
    } finally {
      set({ sending: false });
    }
  },
}));
