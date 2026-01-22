import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useComparison } from '@/lib/comparison-context';
import { ArrowLeft, X, MapPin, Lock, Building2, Eye } from 'lucide-react';

export default function ComparePropertiesPage() {
  const navigate = useNavigate();
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();

  useEffect(() => {
    if (comparisonList.length < 2) {
      navigate('/properties');
    }
  }, [comparisonList.length, navigate]);

  if (comparisonList.length < 2) {
    return null;
  }

  const getPropertyImage = (type: string) => {
    const images = {
      residential: 'https://media.gettyimages.com/id/1937435181/photo/luxury-modern-house-exterior.jpg?b=1&s=2048x2048&w=0&k=20&c=NLG6hfh7uzWj75IgWcfTLct6kvNaLmeh9zzAMDjHmFw=',
      commercial: 'https://media.gettyimages.com/id/1629266462/photo/view-of-moody-rainy-morning-at-san-francisco-downtown-district-california.jpg?b=1&s=2048x2048&w=0&k=20&c=R3c-wrqmmivWr4y1fpWyXt2dZfy_FY8omL4L8KiEA9k=',
      land: 'https://media.gettyimages.com/id/2219590999/photo/arid-land-with-lone-tree-and-distant-greenery.jpg?b=1&s=2048x2048&w=0&k=20&c=pi4pOg0UBUj6Ao2hK2vzLzFmV-HLmER1YH-Svc8V-ho=',
    };
    return images[type as keyof typeof images] || images.residential;
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === '' || value === 'N/A') {
      return <span className="text-muted-foreground italic">Not specified</span>;
    }
    return value;
  };

  const comparisonSections = [
    {
      title: 'Property Overview',
      rows: [
        {
          label: 'Image',
          render: (property: typeof comparisonList[0]) => (
            <div className="relative h-32 bg-muted rounded-md overflow-hidden">
              <img
                src={property.imageUrl || getPropertyImage(property.type)}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
          ),
        },
        {
          label: 'Title',
          render: (property: typeof comparisonList[0]) => (
            <div className="font-semibold">{property.title}</div>
          ),
        },
        {
          label: 'Property ID',
          render: (property: typeof comparisonList[0]) => formatValue(property.propertyId || property.id),
        },
        {
          label: 'Category',
          render: (property: typeof comparisonList[0]) => (
            <Badge variant="secondary" className="capitalize">{formatValue(property.propertyCategory)}</Badge>
          ),
        },
        {
          label: 'Type',
          render: (property: typeof comparisonList[0]) => (
            <Badge className="capitalize">{property.type}</Badge>
          ),
        },
        {
          label: 'Status',
          render: (property: typeof comparisonList[0]) => (
            <Badge variant="outline" className="capitalize">{formatValue(property.propertyStatus)}</Badge>
          ),
        },
        {
          label: 'Views',
          render: (property: typeof comparisonList[0]) => (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{property.viewsCount || 0}</span>
            </div>
          ),
        },
      ],
    },
    {
      title: 'Location Details',
      rows: [
        {
          label: 'Location',
          render: (property: typeof comparisonList[0]) => (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
              <span className="text-sm">{property.location}</span>
            </div>
          ),
        },
        {
          label: 'Address',
          render: (property: typeof comparisonList[0]) => (
            <span className="text-sm text-muted-foreground">{property.address}</span>
          ),
        },
        {
          label: 'Connectivity',
          render: (property: typeof comparisonList[0]) => (
            <span className="text-sm">{formatValue(property.connectivity)}</span>
          ),
        },
        {
          label: 'Nearby Facilities',
          render: (property: typeof comparisonList[0]) => (
            <span className="text-sm">{formatValue(property.nearbyFacilities)}</span>
          ),
        },
        {
          label: 'Suitability',
          render: (property: typeof comparisonList[0]) => formatValue(property.suitability),
        },
      ],
    },
    {
      title: 'Property Dimensions',
      rows: [
        {
          label: 'Land Area',
          render: (property: typeof comparisonList[0]) => (
            <div className="font-medium">{formatValue(property.landArea)}</div>
          ),
        },
        {
          label: 'Built-up Area',
          render: (property: typeof comparisonList[0]) => (
            <div className="font-medium">{formatValue(property.builtUpArea)}</div>
          ),
        },
        {
          label: 'Total Area',
          render: (property: typeof comparisonList[0]) => (
            <div className="font-medium">{formatValue(property.area)}</div>
          ),
        },
        {
          label: 'Plot Dimensions',
          render: (property: typeof comparisonList[0]) => formatValue(property.plotDimensions),
        },
        {
          label: 'Zoning',
          render: (property: typeof comparisonList[0]) => formatValue(property.zoning),
        },
        {
          label: 'Land Use',
          render: (property: typeof comparisonList[0]) => formatValue(property.landUse),
        },
        {
          label: 'Development Type',
          render: (property: typeof comparisonList[0]) => formatValue(property.developmentType),
        },
      ],
    },
    {
      title: 'Financial Details',
      rows: [
        {
          label: 'Price',
          render: (property: typeof comparisonList[0]) => (
            <div className="font-semibold text-lg text-primary">₹{parseFloat(property.price).toLocaleString('en-IN')}</div>
          ),
        },
        {
          label: 'Price per Sqft',
          render: (property: typeof comparisonList[0]) => (
            <div className="text-sm">{formatValue(property.pricePerSqft)}</div>
          ),
        },
        {
          label: 'Price per Acre',
          render: (property: typeof comparisonList[0]) => (
            <div className="text-sm">{formatValue(property.pricePerAcre)}</div>
          ),
        },
        {
          label: 'Payment Terms',
          render: (property: typeof comparisonList[0]) => (
            <span className="text-sm">{formatValue(property.paymentTerms)}</span>
          ),
        },
        {
          label: 'Rental Income',
          render: (property: typeof comparisonList[0]) => formatValue(property.rentalIncome),
        },
        {
          label: 'Lease Terms',
          render: (property: typeof comparisonList[0]) => (
            <span className="text-sm">{formatValue(property.leaseTerms)}</span>
          ),
        },
        {
          label: 'Investment Potential',
          render: (property: typeof comparisonList[0]) => (
            <span className="text-sm">{formatValue(property.investmentPotential)}</span>
          ),
        },
        {
          label: 'Market Value Trend',
          render: (property: typeof comparisonList[0]) => formatValue(property.marketValueTrend),
        },
        {
          label: 'Token Cost',
          render: (property: typeof comparisonList[0]) => (
            <div className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary">{property.tokenCost} Token{property.tokenCost > 1 ? 's' : ''}</span>
            </div>
          ),
        },
      ],
    },
    {
      title: 'Project Details',
      rows: [
        {
          label: 'Layout Name',
          render: (property: typeof comparisonList[0]) => formatValue(property.layoutName),
        },
        {
          label: 'Number of Units',
          render: (property: typeof comparisonList[0]) => formatValue(property.numberOfUnits),
        },
        {
          label: 'Unit Sizes',
          render: (property: typeof comparisonList[0]) => (
            <span className="text-sm">{formatValue(property.unitSizes)}</span>
          ),
        },
        {
          label: 'Floor Plan',
          render: (property: typeof comparisonList[0]) => (
            <span className="text-sm">{formatValue(property.floorPlan)}</span>
          ),
        },
        {
          label: 'Project Phase',
          render: (property: typeof comparisonList[0]) => formatValue(property.projectPhase),
        },
        {
          label: 'Development Stage',
          render: (property: typeof comparisonList[0]) => formatValue(property.developmentStage),
        },
      ],
    },
    {
      title: 'Infrastructure',
      rows: [
        {
          label: 'Road Access',
          render: (property: typeof comparisonList[0]) => formatValue(property.roadAccess),
        },
        {
          label: 'Road Width',
          render: (property: typeof comparisonList[0]) => formatValue(property.roadWidth),
        },
        {
          label: 'Power Availability',
          render: (property: typeof comparisonList[0]) => formatValue(property.powerAvailability),
        },
        {
          label: 'Water Availability',
          render: (property: typeof comparisonList[0]) => formatValue(property.waterAvailability),
        },
        {
          label: 'Drainage System',
          render: (property: typeof comparisonList[0]) => formatValue(property.drainageSystem),
        },
        {
          label: 'Sewage System',
          render: (property: typeof comparisonList[0]) => formatValue(property.sewageSystem),
        },
        {
          label: 'Parking Spaces',
          render: (property: typeof comparisonList[0]) => formatValue(property.parkingSpaces),
        },
        {
          label: 'Vehicle Access',
          render: (property: typeof comparisonList[0]) => formatValue(property.vehicleAccess),
        },
      ],
    },
    {
      title: 'Amenities & Construction',
      rows: [
        {
          label: 'Amenities',
          render: (property: typeof comparisonList[0]) => (
            <span className="text-sm">{formatValue(property.amenities)}</span>
          ),
        },
        {
          label: 'Infrastructure',
          render: (property: typeof comparisonList[0]) => (
            <span className="text-sm">{formatValue(property.infrastructure)}</span>
          ),
        },
        {
          label: 'Furnishing Status',
          render: (property: typeof comparisonList[0]) => formatValue(property.furnishingStatus),
        },
        {
          label: 'Construction Status',
          render: (property: typeof comparisonList[0]) => formatValue(property.constructionStatus),
        },
      ],
    },
    {
      title: 'Legal & Approvals',
      rows: [
        {
          label: 'Government Approvals',
          render: (property: typeof comparisonList[0]) => (
            <span className="text-sm">{formatValue(property.governmentApprovals)}</span>
          ),
        },
        {
          label: 'RERA Status',
          render: (property: typeof comparisonList[0]) => formatValue(property.reraStatus),
        },
        {
          label: 'DTCP Status',
          render: (property: typeof comparisonList[0]) => formatValue(property.dtcpStatus),
        },
        {
          label: 'CMDA Status',
          render: (property: typeof comparisonList[0]) => formatValue(property.cmdaStatus),
        },
        {
          label: 'Environmental Clearance',
          render: (property: typeof comparisonList[0]) => formatValue(property.environmentalClearance),
        },
        {
          label: 'Legal Verification Status',
          render: (property: typeof comparisonList[0]) => formatValue(property.legalVerificationStatus),
        },
      ],
    },
    {
      title: 'Ownership & Legal',
      rows: [
        {
          label: 'Ownership Type',
          render: (property: typeof comparisonList[0]) => formatValue(property.ownershipType),
        },
        {
          label: 'Title Deed Details',
          render: (property: typeof comparisonList[0]) => (
            <span className="text-sm">{formatValue(property.titleDeedDetails)}</span>
          ),
        },
        {
          label: 'Tax Status',
          render: (property: typeof comparisonList[0]) => formatValue(property.taxStatus),
        },
        {
          label: 'Encumbrance Status',
          render: (property: typeof comparisonList[0]) => formatValue(property.encumbranceStatus),
        },
      ],
    },
    {
      title: 'Development & Builder',
      rows: [
        {
          label: 'Builder Name',
          render: (property: typeof comparisonList[0]) => formatValue(property.builderName),
        },
        {
          label: 'Developer Name',
          render: (property: typeof comparisonList[0]) => formatValue(property.developerName),
        },
        {
          label: 'Contractor Name',
          render: (property: typeof comparisonList[0]) => formatValue(property.contractorName),
        },
        {
          label: 'Maintenance Cost',
          render: (property: typeof comparisonList[0]) => formatValue(property.maintenanceCost),
        },
        {
          label: 'Operating Cost',
          render: (property: typeof comparisonList[0]) => formatValue(property.operatingCost),
        },
      ],
    },
    {
      title: 'Risk & Compliance',
      rows: [
        {
          label: 'Risk Assessment',
          render: (property: typeof comparisonList[0]) => (
            <span className="text-sm">{formatValue(property.riskAssessment)}</span>
          ),
        },
        {
          label: 'Compliance Check',
          render: (property: typeof comparisonList[0]) => (
            <span className="text-sm">{formatValue(property.complianceCheck)}</span>
          ),
        },
      ],
    },
    {
      title: 'Description',
      rows: [
        {
          label: 'Description',
          render: (property: typeof comparisonList[0]) => (
            <p className="text-sm text-muted-foreground line-clamp-4">{formatValue(property.description)}</p>
          ),
        },
      ],
    },
    {
      title: 'Actions',
      rows: [
        {
          label: 'Actions',
          render: (property: typeof comparisonList[0]) => (
            <div className="space-y-2">
              <Button
                size="sm"
                className="w-full"
                onClick={() => navigate(`/properties/${property.id}`)}
              >
                View Details
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => removeFromComparison(property.id)}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-muted/30 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/properties')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Compare Properties</h1>
              <p className="text-lg text-muted-foreground">
                Comprehensive side-by-side comparison of {comparisonList.length} properties
              </p>
            </div>
            <Button variant="outline" onClick={clearComparison}>
              Clear All
            </Button>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            {comparisonSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-primary">{section.title}</h2>
                <table className="w-full border-collapse mb-6">
                  <thead>
                    <tr>
                      <th className="w-48 p-4 text-left bg-muted/50 border-b-2 font-semibold">
                        Feature
                      </th>
                      {comparisonList.map((property) => (
                        <th key={property.id} className="p-4 border-b-2 bg-muted/30">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold truncate">{property.title}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 flex-shrink-0"
                              onClick={() => removeFromComparison(property.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-4 font-medium bg-muted/30">{row.label}</td>
                        {comparisonList.map((property) => (
                          <td key={property.id} className="p-4 align-top">
                            {row.render(property)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-6">
            {comparisonList.map((property) => (
              <Card key={property.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{property.title}</CardTitle>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => removeFromComparison(property.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {comparisonSections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-primary">{section.title}</h3>
                      <div className="space-y-3">
                        {section.rows.map((row, index) => (
                          <div key={index} className="space-y-1">
                            <div className="text-sm font-medium text-muted-foreground">
                              {row.label}
                            </div>
                            <div>{row.render(property)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add More Properties */}
          {comparisonList.length < 4 && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => navigate('/properties')}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Add More Properties to Compare (Max 4)
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
