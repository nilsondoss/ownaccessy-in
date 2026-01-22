import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyFormData {
  [key: string]: string;
}

interface ComprehensivePropertyFormProps {
  formData: PropertyFormData;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

interface StepConfig {
  id: number;
  title: string;
  description: string;
  requiredFields: string[];
}

const STEPS: StepConfig[] = [
  {
    id: 1,
    title: 'Basic Information',
    description: 'Essential property details',
    requiredFields: ['title', 'propertyCategory', 'type', 'location', 'address', 'description', 'area'],
  },
  {
    id: 2,
    title: 'Infrastructure',
    description: 'Utilities and facilities',
    requiredFields: [],
  },
  {
    id: 3,
    title: 'Legal & Approvals',
    description: 'Legal documentation',
    requiredFields: [],
  },
  {
    id: 4,
    title: 'Financial Details',
    description: 'Pricing and investment',
    requiredFields: ['price'],
  },
  {
    id: 5,
    title: 'Owner Information',
    description: 'Contact details (token protected)',
    requiredFields: ['ownerName', 'ownerEmail', 'ownerPhone', 'ownerAddress', 'tokenCost'],
  },
];

export function ComprehensivePropertyForm({ formData, onChange, onSubmit, isSubmitting = false }: ComprehensivePropertyFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const validateStep = (stepId: number): boolean => {
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return true;

    const missingFields = step.requiredFields.filter((field) => {
      const value = formData[field];
      // Check if value is empty or just whitespace
      return !value || (typeof value === 'string' && value.trim() === '');
    });

    if (missingFields.length > 0) {
      const fieldLabels = missingFields.map((field) => {
        // Convert camelCase to Title Case with better formatting
        const formatted = field
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase())
          .trim();
        return formatted;
      });
      setValidationError(`Please fill in the following required fields: ${fieldLabels.join(', ')}`);
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
      setValidationError(null);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setValidationError(null);
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit();
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Step {currentStep} of {STEPS.length}</span>
          <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  currentStep === step.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : completedSteps.includes(step.id)
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-muted bg-background text-muted-foreground'
                }`}
              >
                {completedSteps.includes(step.id) ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              <div className="text-center mt-2 hidden md:block">
                <div className="text-xs font-medium">{step.title}</div>
                <div className="text-xs text-muted-foreground">{step.description}</div>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 transition-all ${
                  completedSteps.includes(step.id) ? 'bg-green-500' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      {/* Step Content */}
      <div className="min-h-[500px]">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>Basic property information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Title <span className="text-destructive">*</span></Label>
                    <Input value={formData.title || ''} onChange={(e) => onChange('title', e.target.value)} placeholder="Luxury Villa in Whitefield" />
                  </div>
                  <div>
                    <Label>Property Category <span className="text-destructive">*</span></Label>
                    <Select value={formData.propertyCategory || ''} onValueChange={(value) => onChange('propertyCategory', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Residential">Residential</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Agricultural">Agricultural</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Type <span className="text-destructive">*</span></Label>
                    <Select value={formData.type || ''} onValueChange={(value) => onChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Plot">Plot</SelectItem>
                        <SelectItem value="Office Space">Office Space</SelectItem>
                        <SelectItem value="Retail Space">Retail Space</SelectItem>
                        <SelectItem value="Warehouse">Warehouse</SelectItem>
                        <SelectItem value="Agricultural Land">Agricultural Land</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Property Status</Label>
                    <Input value={formData.propertyStatus || ''} onChange={(e) => onChange('propertyStatus', e.target.value)} placeholder="Ready to Move, Under Construction" />
                  </div>
                  <div>
                    <Label>Property ID</Label>
                    <Input value={formData.propertyId || ''} onChange={(e) => onChange('propertyId', e.target.value)} placeholder="PROP-XXX-2024-001" />
                  </div>
                  <div>
                    <Label>Location <span className="text-destructive">*</span></Label>
                    <Input value={formData.location || ''} onChange={(e) => onChange('location', e.target.value)} placeholder="Whitefield, Bangalore" />
                  </div>
                </div>
                <div>
                  <Label>Address <span className="text-destructive">*</span></Label>
                  <Input value={formData.address || ''} onChange={(e) => onChange('address', e.target.value)} placeholder="ITPL Main Road, Whitefield" />
                </div>
                <div>
                  <Label>Description <span className="text-destructive">*</span></Label>
                  <Textarea value={formData.description || ''} onChange={(e) => onChange('description', e.target.value)} rows={4} placeholder="Describe the property..." />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Areas & Dimensions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Land Area</Label>
                    <Input value={formData.landArea || ''} onChange={(e) => onChange('landArea', e.target.value)} placeholder="2400 sq ft" />
                  </div>
                  <div>
                    <Label>Built-up Area</Label>
                    <Input value={formData.builtUpArea || ''} onChange={(e) => onChange('builtUpArea', e.target.value)} placeholder="3200 sq ft" />
                  </div>
                  <div>
                    <Label>Total Area <span className="text-destructive">*</span></Label>
                    <Input value={formData.area || ''} onChange={(e) => onChange('area', e.target.value)} placeholder="3200" />
                  </div>
                  <div>
                    <Label>Plot Dimensions</Label>
                    <Input value={formData.plotDimensions || ''} onChange={(e) => onChange('plotDimensions', e.target.value)} placeholder="40x60 feet" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zoning & Development</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Zoning</Label>
                    <Input value={formData.zoning || ''} onChange={(e) => onChange('zoning', e.target.value)} placeholder="Residential Zone R1" />
                  </div>
                  <div>
                    <Label>Land Use</Label>
                    <Input value={formData.landUse || ''} onChange={(e) => onChange('landUse', e.target.value)} placeholder="Residential" />
                  </div>
                  <div>
                    <Label>Development Type</Label>
                    <Input value={formData.developmentType || ''} onChange={(e) => onChange('developmentType', e.target.value)} placeholder="Gated Community" />
                  </div>
                  <div>
                    <Label>Layout Name</Label>
                    <Input value={formData.layoutName || ''} onChange={(e) => onChange('layoutName', e.target.value)} placeholder="Brigade Meadows Phase 2" />
                  </div>
                  <div>
                    <Label>Number of Units</Label>
                    <Input value={formData.numberOfUnits || ''} onChange={(e) => onChange('numberOfUnits', e.target.value)} placeholder="120" />
                  </div>
                  <div>
                    <Label>Unit Sizes</Label>
                    <Input value={formData.unitSizes || ''} onChange={(e) => onChange('unitSizes', e.target.value)} placeholder="2800-4200 sq ft" />
                  </div>
                </div>
                <div>
                  <Label>Floor Plan</Label>
                  <Textarea value={formData.floorPlan || ''} onChange={(e) => onChange('floorPlan', e.target.value)} rows={2} placeholder="G+2 floors with terrace" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Amenities & Construction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Amenities</Label>
                  <Textarea value={formData.amenities || ''} onChange={(e) => onChange('amenities', e.target.value)} rows={3} placeholder="Swimming pool, Gym, Clubhouse, etc." />
                </div>
                <div>
                  <Label>Infrastructure</Label>
                  <Textarea value={formData.infrastructure || ''} onChange={(e) => onChange('infrastructure', e.target.value)} rows={3} placeholder="24x7 Security, CCTV, etc." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Furnishing Status</Label>
                    <Input value={formData.furnishingStatus || ''} onChange={(e) => onChange('furnishingStatus', e.target.value)} placeholder="Semi-Furnished" />
                  </div>
                  <div>
                    <Label>Construction Status</Label>
                    <Input value={formData.constructionStatus || ''} onChange={(e) => onChange('constructionStatus', e.target.value)} placeholder="Completed" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Image URL</Label>
                  <Input value={formData.imageUrl || ''} onChange={(e) => onChange('imageUrl', e.target.value)} placeholder="https://..." />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Infrastructure */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Infrastructure Details</CardTitle>
                <CardDescription>Utilities and connectivity information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Road Access</Label>
                    <Input value={formData.roadAccess || ''} onChange={(e) => onChange('roadAccess', e.target.value)} placeholder="ITPL Main Road - 80 feet" />
                  </div>
                  <div>
                    <Label>Road Width</Label>
                    <Input value={formData.roadWidth || ''} onChange={(e) => onChange('roadWidth', e.target.value)} placeholder="80 feet" />
                  </div>
                  <div>
                    <Label>Power Availability</Label>
                    <Input value={formData.powerAvailability || ''} onChange={(e) => onChange('powerAvailability', e.target.value)} placeholder="BESCOM 3-phase" />
                  </div>
                  <div>
                    <Label>Water Availability</Label>
                    <Input value={formData.waterAvailability || ''} onChange={(e) => onChange('waterAvailability', e.target.value)} placeholder="BWSSB + Borewell" />
                  </div>
                  <div>
                    <Label>Drainage System</Label>
                    <Input value={formData.drainageSystem || ''} onChange={(e) => onChange('drainageSystem', e.target.value)} placeholder="Underground drainage" />
                  </div>
                  <div>
                    <Label>Sewage System</Label>
                    <Input value={formData.sewageSystem || ''} onChange={(e) => onChange('sewageSystem', e.target.value)} placeholder="Sewage treatment plant" />
                  </div>
                  <div>
                    <Label>Parking Spaces</Label>
                    <Input value={formData.parkingSpaces || ''} onChange={(e) => onChange('parkingSpaces', e.target.value)} placeholder="2 covered + 2 open" />
                  </div>
                  <div>
                    <Label>Vehicle Access</Label>
                    <Input value={formData.vehicleAccess || ''} onChange={(e) => onChange('vehicleAccess', e.target.value)} placeholder="Wide entrance gate" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Connectivity</Label>
                  <Textarea value={formData.connectivity || ''} onChange={(e) => onChange('connectivity', e.target.value)} rows={2} placeholder="Whitefield Metro - 2 km, Airport - 35 km" />
                </div>
                <div>
                  <Label>Nearby Facilities</Label>
                  <Textarea value={formData.nearbyFacilities || ''} onChange={(e) => onChange('nearbyFacilities', e.target.value)} rows={3} placeholder="Schools, Hospitals, Shopping malls" />
                </div>
                <div>
                  <Label>Suitability</Label>
                  <Input value={formData.suitability || ''} onChange={(e) => onChange('suitability', e.target.value)} placeholder="Residential - Premium Family Living" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Legal & Approvals */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Legal & Approvals</CardTitle>
                <CardDescription>Government approvals and legal documentation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Government Approvals</Label>
                  <Textarea value={formData.governmentApprovals || ''} onChange={(e) => onChange('governmentApprovals', e.target.value)} rows={2} placeholder="BDA Approved, BBMP Approved" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>RERA Status</Label>
                    <Input value={formData.reraStatus || ''} onChange={(e) => onChange('reraStatus', e.target.value)} placeholder="RERA Approved - PRM/KA/..." />
                  </div>
                  <div>
                    <Label>DTCP Status</Label>
                    <Input value={formData.dtcpStatus || ''} onChange={(e) => onChange('dtcpStatus', e.target.value)} placeholder="DTCP Approved" />
                  </div>
                  <div>
                    <Label>CMDA Status</Label>
                    <Input value={formData.cmdaStatus || ''} onChange={(e) => onChange('cmdaStatus', e.target.value)} placeholder="CMDA Approved" />
                  </div>
                  <div>
                    <Label>Environmental Clearance</Label>
                    <Input value={formData.environmentalClearance || ''} onChange={(e) => onChange('environmentalClearance', e.target.value)} placeholder="Clearance Obtained" />
                  </div>
                </div>
                <div>
                  <Label>Legal Verification Status</Label>
                  <Input value={formData.legalVerificationStatus || ''} onChange={(e) => onChange('legalVerificationStatus', e.target.value)} placeholder="Verified - Clear Title" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ownership</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ownership Type</Label>
                    <Input value={formData.ownershipType || ''} onChange={(e) => onChange('ownershipType', e.target.value)} placeholder="Freehold" />
                  </div>
                  <div>
                    <Label>Tax Status</Label>
                    <Input value={formData.taxStatus || ''} onChange={(e) => onChange('taxStatus', e.target.value)} placeholder="Paid up to date" />
                  </div>
                </div>
                <div>
                  <Label>Title Deed Details</Label>
                  <Textarea value={formData.titleDeedDetails || ''} onChange={(e) => onChange('titleDeedDetails', e.target.value)} rows={2} placeholder="Clear freehold title" />
                </div>
                <div>
                  <Label>Encumbrance Status</Label>
                  <Input value={formData.encumbranceStatus || ''} onChange={(e) => onChange('encumbranceStatus', e.target.value)} placeholder="No Encumbrance - Clear EC" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Risk Assessment</Label>
                  <Textarea value={formData.riskAssessment || ''} onChange={(e) => onChange('riskAssessment', e.target.value)} rows={2} placeholder="Low Risk - Prime location" />
                </div>
                <div>
                  <Label>Compliance Check</Label>
                  <Input value={formData.complianceCheck || ''} onChange={(e) => onChange('complianceCheck', e.target.value)} placeholder="Fully Compliant" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Financial Details */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Property pricing and valuation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price <span className="text-destructive">*</span></Label>
                    <Input value={formData.price || ''} onChange={(e) => onChange('price', e.target.value)} placeholder="2,85,00,000" />
                  </div>
                  <div>
                    <Label>Price per Sq.ft</Label>
                    <Input value={formData.pricePerSqft || ''} onChange={(e) => onChange('pricePerSqft', e.target.value)} placeholder="8,906" />
                  </div>
                  <div>
                    <Label>Price per Acre</Label>
                    <Input value={formData.pricePerAcre || ''} onChange={(e) => onChange('pricePerAcre', e.target.value)} placeholder="N/A" />
                  </div>
                  <div>
                    <Label>Market Value Trend</Label>
                    <Input value={formData.marketValueTrend || ''} onChange={(e) => onChange('marketValueTrend', e.target.value)} placeholder="Rising - 12% growth" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment & Returns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Investment Potential</Label>
                  <Textarea value={formData.investmentPotential || ''} onChange={(e) => onChange('investmentPotential', e.target.value)} rows={3} placeholder="Excellent location with high appreciation potential" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Rental Income</Label>
                    <Input value={formData.rentalIncome || ''} onChange={(e) => onChange('rentalIncome', e.target.value)} placeholder="₹60,000 - ₹75,000/month" />
                  </div>
                  <div>
                    <Label>Lease Terms</Label>
                    <Input value={formData.leaseTerms || ''} onChange={(e) => onChange('leaseTerms', e.target.value)} placeholder="Minimum 11 months" />
                  </div>
                </div>
                <div>
                  <Label>Payment Terms</Label>
                  <Textarea value={formData.paymentTerms || ''} onChange={(e) => onChange('paymentTerms', e.target.value)} rows={2} placeholder="Bank loan available - 80% funding" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Development Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Project Phase</Label>
                    <Input value={formData.projectPhase || ''} onChange={(e) => onChange('projectPhase', e.target.value)} placeholder="Phase 2" />
                  </div>
                  <div>
                    <Label>Development Stage</Label>
                    <Input value={formData.developmentStage || ''} onChange={(e) => onChange('developmentStage', e.target.value)} placeholder="Completed" />
                  </div>
                  <div>
                    <Label>Builder Name</Label>
                    <Input value={formData.builderName || ''} onChange={(e) => onChange('builderName', e.target.value)} placeholder="Brigade Group" />
                  </div>
                  <div>
                    <Label>Developer Name</Label>
                    <Input value={formData.developerName || ''} onChange={(e) => onChange('developerName', e.target.value)} placeholder="Brigade Enterprises" />
                  </div>
                  <div>
                    <Label>Contractor Name</Label>
                    <Input value={formData.contractorName || ''} onChange={(e) => onChange('contractorName', e.target.value)} placeholder="L&T Construction" />
                  </div>
                  <div>
                    <Label>Maintenance Cost</Label>
                    <Input value={formData.maintenanceCost || ''} onChange={(e) => onChange('maintenanceCost', e.target.value)} placeholder="₹5,000/month" />
                  </div>
                  <div>
                    <Label>Operating Cost</Label>
                    <Input value={formData.operatingCost || ''} onChange={(e) => onChange('operatingCost', e.target.value)} placeholder="₹8,000/month" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 5: Owner Information */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Owner Details</CardTitle>
                <CardDescription>Contact information (token protected - only visible after unlocking)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Owner Name <span className="text-destructive">*</span></Label>
                    <Input value={formData.ownerName || ''} onChange={(e) => onChange('ownerName', e.target.value)} placeholder="John Doe" />
                  </div>
                  <div>
                    <Label>Owner Email <span className="text-destructive">*</span></Label>
                    <Input type="email" value={formData.ownerEmail || ''} onChange={(e) => onChange('ownerEmail', e.target.value)} placeholder="john@example.com" />
                  </div>
                  <div>
                    <Label>Owner Phone <span className="text-destructive">*</span></Label>
                    <Input value={formData.ownerPhone || ''} onChange={(e) => onChange('ownerPhone', e.target.value)} placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <Label>Identity Verification</Label>
                    <Input value={formData.identityVerification || ''} onChange={(e) => onChange('identityVerification', e.target.value)} placeholder="Aadhaar Verified" />
                  </div>
                </div>
                <div>
                  <Label>Owner Address <span className="text-destructive">*</span></Label>
                  <Input value={formData.ownerAddress || ''} onChange={(e) => onChange('ownerAddress', e.target.value)} placeholder="Full address" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Token Configuration</CardTitle>
                <CardDescription>Set the token cost to unlock owner details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Token Cost <span className="text-destructive">*</span></Label>
                  <Input type="number" value={formData.tokenCost || ''} onChange={(e) => onChange('tokenCost', e.target.value)} placeholder="5" min="1" />
                  <p className="text-xs text-muted-foreground mt-1">Number of tokens required to unlock owner contact details</p>
                </div>
                <div>
                  <Label>Views Count</Label>
                  <Input type="number" value={formData.viewsCount || '0'} onChange={(e) => onChange('viewsCount', e.target.value)} placeholder="0" />
                  <p className="text-xs text-muted-foreground mt-1">Initial view count (usually 0 for new properties)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1 || isSubmitting}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {STEPS.length}
        </div>

        {currentStep < STEPS.length ? (
          <Button type="button" onClick={handleNext} disabled={isSubmitting}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Property'}
          </Button>
        )}
      </div>
    </div>
  );
}
