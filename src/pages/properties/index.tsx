import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Building2, MapPin, Lock, X, SlidersHorizontal, Heart, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useComparison } from '@/lib/comparison-context';
import { useFavorites } from '@/lib/favorites-context';
import ComparisonBar from '@/components/ComparisonBar';
import { SearchAutocomplete } from '@/components/SearchAutocomplete';
import { toast } from 'sonner';

interface Property {
  id: number;
  title: string;
  propertyCategory: string | null;
  type: string;
  propertyStatus: string | null;
  location: string;
  address: string;
  price: string;
  area: string;
  builtUpArea: string | null;
  description: string;
  imageUrl: string | null;
  tokenCost: number;
  isActive: boolean;
  viewsCount: number | null;
}

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'area-asc' | 'area-desc' | 'tokens-asc' | 'tokens-desc';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const { isAuthenticated } = useAuth();
  const { addToComparison, removeFromComparison, isInComparison, canAddMore } = useComparison();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Advanced filters
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Get min/max values from properties (convert strings to numbers)
  const maxPrice = properties.length > 0 
    ? Math.max(...properties.map(p => parseFloat(p.price) || 0), 100000000)
    : 100000000;
  const maxArea = properties.length > 0
    ? Math.max(...properties.map(p => parseFloat(p.area) || 0), 10000)
    : 10000;

  // Initialize ranges with max values (will update when properties load)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, maxArea]);

  // Update ranges when max values change
  useEffect(() => {
    setPriceRange([0, maxPrice]);
    setAreaRange([0, maxArea]);
  }, [maxPrice, maxArea]);

  useEffect(() => {
    fetchProperties();
    
    // Set up auto-refresh every 30 seconds to get new properties
    const interval = setInterval(() => {
      fetchProperties();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchProperties = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) setRefreshing(true);
      
      const response = await fetch('/api/properties');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      
      // Only update if data has changed to prevent unnecessary re-renders
      const newProperties = data.properties || [];
      if (JSON.stringify(newProperties) !== JSON.stringify(properties)) {
        setProperties(newProperties);
        if (showRefreshToast) {
          toast.success(`Loaded ${newProperties.length} properties`);
        }
      } else if (showRefreshToast) {
        toast.info('Properties are up to date');
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    fetchProperties(true);
  };

  const handlePropertyClick = async (propertyId: number) => {
    // Increment view count when user clicks to view property
    try {
      await fetch(`/api/properties/${propertyId}/view`, {
        method: 'POST',
      });
    } catch (error) {
      // Silently fail - view count is not critical
      console.error('Failed to increment view count:', error);
    }
  };

  const togglePropertyType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const resetFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setSelectedTypes([]);
    setPriceRange([0, maxPrice]);
    setAreaRange([0, maxArea]);
    setSortBy('newest');
  };

  const hasActiveFilters = 
    searchTerm || 
    locationFilter || 
    selectedTypes.length > 0 || 
    priceRange[0] > 0 || 
    priceRange[1] < maxPrice ||
    areaRange[0] > 0 || 
    areaRange[1] < maxArea;

  // Apply all filters
  let filteredProperties = properties.filter(property => {
    // Search filter
    const matchesSearch = !searchTerm || 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase());

    // Location filter
    const matchesLocation = !locationFilter || 
      property.location.toLowerCase().includes(locationFilter.toLowerCase());

    // Type filter
    const matchesType = selectedTypes.length === 0 || 
      selectedTypes.includes(property.type);

    // Price range filter (convert string to number)
    const propertyPrice = parseFloat(property.price) || 0;
    const matchesPrice = propertyPrice >= priceRange[0] && propertyPrice <= priceRange[1];

    // Area range filter (convert string to number)
    const propertyArea = parseFloat(property.area) || 0;
    const matchesArea = propertyArea >= areaRange[0] && propertyArea <= areaRange[1];

    return matchesSearch && matchesLocation && matchesType && matchesPrice && matchesArea;
  });

  // Filters will automatically update the displayed properties

  // Apply sorting (convert strings to numbers for price and area)
  filteredProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
      case 'price-desc':
        return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
      case 'area-asc':
        return (parseFloat(a.area) || 0) - (parseFloat(b.area) || 0);
      case 'area-desc':
        return (parseFloat(b.area) || 0) - (parseFloat(a.area) || 0);
      case 'tokens-asc':
        return a.tokenCost - b.tokenCost;
      case 'tokens-desc':
        return b.tokenCost - a.tokenCost;
      case 'newest':
      default:
        return b.id - a.id;
    }
  });

  const handleComparisonToggle = (property: Property, checked: boolean) => {
    if (checked) {
      const success = addToComparison(property);
      if (!success) {
        toast.error('Maximum 3 properties can be compared');
      } else {
        toast.success('Added to comparison');
      }
    } else {
      removeFromComparison(property.id);
      toast.info('Removed from comparison');
    }
  };

  const handleFavoriteToggle = async (propertyId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      return;
    }

    const success = await toggleFavorite(propertyId);
    if (success) {
      if (isFavorite(propertyId)) {
        toast.success('Removed from favorites');
      } else {
        toast.success('Added to favorites');
      }
    } else {
      toast.error('Failed to update favorites');
    }
  };

  const getPropertyImage = (type: string) => {
    const images = {
      residential: 'https://media.gettyimages.com/id/1937435181/photo/luxury-modern-house-exterior.jpg?b=1&s=2048x2048&w=0&k=20&c=NLG6hfh7uzWj75IgWcfTLct6kvNaLmeh9zzAMDjHmFw=',
      commercial: 'https://media.gettyimages.com/id/1629266462/photo/view-of-moody-rainy-morning-at-san-francisco-downtown-district-california.jpg?b=1&s=2048x2048&w=0&k=20&c=R3c-wrqmmivWr4y1fpWyXt2dZfy_FY8omL4L8KiEA9k=',
      land: 'https://media.gettyimages.com/id/2219590999/photo/arid-land-with-lone-tree-and-distant-greenery.jpg?b=1&s=2048x2048&w=0&k=20&c=pi4pOg0UBUj6Ao2hK2vzLzFmV-HLmER1YH-Svc8V-ho=',
    };
    return images[type as keyof typeof images] || images.residential;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Property Types */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Property Type</Label>
        <div className="space-y-3">
          {['residential', 'commercial', 'land'].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => togglePropertyType(type)}
              />
              <label
                htmlFor={`type-${type}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Price Range</Label>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            min={0}
            max={maxPrice}
            step={100000}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              ₹{priceRange[0].toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              ₹{priceRange[1].toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Area Range */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Area (sq ft)</Label>
        <div className="space-y-4">
          <Slider
            value={areaRange}
            onValueChange={(value) => setAreaRange(value as [number, number])}
            min={0}
            max={maxArea}
            step={100}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {areaRange[0].toLocaleString()} sq ft
            </span>
            <span className="text-muted-foreground">
              {areaRange[1].toLocaleString()} sq ft
            </span>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={resetFilters}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Reset All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-muted/30 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Browse Properties</h1>
              <p className="text-lg text-muted-foreground">
                Explore verified properties and unlock owner details with tokens
              </p>
            </div>
            <Button 
              onClick={handleManualRefresh} 
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="border-b bg-background sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search with Autocomplete */}
            <SearchAutocomplete
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by title, location, or address..."
              className="flex-1"
              suggestionsType="mixed"
              onSelect={(suggestion) => {
                if (suggestion.type === 'property' && suggestion.propertyId) {
                  // Navigate to property detail page
                  window.location.href = `/properties/${suggestion.propertyId}`;
                }
              }}
            />

            {/* Location Filter */}
            <Input
              placeholder="Filter by location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full lg:w-[200px]"
            />

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="area-asc">Area: Small to Large</SelectItem>
                <SelectItem value="area-desc">Area: Large to Small</SelectItem>
                <SelectItem value="tokens-asc">Tokens: Low to High</SelectItem>
                <SelectItem value="tokens-desc">Tokens: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Advanced Filters - Mobile */}
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {selectedTypes.length + (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) + (areaRange[0] > 0 || areaRange[1] < maxArea ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Advanced Filters</SheetTitle>
                  <SheetDescription>
                    Refine your property search
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>

            {/* Advanced Filters - Desktop */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="hidden lg:flex"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {selectedTypes.length + (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) + (areaRange[0] > 0 || areaRange[1] < maxArea ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedTypes.map((type) => (
                <Badge key={type} variant="secondary" className="capitalize">
                  {type}
                  <button
                    onClick={() => togglePropertyType(type)}
                    className="ml-1.5 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                <Badge variant="secondary">
                  ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  <button
                    onClick={() => setPriceRange([0, maxPrice])}
                    className="ml-1.5 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {(areaRange[0] > 0 || areaRange[1] < maxArea) && (
                <Badge variant="secondary">
                  {areaRange[0].toLocaleString()} - {areaRange[1].toLocaleString()} sq ft
                  <button
                    onClick={() => setAreaRange([0, maxArea])}
                    className="ml-1.5 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-6 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          {showFilters && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-32">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Filters</CardTitle>
                    <CardDescription>Refine your search</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FilterContent />
                  </CardContent>
                </Card>
              </div>
            </aside>
          )}

          {/* Properties Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading properties...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No properties found</p>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Properties Count */}
                <div className="mb-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48 bg-muted">
                        <img
                          src={property.imageUrl || getPropertyImage(property.type)}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          {property.propertyCategory && (
                            <Badge variant="secondary" className="capitalize bg-background/90 backdrop-blur-sm">
                              {property.propertyCategory}
                            </Badge>
                          )}
                          <Badge className="capitalize bg-primary/90 backdrop-blur-sm">
                            {property.type}
                          </Badge>
                        </div>
                        {property.propertyStatus && (
                          <Badge variant="outline" className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm">
                            {property.propertyStatus}
                          </Badge>
                        )}
                        <div className="absolute top-3 right-3 flex gap-2">
                          {/* Favorite Button */}
                          <button
                            onClick={(e) => handleFavoriteToggle(property.id, e)}
                            className="bg-background/90 backdrop-blur-sm rounded-md p-2 shadow-sm hover:bg-background transition-colors"
                            title={isFavorite(property.id) ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                isFavorite(property.id)
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-muted-foreground hover:text-red-500'
                              }`}
                            />
                          </button>
                          {/* Compare Checkbox */}
                          <div className="bg-background/90 backdrop-blur-sm rounded-md p-2 shadow-sm">
                            <Checkbox
                              id={`compare-${property.id}`}
                              checked={isInComparison(property.id)}
                              onCheckedChange={(checked) => handleComparisonToggle(property, checked as boolean)}
                              disabled={!canAddMore && !isInComparison(property.id)}
                            />
                          </div>
                        </div>
                      </div>

                      <CardHeader>
                        <CardTitle className="line-clamp-1">{property.title}</CardTitle>
                        <CardDescription className="flex items-start gap-1">
                          <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{property.address}</span>
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Price</span>
                            <span className="font-semibold">₹{property.price}</span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Area</span>
                            <span className="font-semibold">{property.builtUpArea || property.area}</span>
                          </div>
                          
                          {property.viewsCount !== null && property.viewsCount > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Views</span>
                              <span className="font-medium">{property.viewsCount}</span>
                            </div>
                          )}

                          <div className="space-y-3">
                            <div className="flex items-center gap-2 pt-3 border-t">
                              <Checkbox
                                id={`compare-card-${property.id}`}
                                checked={isInComparison(property.id)}
                                onCheckedChange={(checked) => handleComparisonToggle(property, checked as boolean)}
                                disabled={!canAddMore && !isInComparison(property.id)}
                              />
                              <label
                                htmlFor={`compare-card-${property.id}`}
                                className="text-sm text-muted-foreground cursor-pointer"
                              >
                                Compare
                              </label>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-sm">
                                <Lock className="h-4 w-4 text-primary" />
                                <span className="font-semibold text-primary">{property.tokenCost} Token</span>
                              </div>

                              <Button 
                                size="sm" 
                                asChild
                                onClick={() => handlePropertyClick(property.id)}
                              >
                                <Link to={`/properties/${property.id}`}>
                                  View Details
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CTA for non-authenticated users */}
      {!isAuthenticated && (
        <section className="py-12 bg-muted/30 mb-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Access Property Details?</h2>
            <p className="text-muted-foreground mb-6">
              Create a free account to unlock property owner information
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/register">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Comparison Bar */}
      <ComparisonBar />
    </div>
  );
}