import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  nome: string;
  email: string;
  tipo: string;
}

interface UserContextProps {
  user: User | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  return <UserContext.Provider value={{ user, isLoading }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};
