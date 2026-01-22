import { mysqlTable, int, varchar, text, decimal, timestamp, boolean, index } from 'drizzle-orm/mysql-core';

// Users table with role-based access and token balance
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'), // 'admin' or 'user'
  tokenBalance: int('token_balance').notNull().default(0),
  referralCode: varchar('referral_code', { length: 20 }).unique(),
  referredBy: int('referred_by'), // ID of user who referred this user
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
  referralCodeIdx: index('referral_code_idx').on(table.referralCode),
}));

// Properties table - Comprehensive real estate data
export const properties = mysqlTable('properties', {
  id: int('id').primaryKey().autoincrement(),
  
  // Basic Information (1-4)
  title: varchar('title', { length: 255 }).notNull(),
  propertyCategory: varchar('property_category', { length: 100 }), // Residential, Commercial, Industrial, Agricultural
  type: varchar('type', { length: 100 }).notNull(), // Apartment, Villa, Plot, Office, Warehouse, etc.
  location: varchar('location', { length: 255 }).notNull(),
  address: text('address').notNull(),
  
  // Property Details (5-7)
  propertyId: varchar('property_id', { length: 100 }).unique(), // Custom property ID
  propertyStatus: varchar('property_status', { length: 50 }), // Sale, Rent, Lease, Development
  landArea: varchar('land_area', { length: 100 }), // Land area
  builtUpArea: varchar('built_up_area', { length: 100 }), // Built-up area
  area: varchar('area', { length: 100 }), // Legacy field
  
  // Dimensions & Zoning (8-10)
  plotDimensions: varchar('plot_dimensions', { length: 255 }), // e.g., "50x80 feet"
  zoning: varchar('zoning', { length: 100 }), // Residential, Commercial, Industrial
  landUse: varchar('land_use', { length: 100 }), // Current land use
  developmentType: varchar('development_type', { length: 100 }), // Gated Community, Standalone, etc.
  
  // Project Details (11-14)
  layoutName: varchar('layout_name', { length: 255 }), // Layout or project name
  numberOfUnits: int('number_of_units'), // Total units/plots
  unitSizes: text('unit_sizes'), // JSON or comma-separated
  floorPlan: text('floor_plan'), // URL or description
  
  // Infrastructure (15-18)
  roadAccess: varchar('road_access', { length: 255 }), // Road type and width
  roadWidth: varchar('road_width', { length: 50 }), // e.g., "40 feet"
  powerAvailability: varchar('power_availability', { length: 100 }), // Available, Not Available, Planned
  waterAvailability: varchar('water_availability', { length: 100 }),
  drainageSystem: varchar('drainage_system', { length: 100 }),
  sewageSystem: varchar('sewage_system', { length: 100 }),
  parkingSpaces: varchar('parking_spaces', { length: 100 }),
  vehicleAccess: varchar('vehicle_access', { length: 255 }),
  
  // Amenities & Construction (19-20)
  amenities: text('amenities'), // JSON or comma-separated list
  infrastructure: text('infrastructure'),
  furnishingStatus: varchar('furnishing_status', { length: 100 }), // Furnished, Semi-furnished, Unfurnished
  constructionStatus: varchar('construction_status', { length: 100 }), // Completed, Under Construction, Planned
  
  // Legal & Approvals (21-24)
  governmentApprovals: text('government_approvals'), // List of approvals
  reraStatus: varchar('rera_status', { length: 100 }), // Approved, Pending, Not Applicable
  dtcpStatus: varchar('dtcp_status', { length: 100 }),
  cmdaStatus: varchar('cmda_status', { length: 100 }),
  environmentalClearance: varchar('environmental_clearance', { length: 100 }),
  legalVerificationStatus: varchar('legal_verification_status', { length: 100 }), // Verified, Pending, Issues Found
  
  // Ownership & Legal (25-27)
  ownershipType: varchar('ownership_type', { length: 100 }), // Freehold, Leasehold, Co-operative
  titleDeedDetails: text('title_deed_details'),
  taxStatus: varchar('tax_status', { length: 100 }), // Clear, Pending
  encumbranceStatus: varchar('encumbrance_status', { length: 100 }), // Clear, Encumbered
  
  // Financial Details (28-32)
  investmentPotential: text('investment_potential'),
  rentalIncome: varchar('rental_income', { length: 100 }),
  leaseTerms: text('lease_terms'),
  price: varchar('price', { length: 50 }).notNull(),
  paymentTerms: text('payment_terms'),
  pricePerSqft: varchar('price_per_sqft', { length: 50 }),
  pricePerAcre: varchar('price_per_acre', { length: 50 }),
  marketValueTrend: varchar('market_value_trend', { length: 100 }), // Rising, Stable, Declining
  
  // Description & Location (33-36)
  description: text('description'),
  connectivity: text('connectivity'), // Transportation and connectivity details
  nearbyFacilities: text('nearby_facilities'), // Schools, hospitals, malls, etc.
  suitability: varchar('suitability', { length: 255 }), // Residential, Industrial, Commercial, Farm
  
  // Development & Builder (37-39)
  projectPhase: varchar('project_phase', { length: 100 }), // Phase 1, Phase 2, etc.
  developmentStage: varchar('development_stage', { length: 100 }), // Planning, Construction, Completed
  builderName: varchar('builder_name', { length: 255 }),
  developerName: varchar('developer_name', { length: 255 }),
  contractorName: varchar('contractor_name', { length: 255 }),
  maintenanceCost: varchar('maintenance_cost', { length: 100 }),
  operatingCost: varchar('operating_cost', { length: 100 }),
  
  // Risk & Compliance (40)
  riskAssessment: text('risk_assessment'),
  complianceCheck: text('compliance_check'),
  
  // Media & Documents
  images: text('images'), // JSON array of image URLs
  imageUrl: text('image_url'), // Primary image URL
  documents: text('documents'), // JSON array of document URLs (token-protected)
  legalDocuments: text('legal_documents'), // JSON array (token-protected)
  approvalDocuments: text('approval_documents'), // JSON array (token-protected)
  ownershipProof: text('ownership_proof'), // JSON array (token-protected)
  
  // Owner Information (Token Protected - 41-44)
  ownerName: varchar('owner_name', { length: 255 }),
  ownerPhone: varchar('owner_phone', { length: 20 }),
  ownerEmail: varchar('owner_email', { length: 255 }),
  ownerAddress: text('owner_address'),
  identityVerification: varchar('identity_verification', { length: 100 }), // Verified, Pending, Not Verified
  
  // Analytics & Metadata (48-49)
  viewsCount: int('views_count').default(0),
  tokenCost: int('token_cost').notNull().default(5),
  isActive: boolean('is_active').notNull().default(true),
  status: boolean('status').notNull().default(true),
  
  // Legacy fields
  ownerId: int('owner_id'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  statusIdx: index('status_idx').on(table.status),
  isActiveIdx: index('is_active_idx').on(table.isActive),
  typeIdx: index('type_idx').on(table.type),
  locationIdx: index('location_idx').on(table.location),
  propertyIdIdx: index('property_id_idx').on(table.propertyId),
  propertyCategoryIdx: index('property_category_idx').on(table.propertyCategory),
  propertyStatusIdx: index('property_status_idx').on(table.propertyStatus),
}));

