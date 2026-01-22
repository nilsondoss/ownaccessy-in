import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Building2, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Suggestion {
  type: 'location' | 'property';
  value: string;
  label: string;
  subtitle?: string;
  propertyId?: number;
  propertyType?: string;
}

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: Suggestion) => void;
  placeholder?: string;
  className?: string;
  suggestionsType?: 'location' | 'title' | 'mixed';
}

export function SearchAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Search properties...',
  className,
  suggestionsType = 'mixed',
}: SearchAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    debounceTimer.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          query: value,
          type: suggestionsType,
        });
        const response = await fetch(`/api/properties/search-suggestions?${params}`);
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [value, suggestionsType]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSelect = (suggestion: Suggestion) => {
    onChange(suggestion.value);
    saveRecentSearch(suggestion.value);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (onSelect) {
      onSelect(suggestion);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    onChange(search);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    const allItems = [...(value.length < 2 ? recentSearches : []), ...suggestions];

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < allItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      if (value.length < 2 && selectedIndex < recentSearches.length) {
        handleRecentSearchClick(recentSearches[selectedIndex]);
      } else {
        const suggestionIndex = value.length < 2 ? selectedIndex - recentSearches.length : selectedIndex;
        if (suggestions[suggestionIndex]) {
          handleSelect(suggestions[suggestionIndex]);
        }
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const showRecentSearches = value.length < 2 && recentSearches.length > 0;
  const showSuggestionsList = suggestions.length > 0;

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>

      {showSuggestions && (showRecentSearches || showSuggestionsList) && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {showRecentSearches && (
            <div className="p-2">
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Recent Searches</div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left',
                    selectedIndex === index && 'bg-accent'
                  )}
                >
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{search}</span>
                </button>
              ))}
            </div>
          )}

          {showRecentSearches && showSuggestionsList && <div className="border-t" />}

          {showSuggestionsList && (
            <div className="p-2">
              {value.length >= 2 && (
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Suggestions</div>
              )}
              {suggestions.map((suggestion, index) => {
                const displayIndex = showRecentSearches ? index + recentSearches.length : index;
                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(suggestion)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left',
                      selectedIndex === displayIndex && 'bg-accent'
                    )}
                  >
                    {suggestion.type === 'location' ? (
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{suggestion.label}</div>
                      {suggestion.subtitle && (
                        <div className="text-xs text-muted-foreground truncate">{suggestion.subtitle}</div>
                      )}
                    </div>
                    {suggestion.propertyType && (
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded capitalize flex-shrink-0">
                        {suggestion.propertyType}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {isLoading && (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading suggestions...</div>
          )}
        </div>
      )}
    </div>
  );
}
