import React, { createContext, useState, useContext, ReactNode } from 'react';

export type UserType = 'consumidor' | 'farmacia';

export interface UserData {
  name: string;
  type: UserType;
  cpf: string;
  email: string;
  phone: string;
  cep?: string;
  address: string;
}

interface AuthContextData {
  user: UserData | null;
  login: (userData: UserData) => void;
  logout: () => void;
  updateUser: (data: Partial<UserData>) => void;
  // Memória dos favoritos
  favorites: string[];
  toggleFavorite: (medId: string) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]); // Guarda os IDs dos favoritos

  const login = (userData: UserData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setFavorites([]); // Limpa os favoritos ao sair da conta
  };

  const updateUser = (data: Partial<UserData>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  // Função mágica que adiciona se não tiver, e remove se já for favorito
  const toggleFavorite = (medId: string) => {
    if (favorites.includes(medId)) {
      setFavorites(favorites.filter(id => id !== medId));
    } else {
      setFavorites([...favorites, medId]);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, favorites, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);