// Property Owners table (sensitive data) - DEPRECATED: Owner info now stored in properties table
export const propertyOwners = mysqlTable('property_owners', {
  id: int('id').primaryKey().autoincrement(),
  propertyId: int('property_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  address: text('address').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  propertyIdx: index('property_idx').on(table.propertyId),
}));

// User Property Access table (tracks unlocked properties)
export const userPropertyAccess = mysqlTable('user_property_access', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  propertyId: int('property_id').notNull(),
  unlockedAt: timestamp('unlocked_at').defaultNow(),
}, (table) => ({
  userPropertyIdx: index('user_property_idx').on(table.userId, table.propertyId),
}));

// Payments table
export const payments = mysqlTable('payments', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  tokens: int('tokens').notNull(),
  razorpayOrderId: varchar('razorpay_order_id', { length: 255 }),
  razorpayPaymentId: varchar('razorpay_payment_id', { length: 255 }),
  razorpaySignature: varchar('razorpay_signature', { length: 255 }),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // 'pending', 'completed', 'failed'
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdx: index('user_idx').on(table.userId),
  statusIdx: index('status_idx').on(table.status),
}));

// Token Logs table (audit trail)
export const tokenLogs = mysqlTable('token_logs', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  propertyId: int('property_id'),
  action: varchar('action', { length: 100 }).notNull(), // 'unlock', 'purchase', 'refund'
  tokensUsed: int('tokens_used').notNull(),
  balanceBefore: int('balance_before').notNull(),
  balanceAfter: int('balance_after').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdx: index('user_idx').on(table.userId),
  actionIdx: index('action_idx').on(table.action),
}));

// Token Transactions table (detailed transaction history)
export const tokenTransactions = mysqlTable('token_transactions', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'purchase', 'unlock', 'referral_bonus'
  amount: int('amount').notNull(), // Positive for credits, negative for debits
  description: text('description'),
  relatedPropertyId: int('related_property_id'),
  relatedReferralId: int('related_referral_id'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdx: index('user_idx').on(table.userId),
  typeIdx: index('type_idx').on(table.type),
}));

// Favorites table (user watchlist)
export const favorites = mysqlTable('favorites', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  propertyId: int('property_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userPropertyIdx: index('user_property_idx').on(table.userId, table.propertyId),
  userIdx: index('user_idx').on(table.userId),
}));

// Referrals table (track referral rewards)
export const referrals = mysqlTable('referrals', {
  id: int('id').primaryKey().autoincrement(),
  referrerId: int('referrer_id').notNull(), // User who referred
  refereeId: int('referee_id').notNull(), // User who was referred
  referralCode: varchar('referral_code', { length: 20 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, completed
  referrerBonus: int('referrer_bonus').default(0), // Tokens given to referrer
  refereeBonus: int('referee_bonus').default(0), // Tokens given to referee
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  referrerIdx: index('referrer_idx').on(table.referrerId),
  refereeIdx: index('referee_idx').on(table.refereeId),
  statusIdx: index('status_idx').on(table.status),
}));

// System Configuration table
export const systemConfig = mysqlTable('system_config', {
  id: int('id').primaryKey().autoincrement(),
  configKey: varchar('config_key', { length: 100 }).notNull().unique(),
  configValue: text('config_value'),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  updatedBy: int('updated_by'), // Admin user ID who updated
}, (table) => ({
  configKeyIdx: index('config_key_idx').on(table.configKey),
}));
