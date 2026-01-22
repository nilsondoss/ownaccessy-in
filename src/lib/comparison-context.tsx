import { createContext, useContext, useState, ReactNode } from 'react';

interface Property {
  id: number;
  title: string;
  type: string;
  location: string;
  address: string;
  price: number;
  area: number;
  description: string;
  imageUrl: string | null;
  tokenCost: number;
  isActive: boolean;
}

interface ComparisonContextType {
  comparisonList: Property[];
  addToComparison: (property: Property) => boolean;
  removeFromComparison: (propertyId: number) => void;
  clearComparison: () => void;
  isInComparison: (propertyId: number) => boolean;
  canAddMore: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_COMPARISON = 3;

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonList, setComparisonList] = useState<Property[]>([]);

  const addToComparison = (property: Property): boolean => {
    if (comparisonList.length >= MAX_COMPARISON) {
      return false;
    }
    if (comparisonList.some(p => p.id === property.id)) {
      return false;
    }
    setComparisonList(prev => [...prev, property]);
    return true;
  };

  const removeFromComparison = (propertyId: number) => {
    setComparisonList(prev => prev.filter(p => p.id !== propertyId));
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  const isInComparison = (propertyId: number): boolean => {
    return comparisonList.some(p => p.id === propertyId);
  };

  const canAddMore = comparisonList.length < MAX_COMPARISON;

  return (
    <ComparisonContext.Provider
      value={{
        comparisonList,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        canAddMore,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}