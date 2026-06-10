import React, { createContext, useState, useContext, ReactNode } from 'react';
import { api } from '../services/api';

export type UserRole = 'CITIZEN' | 'ADMIN';

export interface UserData {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  cpf?: string;
  cep?: string;
  address?: string;
  pharmacy_id?: string | null;
}

interface AuthContextData {
  user: UserData | null;
  token: string | null;
  login: (userData: UserData, token: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<UserData>) => void;
  favorites: string[];
  toggleFavorite: (medId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const login = async (userData: UserData, authToken: string) => {
    setUser(userData);
    setToken(authToken);

    try {
      // Assim que logar, já puxa os favoritos salvos no banco
      const response = await api.get('/favorites', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const favIds = response.data.map((med: any) => med.id);
      setFavorites(favIds);
    } catch (error) {
      console.log('Erro ao buscar favoritos:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setFavorites([]);
  };

  const updateUser = (data: Partial<UserData>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const toggleFavorite = async (medId: string) => {
    if (!token) return;

    try {
      if (favorites.includes(medId)) {
        // Remove do estado imediatamente para ficar fluído
        setFavorites(favorites.filter(id => id !== medId));
        // Remove do banco de dados
        await api.delete(`/favorites/${medId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Adiciona no estado imediatamente
        setFavorites([...favorites, medId]);
        // Adiciona no banco de dados
        await api.post('/favorites', { medication_id: medId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.log('Erro ao favoritar/desfavoritar:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, favorites, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);