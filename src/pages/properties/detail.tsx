import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, MapPin, Lock, Unlock, Download, ArrowLeft, Coins, User, Phone, Mail, Heart,
  Home, Ruler, FileText, Shield, TrendingUp, Wrench, Eye, Share2, CheckCircle2,
  Clock, AlertTriangle, Zap, Droplet, Car, Trees, Briefcase
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useFavorites } from '@/lib/favorites-context';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Property {
  id: number;
  title: string;
  propertyCategory?: string;
  type: string;
  location: string;
  address: string;
  propertyId?: string;
  propertyStatus?: string;
  
  // Areas
  landArea?: string;
  builtUpArea?: string;
  area?: string;
  plotDimensions?: string;
  
  // Zoning & Development
  zoning?: string;
  landUse?: string;
  developmentType?: string;
  layoutName?: string;
  numberOfUnits?: number;
  unitSizes?: string;
  floorPlan?: string;
  
  // Infrastructure
  roadAccess?: string;
  roadWidth?: string;
  powerAvailability?: string;
  waterAvailability?: string;
  drainageSystem?: string;
  sewageSystem?: string;
  parkingSpaces?: string;
  vehicleAccess?: string;
  
  // Amenities & Construction
  amenities?: string;
  infrastructure?: string;
  furnishingStatus?: string;
  constructionStatus?: string;
  
  // Legal & Approvals
  governmentApprovals?: string;
  reraStatus?: string;
  dtcpStatus?: string;
  cmdaStatus?: string;
  environmentalClearance?: string;
  legalVerificationStatus?: string;
  
  // Ownership
  ownershipType?: string;
  titleDeedDetails?: string;
  taxStatus?: string;
  encumbranceStatus?: string;
  
  // Financial
  investmentPotential?: string;
  rentalIncome?: string;
  leaseTerms?: string;
  price: string;
  paymentTerms?: string;
  pricePerSqft?: string;
  pricePerAcre?: string;
  marketValueTrend?: string;
  
  // Description & Location
  description?: string;
  connectivity?: string;
  nearbyFacilities?: string;
  suitability?: string;
  
  // Development
  projectPhase?: string;
  developmentStage?: string;
  builderName?: string;
  developerName?: string;
  contractorName?: string;
  maintenanceCost?: string;
  operatingCost?: string;
  
  // Risk
  riskAssessment?: string;
  complianceCheck?: string;
  
  // Media
  imageUrl?: string | null;
  images?: string;
  documents?: string;
  legalDocuments?: string;
  approvalDocuments?: string;
  ownershipProof?: string;
  
  // Owner (Token Protected)
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  ownerAddress?: string;
  identityVerification?: string;
  
  // Meta
  viewsCount?: number;
  tokenCost: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface PropertyOwner {
  name: string;
  email: string;
  phone: string;
  address: string;
  identityVerification?: string;
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user, refreshUser } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [property, setProperty] = useState<Property | null>(null);
  const [owner, setOwner] = useState<PropertyOwner | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProperty();
    // Increment view count when page loads
    incrementViewCount();
  }, [id]);

  const incrementViewCount = async () => {
    try {
      await fetch(`/api/properties/${id}/view`, {
        method: 'POST',
      });
    } catch (error) {
      // Silently fail - view count is not critical
      console.error('Failed to increment view count:', error);
    }
  };

  const fetchProperty = async () => {
    try {
      const response: any = await api.getProperty(Number(id));
      setProperty(response.property);
      setIsUnlocked(response.isUnlocked);
      if (response.isUnlocked && response.owner) {
        setOwner(response.owner);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!user || user.tokenBalance < (property?.tokenCost || 1)) {
      navigate('/pricing');
      return;
    }

    setUnlocking(true);
    setError('');

    try {
      const response: any = await api.unlockProperty(Number(id));
      setOwner(response.owner);
      setIsUnlocked(true);
      
      // Refresh user data to get updated token balance
      await refreshUser();
      
      toast.success('Property unlocked successfully!');
    } catch (error: any) {
      setError(error.message || 'Failed to unlock property');
      toast.error(error.message || 'Failed to unlock property');
    } finally {
      setUnlocking(false);
    }
  };

  const handleDownload = async (format: 'pdf' | 'excel') => {
    try {
      const response = await api.downloadProperty(Number(id), format);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `property-${id}-${Date.now()}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`${format.toUpperCase()} downloaded successfully!`);
    } catch (error: any) {
      setError(error.message || 'Download failed');
      toast.error(error.message || 'Download failed');
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

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value?: string | number; icon?: any }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3 py-2">
        {Icon && <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />}
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-medium">{value}</p>
        </div>
      </div>
    );
  };

  const StatusBadge = ({ status, type }: { status?: string; type: 'success' | 'warning' | 'error' | 'info' }) => {
    if (!status) return null;
    const colors = {
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      error: 'bg-red-100 text-red-800 border-red-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return <Badge variant="outline" className={colors[type]}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading property details...</p>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/properties')}>Back to Properties</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/properties')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative h-96 rounded-lg overflow-hidden bg-muted">
              <img
                src={property.imageUrl || getPropertyImage(property.type)}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="capitalize">{property.propertyCategory || property.type}</Badge>
                {property.propertyStatus && <Badge variant="secondary">{property.propertyStatus}</Badge>}
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Badge variant="outline" className="bg-background/90 backdrop-blur">
                  <Eye className="h-3 w-3 mr-1" />
                  {property.viewsCount || 0} views
                </Badge>
              </div>
            </div>

            {/* Title & Actions */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">{property.title}</CardTitle>
                    {property.propertyId && (
                      <p className="text-sm text-muted-foreground mb-2">Property ID: {property.propertyId}</p>
                    )}
                    <CardDescription className="flex items-start gap-2 text-base">
                      <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>{property.address}</span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {isAuthenticated && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={async () => {
                          const success = await toggleFavorite(property.id);
                          if (success) {
                            if (isFavorite(property.id)) {
                              toast.success('Removed from favorites');
                            } else {
                              toast.success('Added to favorites');
                            }
                          } else {
                            toast.error('Failed to update favorites');
                          }
                        }}
                        title={isFavorite(property.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isFavorite(property.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="icon" 
                      title="Share property"
                      onClick={() => {
                        const url = window.location.href;
                        if (navigator.share) {
                          navigator.share({
                            title: property.title,
                            text: `Check out this property: ${property.title}`,
                            url: url,
                          }).then(() => {
                            toast.success('Shared successfully!');
                          }).catch((error) => {
                            if (error.name !== 'AbortError') {
                              // Fallback to clipboard
                              navigator.clipboard.writeText(url);
                              toast.success('Link copied to clipboard!');
                            }
                          });
                        } else {
                          // Fallback to clipboard
                          navigator.clipboard.writeText(url);
                          toast.success('Link copied to clipboard!');
                        }
                      }}
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Price</p>
                    <p className="text-2xl font-bold">₹{property.price}</p>
                    {property.pricePerSqft && (
                      <p className="text-xs text-muted-foreground">₹{property.pricePerSqft}/sq.ft</p>
                    )}
                  </div>
                  {property.landArea && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Land Area</p>
                      <p className="text-xl font-bold">{property.landArea}</p>
                    </div>
                  )}
                  {property.builtUpArea && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Built-up Area</p>
                      <p className="text-xl font-bold">{property.builtUpArea}</p>
                    </div>
                  )}
                  {property.tokenCost && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Unlock Cost</p>
                      <div className="flex items-center gap-1.5">
                        <Coins className="h-5 w-5 text-primary" />
                        <p className="text-xl font-bold text-primary">{property.tokenCost}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
                <TabsTrigger value="legal">Legal</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Property Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <InfoRow label="Property Type" value={property.type} icon={Building2} />
                    <InfoRow label="Property Category" value={property.propertyCategory} />
                    <InfoRow label="Property Status" value={property.propertyStatus} />
                    <InfoRow label="Plot Dimensions" value={property.plotDimensions} icon={Ruler} />
                    <InfoRow label="Zoning" value={property.zoning} />
                    <InfoRow label="Land Use" value={property.landUse} />
                    <InfoRow label="Development Type" value={property.developmentType} />
                    <InfoRow label="Layout/Project Name" value={property.layoutName} />
                    <InfoRow label="Number of Units" value={property.numberOfUnits} />
                    <InfoRow label="Unit Sizes" value={property.unitSizes} />
                    <InfoRow label="Furnishing Status" value={property.furnishingStatus} />
                    <InfoRow label="Construction Status" value={property.constructionStatus} />
                    <InfoRow label="Suitability" value={property.suitability} />
                    
                    {property.description && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Description</p>
                          <p className="text-sm leading-relaxed">{property.description}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {property.amenities && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trees className="h-5 w-5" />
                        Amenities & Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{property.amenities}</p>
                    </CardContent>
                  </Card>
                )}

                {(property.builderName || property.developerName || property.contractorName) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Builder & Developer
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <InfoRow label="Builder" value={property.builderName} />
                      <InfoRow label="Developer" value={property.developerName} />
                      <InfoRow label="Contractor" value={property.contractorName} />
                      <InfoRow label="Project Phase" value={property.projectPhase} />
                      <InfoRow label="Development Stage" value={property.developmentStage} />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Infrastructure Tab */}
              <TabsContent value="infrastructure" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Infrastructure & Utilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <InfoRow label="Road Access" value={property.roadAccess} />
                    <InfoRow label="Road Width" value={property.roadWidth} />
                    <InfoRow label="Power Availability" value={property.powerAvailability} icon={Zap} />
                    <InfoRow label="Water Availability" value={property.waterAvailability} icon={Droplet} />
                    <InfoRow label="Drainage System" value={property.drainageSystem} />
                    <InfoRow label="Sewage System" value={property.sewageSystem} />
                    <InfoRow label="Parking Spaces" value={property.parkingSpaces} icon={Car} />
                    <InfoRow label="Vehicle Access" value={property.vehicleAccess} />
                    
                    {property.infrastructure && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Additional Infrastructure</p>
                          <p className="text-sm">{property.infrastructure}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {(property.maintenanceCost || property.operatingCost) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Operating Costs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <InfoRow label="Maintenance Cost" value={property.maintenanceCost} />
                      <InfoRow label="Operating Cost" value={property.operatingCost} />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Legal Tab */}
              <TabsContent value="legal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Legal & Approvals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">RERA Status</p>
                        <StatusBadge 
                          status={property.reraStatus} 
                          type={property.reraStatus?.toLowerCase().includes('approved') ? 'success' : 'warning'} 
                        />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">DTCP Status</p>
                        <StatusBadge 
                          status={property.dtcpStatus} 
                          type={property.dtcpStatus?.toLowerCase().includes('approved') ? 'success' : 'warning'} 
                        />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">CMDA Status</p>
                        <StatusBadge 
                          status={property.cmdaStatus} 
                          type={property.cmdaStatus?.toLowerCase().includes('approved') ? 'success' : 'warning'} 
                        />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Environmental Clearance</p>
                        <StatusBadge 
                          status={property.environmentalClearance} 
                          type={property.environmentalClearance?.toLowerCase().includes('approved') ? 'success' : 'warning'} 
                        />
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <InfoRow label="Legal Verification Status" value={property.legalVerificationStatus} icon={CheckCircle2} />
                    <InfoRow label="Ownership Type" value={property.ownershipType} />
                    <InfoRow label="Tax Status" value={property.taxStatus} />
                    <InfoRow label="Encumbrance Status" value={property.encumbranceStatus} />
                    
                    {property.governmentApprovals && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Government Approvals</p>
                          <p className="text-sm">{property.governmentApprovals}</p>
                        </div>
                      </>
                    )}

                    {property.titleDeedDetails && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Title & Deed Details</p>
                          <p className="text-sm">{property.titleDeedDetails}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {(property.riskAssessment || property.complianceCheck) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Risk & Compliance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {property.riskAssessment && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Risk Assessment</p>
                          <p className="text-sm">{property.riskAssessment}</p>
                        </div>
                      )}
                      {property.complianceCheck && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Compliance Check</p>
                          <p className="text-sm">{property.complianceCheck}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Financial Tab */}
              <TabsContent value="financial" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Financial Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <InfoRow label="Price" value={`₹${property.price}`} />
                    <InfoRow label="Price per Sq.ft" value={property.pricePerSqft ? `₹${property.pricePerSqft}` : undefined} />
                    <InfoRow label="Price per Acre" value={property.pricePerAcre ? `₹${property.pricePerAcre}` : undefined} />
                    <InfoRow label="Market Value Trend" value={property.marketValueTrend} />
                    <InfoRow label="Rental Income" value={property.rentalIncome} />
                    
                    {property.paymentTerms && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Payment Terms</p>
                          <p className="text-sm">{property.paymentTerms}</p>
                        </div>
                      </>
                    )}

                    {property.leaseTerms && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Lease Terms</p>
                          <p className="text-sm">{property.leaseTerms}</p>
                        </div>
                      </>
                    )}

                    {property.investmentPotential && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Investment Potential</p>
                          <p className="text-sm">{property.investmentPotential}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Location Tab */}
              <TabsContent value="location" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Location & Connectivity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <InfoRow label="Location" value={property.location} />
                    <InfoRow label="Address" value={property.address} />
                    
                    {property.connectivity && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Connectivity</p>
                          <p className="text-sm">{property.connectivity}</p>
                        </div>
                      </>
                    )}

                    {property.nearbyFacilities && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Nearby Facilities</p>
                          <p className="text-sm">{property.nearbyFacilities}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Owner Details (if unlocked) */}
            {isUnlocked && owner && (
              <Card className="border-primary">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Unlock className="h-5 w-5 text-primary" />
                    <CardTitle>Owner Details</CardTitle>
                  </div>
                  <CardDescription>Verified property owner information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{owner.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{owner.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{owner.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{owner.address}</p>
                      </div>
                    </div>
                  </div>

                  {owner.identityVerification && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Identity Verified: {owner.identityVerification}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex gap-3">
                    <Button onClick={() => handleDownload('pdf')} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button onClick={() => handleDownload('excel')} variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Unlock Card */}
            {!isUnlocked && (
              <Card className="sticky top-4">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    <CardTitle>Unlock Owner Details</CardTitle>
                  </div>
                  <CardDescription>
                    Get verified property owner information and documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <span className="font-medium">Token Cost</span>
                    <div className="flex items-center gap-1.5">
                      <Coins className="h-5 w-5 text-primary" />
                      <span className="text-xl font-bold text-primary">{property.tokenCost}</span>
                    </div>
                  </div>

                  {isAuthenticated && user && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Your Balance</span>
                      <span className="font-semibold">{user.tokenBalance} Tokens</span>
                    </div>
                  )}

                  {isAuthenticated ? (
                    user && user.tokenBalance >= property.tokenCost ? (
                      <Button onClick={handleUnlock} disabled={unlocking} className="w-full">
                        {unlocking ? 'Unlocking...' : 'Unlock Now'}
                      </Button>
                    ) : (
                      <Button asChild className="w-full">
                        <Link to="/pricing">Buy Tokens</Link>
                      </Button>
                    )
                  ) : (
                    <Button asChild className="w-full">
                      <Link to="/login">Sign In to Unlock</Link>
                    </Button>
                  )}

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Owner contact details
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Identity verification status
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      PDF & Excel downloads
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Lifetime access
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {property.updatedAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{new Date(property.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                {property.propertyId && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Property ID</p>
                      <p className="font-medium">{property.propertyId}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}