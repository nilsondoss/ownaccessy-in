import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-context';

interface FavoritesContextType {
  favorites: Set<number>;
  addFavorite: (propertyId: number) => Promise<boolean>;
  removeFavorite: (propertyId: number) => Promise<boolean>;
  isFavorite: (propertyId: number) => boolean;
  toggleFavorite: (propertyId: number) => Promise<boolean>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const { isAuthenticated } = useAuth();

  const refreshFavorites = async () => {
    if (!isAuthenticated) {
      setFavorites(new Set());
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const favoriteIds = new Set(data.map((f: any) => f.propertyId));
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    refreshFavorites();
  }, [isAuthenticated]);

  const addFavorite = async (propertyId: number): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ propertyId }),
      });

      if (response.ok) {
        setFavorites(prev => new Set([...prev, propertyId]));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
  };

  const removeFavorite = async (propertyId: number): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/user/favorites/${propertyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(propertyId);
          return newSet;
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  };

  const isFavorite = (propertyId: number): boolean => {
    return favorites.has(propertyId);
  };

  const toggleFavorite = async (propertyId: number): Promise<boolean> => {
    if (isFavorite(propertyId)) {
      return await removeFavorite(propertyId);
    } else {
      return await addFavorite(propertyId);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}