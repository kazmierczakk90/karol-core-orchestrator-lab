
import { useState, useMemo } from 'react';

interface UseTableSearchProps {
  data: any[];
  searchFields: string[];
}

interface UseTableSearchReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredData: any[];
  clearSearch: () => void;
}

export const useTableSearch = ({ 
  data, 
  searchFields 
}: UseTableSearchProps): UseTableSearchReturn => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(item => 
      searchFields.some(field => {
        const value = field.includes('.') 
          ? field.split('.').reduce((obj, key) => obj?.[key], item)
          : item[field];
        
        return String(value || '').toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, searchFields]);

  const clearSearch = () => setSearchTerm('');

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    clearSearch
  };
};
