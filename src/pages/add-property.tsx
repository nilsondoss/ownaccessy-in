import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ComprehensivePropertyForm } from '../components/ComprehensivePropertyForm';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';

interface PropertyFormData {
  title: string;
  propertyCategory: string;
  type: string;
  propertyStatus: string;
  location: string;
  address: string;
  propertyId: string;
  landArea: string;
  builtUpArea: string;
  area: string;
  plotDimensions: string;
  zoning: string;
  landUse: string;
  developmentType: string;
  layoutName: string;
  numberOfUnits: string;
  unitSizes: string;
  floorPlan: string;
  roadAccess: string;
  roadWidth: string;
  powerAvailability: string;
  waterAvailability: string;
  drainageSystem: string;
  sewageSystem: string;
  parkingSpaces: string;
  vehicleAccess: string;
  amenities: string;
  infrastructure: string;
  furnishingStatus: string;
  constructionStatus: string;
  governmentApprovals: string;
  reraStatus: string;
  dtcpStatus: string;
  cmdaStatus: string;
  environmentalClearance: string;
  legalVerificationStatus: string;
  ownershipType: string;
  titleDeedDetails: string;
  taxStatus: string;
  encumbranceStatus: string;
  price: string;
  pricePerSqft: string;
  pricePerAcre: string;
  marketValueTrend: string;
  investmentPotential: string;
  rentalIncome: string;
  leaseTerms: string;
  paymentTerms: string;
  description: string;
  connectivity: string;
  nearbyFacilities: string;
  suitability: string;
  projectPhase: string;
  developmentStage: string;
  builderName: string;
  developerName: string;
  contractorName: string;
  maintenanceCost: string;
  operatingCost: string;
  riskAssessment: string;
  complianceCheck: string;
  imageUrl: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAddress: string;
  identityVerification: string;
  tokenCost: string;
  viewsCount: string;
}

const createEmptyPropertyForm = (): PropertyFormData => ({
  title: '',
  propertyCategory: '',
  type: '',
  propertyStatus: '',
  location: '',
  address: '',
  propertyId: '',
  landArea: '',
  builtUpArea: '',
  area: '',
  plotDimensions: '',
  zoning: '',
  landUse: '',
  developmentType: '',
  layoutName: '',
  numberOfUnits: '',
  unitSizes: '',
  floorPlan: '',
  roadAccess: '',
  roadWidth: '',
  powerAvailability: '',
  waterAvailability: '',
  drainageSystem: '',
  sewageSystem: '',
  parkingSpaces: '',
  vehicleAccess: '',
  amenities: '',
  infrastructure: '',
  furnishingStatus: '',
  constructionStatus: '',
  governmentApprovals: '',
  reraStatus: '',
  dtcpStatus: '',
  cmdaStatus: '',
  environmentalClearance: '',
  legalVerificationStatus: '',
  ownershipType: '',
  titleDeedDetails: '',
  taxStatus: '',
  encumbranceStatus: '',
  price: '',
  pricePerSqft: '',
  pricePerAcre: '',
  marketValueTrend: '',
  investmentPotential: '',
  rentalIncome: '',
  leaseTerms: '',
  paymentTerms: '',
  description: '',
  connectivity: '',
  nearbyFacilities: '',
  suitability: '',
  projectPhase: '',
  developmentStage: '',
  builderName: '',
  developerName: '',
  contractorName: '',
  maintenanceCost: '',
  operatingCost: '',
  riskAssessment: '',
  complianceCheck: '',
  imageUrl: '',
  ownerName: '',
  ownerEmail: '',
  ownerPhone: '',
  ownerAddress: '',
  identityVerification: '',
  tokenCost: '50',
  viewsCount: '0',
});

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('id');
  const isEditing = !!propertyId;

  const [formData, setFormData] = useState<PropertyFormData>(createEmptyPropertyForm());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load property data if editing
  useEffect(() => {
    if (propertyId) {
      loadProperty(parseInt(propertyId));
    }
  }, [propertyId]);

  const loadProperty = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await api.getAdminProperties();
      const property = response.properties.find((p: any) => p.id === id);
      if (property) {
        setFormData({
          title: property.title || '',
          propertyCategory: property.propertyCategory || '',
          type: property.type || '',
          propertyStatus: property.propertyStatus || '',
          location: property.location || '',
          address: property.address || '',
          propertyId: property.propertyId || '',
          landArea: property.landArea || '',
          builtUpArea: property.builtUpArea || '',
          area: property.area || '',
          plotDimensions: property.plotDimensions || '',
          zoning: property.zoning || '',
          landUse: property.landUse || '',
          developmentType: property.developmentType || '',
          layoutName: property.layoutName || '',
          numberOfUnits: property.numberOfUnits || '',
          unitSizes: property.unitSizes || '',
          floorPlan: property.floorPlan || '',
          roadAccess: property.roadAccess || '',
          roadWidth: property.roadWidth || '',
          powerAvailability: property.powerAvailability || '',
          waterAvailability: property.waterAvailability || '',
          drainageSystem: property.drainageSystem || '',
          sewageSystem: property.sewageSystem || '',
          parkingSpaces: property.parkingSpaces || '',
          vehicleAccess: property.vehicleAccess || '',
          amenities: property.amenities || '',
          infrastructure: property.infrastructure || '',
          furnishingStatus: property.furnishingStatus || '',
          constructionStatus: property.constructionStatus || '',
          governmentApprovals: property.governmentApprovals || '',
          reraStatus: property.reraStatus || '',
          dtcpStatus: property.dtcpStatus || '',
          cmdaStatus: property.cmdaStatus || '',
          environmentalClearance: property.environmentalClearance || '',
          legalVerificationStatus: property.legalVerificationStatus || '',
          ownershipType: property.ownershipType || '',
          titleDeedDetails: property.titleDeedDetails || '',
          taxStatus: property.taxStatus || '',
          encumbranceStatus: property.encumbranceStatus || '',
          price: property.price || '',
          pricePerSqft: property.pricePerSqft || '',
          pricePerAcre: property.pricePerAcre || '',
          marketValueTrend: property.marketValueTrend || '',
          investmentPotential: property.investmentPotential || '',
          rentalIncome: property.rentalIncome || '',
          leaseTerms: property.leaseTerms || '',
          paymentTerms: property.paymentTerms || '',
          description: property.description || '',
          connectivity: property.connectivity || '',
          nearbyFacilities: property.nearbyFacilities || '',
          suitability: property.suitability || '',
          projectPhase: property.projectPhase || '',
          developmentStage: property.developmentStage || '',
          builderName: property.builderName || '',
          developerName: property.developerName || '',
          contractorName: property.contractorName || '',
          maintenanceCost: property.maintenanceCost || '',
          operatingCost: property.operatingCost || '',
          riskAssessment: property.riskAssessment || '',
          complianceCheck: property.complianceCheck || '',
          imageUrl: property.imageUrl || '',
          ownerName: property.ownerName || '',
          ownerEmail: property.ownerEmail || '',
          ownerPhone: property.ownerPhone || '',
          ownerAddress: property.ownerAddress || '',
          identityVerification: property.identityVerification || '',
          tokenCost: property.tokenCost?.toString() || '50',
          viewsCount: property.viewsCount?.toString() || '0',
        });
      } else {
        toast.error('Property not found');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load property');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Convert form data to property data with all fields
      const propertyData: any = {
        // Basic Information
        title: formData.title,
        propertyCategory: formData.propertyCategory || null,
        type: formData.type,
        propertyStatus: formData.propertyStatus || null,
        location: formData.location,
        address: formData.address,
        propertyId: formData.propertyId || null,
        
        // Areas & Dimensions
        landArea: formData.landArea || null,
        builtUpArea: formData.builtUpArea || null,
        area: formData.area,
        plotDimensions: formData.plotDimensions || null,
        
        // Zoning & Development
        zoning: formData.zoning || null,
        landUse: formData.landUse || null,
        developmentType: formData.developmentType || null,
        layoutName: formData.layoutName || null,
        numberOfUnits: formData.numberOfUnits || null,
        unitSizes: formData.unitSizes || null,
        floorPlan: formData.floorPlan || null,
        
        // Infrastructure
        roadAccess: formData.roadAccess || null,
        roadWidth: formData.roadWidth || null,
        powerAvailability: formData.powerAvailability || null,
        waterAvailability: formData.waterAvailability || null,
        drainageSystem: formData.drainageSystem || null,
        sewageSystem: formData.sewageSystem || null,
        parkingSpaces: formData.parkingSpaces || null,
        vehicleAccess: formData.vehicleAccess || null,
        
        // Amenities & Construction
        amenities: formData.amenities || null,
        infrastructure: formData.infrastructure || null,
        furnishingStatus: formData.furnishingStatus || null,
        constructionStatus: formData.constructionStatus || null,
        
        // Legal & Approvals
        governmentApprovals: formData.governmentApprovals || null,
        reraStatus: formData.reraStatus || null,
        dtcpStatus: formData.dtcpStatus || null,
        cmdaStatus: formData.cmdaStatus || null,
        environmentalClearance: formData.environmentalClearance || null,
        legalVerificationStatus: formData.legalVerificationStatus || null,
        
        // Ownership
        ownershipType: formData.ownershipType || null,
        titleDeedDetails: formData.titleDeedDetails || null,
        taxStatus: formData.taxStatus || null,
        encumbranceStatus: formData.encumbranceStatus || null,
        
        // Financial
        price: formData.price,
        pricePerSqft: formData.pricePerSqft || null,
        pricePerAcre: formData.pricePerAcre || null,
        marketValueTrend: formData.marketValueTrend || null,
        investmentPotential: formData.investmentPotential || null,
        rentalIncome: formData.rentalIncome || null,
        leaseTerms: formData.leaseTerms || null,
        paymentTerms: formData.paymentTerms || null,
        
        // Description & Location
        description: formData.description,
        connectivity: formData.connectivity || null,
        nearbyFacilities: formData.nearbyFacilities || null,
        suitability: formData.suitability || null,
        
        // Development
        projectPhase: formData.projectPhase || null,
        developmentStage: formData.developmentStage || null,
        builderName: formData.builderName || null,
        developerName: formData.developerName || null,
        contractorName: formData.contractorName || null,
        maintenanceCost: formData.maintenanceCost || null,
        operatingCost: formData.operatingCost || null,
        
        // Risk
        riskAssessment: formData.riskAssessment || null,
        complianceCheck: formData.complianceCheck || null,
        
        // Media
        imageUrl: formData.imageUrl || null,
        
        // Owner (Token Protected)
        ownerName: formData.ownerName,
        ownerEmail: formData.ownerEmail,
        ownerPhone: formData.ownerPhone,
        ownerAddress: formData.ownerAddress,
        identityVerification: formData.identityVerification || null,
        
        // Meta
        tokenCost: parseInt(formData.tokenCost),
        viewsCount: formData.viewsCount ? parseInt(formData.viewsCount) : 0,
      };

      if (isEditing && propertyId) {
        await api.updateProperty(parseInt(propertyId), propertyData);
        toast.success('Property updated successfully with all details!');
      } else {
        await api.createProperty(propertyData);
        toast.success('Property created successfully with all details!');
      }

      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save property');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {isEditing ? 'Edit Property' : 'Add New Property'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Fill in all required fields marked with *. Navigate through steps using Next/Back buttons.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
            <CardDescription>
              Complete the form step by step. All required fields must be filled before submission.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ComprehensivePropertyForm
              formData={formData}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
