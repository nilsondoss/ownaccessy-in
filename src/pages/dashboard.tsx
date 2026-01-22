import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Coins, Lock, Download, Building2, TrendingUp, Clock, CheckCircle2, Heart, MapPin, Users, Gift, Copy, Check, DollarSign, Activity, Plus, Edit, Trash2, Eye, EyeOff, Upload, Settings, Save } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/lib/auth-context';
import { useFavorites } from '@/lib/favorites-context';
import { api } from '@/lib/api';
import { ComprehensivePropertyForm } from '@/components/ComprehensivePropertyForm';
import ExcelJS from 'exceljs';

// User Dashboard Interfaces
interface UnlockedProperty {
  id: number;
  propertyId: number;
  propertyTitle: string;
  propertyType: string;
  propertyLocation: string;
  unlockedAt: string;
}

interface TokenTransaction {
  id: number;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

interface FavoriteProperty {
  id: number;
  propertyId: number;
  createdAt: string;
  property: {
    id: number;
    title: string;
    type: string;
    location: string;
    address: string;
    price: string;
    area: string;
    description: string;
    images: string | null;
    status: boolean;
  };
}

interface ReferralData {
  referralCode: string;
  stats: {
    totalReferrals: number;
    completedReferrals: number;
    pendingReferrals: number;
    totalEarned: number;
  };
  referrals: Array<{
    id: number;
    refereeName: string;
    status: string;
    referrerBonus: number;
    createdAt: string;
    completedAt: string | null;
  }>;
}

// Admin Dashboard Interfaces
interface Property {
  id: number;
  title: string;
  type: string;
  propertyCategory?: string;
  propertyStatus?: string;
  location: string;
  address: string;
  price: string;
  area: string;
  description: string;
  imageUrl: string | null;
  tokenCost: number;
  isActive: boolean;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  ownerAddress?: string;
  createdAt?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  tokenBalance: number;
  phone?: string;
  address?: string;
  referralCode?: string;
  createdAt?: string;
}

interface Payment {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  amount: number;
  tokens?: number;
  tokensGranted?: number;
  status: string;
  orderId?: string;
  paymentId?: string;
  createdAt: string;
}

interface AnalyticsData {
  totalRevenue: number;
  totalUsers: number;
  totalProperties: number;
  totalUnlocks: number;
  overview: {
    totalRevenue: number;
    totalTokensSold: number;
    totalUsers: number;
    totalProperties: number;
    totalUnlocks: number;
    avgTokenBalance: number;
    conversionRate: number;
  };
  charts: {
    revenueByDay: Array<{ date: string; revenue: number; count: number }>;
    userGrowth: Array<{ date: string; count: number }>;
    unlocksByDay: Array<{ date: string; count: number }>;
    tokenDistribution: Array<{ type: string; total: number; count: number }>;
  };
  popularProperties: Array<{
    propertyId: number;
    title: string;
    location: string;
    unlockCount: number;
  }>;
  recentTransactions: Array<{
    id: number;
    userId: number;
    userName: string;
    userEmail: string;
    amount: number;
    tokensGranted: number;
    createdAt: string;
  }>;
}

interface TokenLog {
  id: number;
  userId: number;
  userName: string;
  userEmail?: string;
  propertyId?: number | null;
  propertyTitle?: string | null;
  action?: string;
  type?: string;
  amount?: number;
  tokensUsed?: number;
  description?: string;
  timestamp?: string;
  createdAt?: string;
}

interface PropertyFormData {
  // Basic Information
  title: string;
  propertyCategory: string;
  type: string;
  propertyStatus: string;
  location: string;
  address: string;
  propertyId: string;
  
  // Areas & Dimensions
  landArea: string;
  builtUpArea: string;
  area: string;
  plotDimensions: string;
  
  // Zoning & Development
  zoning: string;
  landUse: string;
  developmentType: string;
  layoutName: string;
  numberOfUnits: string;
  unitSizes: string;
  floorPlan: string;
  
  // Infrastructure
  roadAccess: string;
  roadWidth: string;
  powerAvailability: string;
  waterAvailability: string;
  drainageSystem: string;
  sewageSystem: string;
  parkingSpaces: string;
  vehicleAccess: string;
  
  // Amenities & Construction
  amenities: string;
  infrastructure: string;
  furnishingStatus: string;
  constructionStatus: string;
  
  // Legal & Approvals
  governmentApprovals: string;
  reraStatus: string;
  dtcpStatus: string;
  cmdaStatus: string;
  environmentalClearance: string;
  legalVerificationStatus: string;
  
  // Ownership
  ownershipType: string;
  titleDeedDetails: string;
  taxStatus: string;
  encumbranceStatus: string;
  
  // Financial
  price: string;
  pricePerSqft: string;
  pricePerAcre: string;
  marketValueTrend: string;
  investmentPotential: string;
  rentalIncome: string;
  leaseTerms: string;
  paymentTerms: string;
  
  // Description & Location
  description: string;
  connectivity: string;
  nearbyFacilities: string;
  suitability: string;
  
  // Development
  projectPhase: string;
  developmentStage: string;
  builderName: string;
  developerName: string;
  contractorName: string;
  maintenanceCost: string;
  operatingCost: string;
  
  // Risk
  riskAssessment: string;
  complianceCheck: string;
  
  // Media
  imageUrl: string;
  
  // Owner (Token Protected)
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAddress: string;
  identityVerification: string;
  
  // Meta
  tokenCost: string;
  viewsCount: string;
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

// Helper function to create empty property form data
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

// Excel Export Functions
const exportPropertiesToExcel = async (properties: Property[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Properties');

  // Define columns
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Title', key: 'title', width: 30 },
    { header: 'Category', key: 'propertyCategory', width: 15 },
    { header: 'Type', key: 'type', width: 15 },
    { header: 'Status', key: 'propertyStatus', width: 15 },
    { header: 'Location', key: 'location', width: 20 },
    { header: 'Address', key: 'address', width: 35 },
    { header: 'Price', key: 'price', width: 15 },
    { header: 'Area', key: 'area', width: 15 },
    { header: 'Token Cost', key: 'tokenCost', width: 12 },
    { header: 'Active', key: 'isActive', width: 10 },
    { header: 'Owner Name', key: 'ownerName', width: 20 },
    { header: 'Owner Email', key: 'ownerEmail', width: 25 },
    { header: 'Owner Phone', key: 'ownerPhone', width: 15 },
    { header: 'Created At', key: 'createdAt', width: 20 },
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  // Add data
  properties.forEach(property => {
    worksheet.addRow({
      id: property.id,
      title: property.title,
      propertyCategory: property.propertyCategory || 'N/A',
      type: property.type,
      propertyStatus: property.propertyStatus || 'N/A',
      location: property.location,
      address: property.address,
      price: property.price,
      area: property.area,
      tokenCost: property.tokenCost,
      isActive: property.isActive ? 'Yes' : 'No',
      ownerName: property.ownerName || 'N/A',
      ownerEmail: property.ownerEmail || 'N/A',
      ownerPhone: property.ownerPhone || 'N/A',
      createdAt: property.createdAt ? new Date(property.createdAt).toLocaleString() : 'N/A',
    });
  });

  // Generate buffer and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `properties_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
  toast.success(`Exported ${properties.length} properties to Excel`);
};

const exportUsersToExcel = async (users: User[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Users');

  // Define columns
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Role', key: 'role', width: 12 },
    { header: 'Token Balance', key: 'tokenBalance', width: 15 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Address', key: 'address', width: 35 },
    { header: 'Referral Code', key: 'referralCode', width: 15 },
    { header: 'Created At', key: 'createdAt', width: 20 },
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  // Add data
  users.forEach(user => {
    worksheet.addRow({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tokenBalance: user.tokenBalance,
      phone: user.phone || 'N/A',
      address: user.address || 'N/A',
      referralCode: user.referralCode || 'N/A',
      createdAt: user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A',
    });
  });

  // Generate buffer and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `users_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
  toast.success(`Exported ${users.length} users to Excel`);
};

const exportPaymentsToExcel = async (payments: Payment[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Payments');

  // Define columns
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'User ID', key: 'userId', width: 10 },
    { header: 'User Name', key: 'userName', width: 25 },
    { header: 'User Email', key: 'userEmail', width: 30 },
    { header: 'Amount (₹)', key: 'amount', width: 15 },
    { header: 'Tokens Granted', key: 'tokensGranted', width: 15 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Order ID', key: 'orderId', width: 25 },
    { header: 'Payment ID', key: 'paymentId', width: 25 },
    { header: 'Created At', key: 'createdAt', width: 20 },
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  // Add data
  payments.forEach(payment => {
    worksheet.addRow({
      id: payment.id,
      userId: payment.userId,
      userName: payment.userName,
      userEmail: payment.userEmail,
      amount: payment.amount,
      tokensGranted: payment.tokensGranted || payment.tokens || 0,
      status: payment.status,
      orderId: payment.orderId || 'N/A',
      paymentId: payment.paymentId || 'N/A',
      createdAt: payment.createdAt ? new Date(payment.createdAt).toLocaleString() : 'N/A',
    });
  });

  // Generate buffer and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `payments_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
  toast.success(`Exported ${payments.length} payments to Excel`);
};

const exportTokenLogsToExcel = async (tokenLogs: TokenLog[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Token Logs');

  // Define columns
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'User ID', key: 'userId', width: 10 },
    { header: 'User Name', key: 'userName', width: 25 },
    { header: 'User Email', key: 'userEmail', width: 30 },
    { header: 'Action/Type', key: 'actionType', width: 20 },
    { header: 'Tokens', key: 'tokens', width: 12 },
    { header: 'Property ID', key: 'propertyId', width: 12 },
    { header: 'Property Title', key: 'propertyTitle', width: 30 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Timestamp', key: 'timestamp', width: 20 },
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  // Add data
  tokenLogs.forEach(log => {
    worksheet.addRow({
      id: log.id,
      userId: log.userId,
      userName: log.userName,
      userEmail: log.userEmail || 'N/A',
      actionType: log.action || log.type || 'N/A',
      tokens: log.tokensUsed || log.amount || 0,
      propertyId: log.propertyId || 'N/A',
      propertyTitle: log.propertyTitle || 'N/A',
      description: log.description || 'N/A',
      timestamp: log.timestamp ? new Date(log.timestamp).toLocaleString() : (log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'),
    });
  });

  // Generate buffer and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `token_logs_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
  toast.success(`Exported ${tokenLogs.length} token logs to Excel`);
};

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // User Dashboard State
  const [unlockedProperties, setUnlockedProperties] = useState<UnlockedProperty[]>([]);
  const [favoriteProperties, setFavoriteProperties] = useState<FavoriteProperty[]>([]);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  // Admin Dashboard State
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tokenLogs, setTokenLogs] = useState<TokenLog[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [uploadErrors, setUploadErrors] = useState<any[]>([]);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isTokenLogDetailsOpen, setIsTokenLogDetailsOpen] = useState(false);
  const [selectedTokenLog, setSelectedTokenLog] = useState<TokenLog | null>(null);
  const [isDeleteTokenLogOpen, setIsDeleteTokenLogOpen] = useState(false);
  const [deletingTokenLogId, setDeletingTokenLogId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    tokenBalance: '',
    role: 'user',
  });
  const [formData, setFormData] = useState<PropertyFormData>(createEmptyPropertyForm());
  
  // Configuration State
  const [configData, setConfigData] = useState({
    razorpayKeyId: '',
    razorpayKeySecret: '',
  });
  const [configLoading, setConfigLoading] = useState(false);
  
  // Download Project State
  const [isDownloadingProject, setIsDownloadingProject] = useState(false);

  // Export Filter State
  const [exportFilters, setExportFilters] = useState({
    dateFrom: '',
    dateTo: '',
    propertyCategory: 'all',
    propertyStatus: 'all',
    paymentStatus: 'all',
    userRole: 'all',
    tokenType: 'all',
    searchTerm: '',
  });

  // Apply filters to data
  const filteredProperties = properties.filter(property => {
    // Category filter
    if (exportFilters.propertyCategory !== 'all' && property.propertyCategory !== exportFilters.propertyCategory) {
      return false;
    }
    // Status filter
    if (exportFilters.propertyStatus !== 'all' && property.propertyStatus !== exportFilters.propertyStatus) {
      return false;
    }
    // Date range filter
    if (exportFilters.dateFrom && property.createdAt) {
      const propertyDate = new Date(property.createdAt).toISOString().split('T')[0];
      if (propertyDate < exportFilters.dateFrom) return false;
    }
    if (exportFilters.dateTo && property.createdAt) {
      const propertyDate = new Date(property.createdAt).toISOString().split('T')[0];
      if (propertyDate > exportFilters.dateTo) return false;
    }
    // Search filter
    if (exportFilters.searchTerm) {
      const searchLower = exportFilters.searchTerm.toLowerCase();
      return (
        property.title?.toLowerCase().includes(searchLower) ||
        property.location?.toLowerCase().includes(searchLower) ||
        property.address?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const filteredUsers = users.filter(user => {
    // Role filter
    if (exportFilters.userRole !== 'all' && user.role !== exportFilters.userRole) {
      return false;
    }
    // Date range filter
    if (exportFilters.dateFrom && user.createdAt) {
      const userDate = new Date(user.createdAt).toISOString().split('T')[0];
      if (userDate < exportFilters.dateFrom) return false;
    }
    if (exportFilters.dateTo && user.createdAt) {
      const userDate = new Date(user.createdAt).toISOString().split('T')[0];
      if (userDate > exportFilters.dateTo) return false;
    }
    // Search filter
    if (exportFilters.searchTerm) {
      const searchLower = exportFilters.searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const filteredPayments = payments.filter(payment => {
    // Payment status filter
    if (exportFilters.paymentStatus !== 'all' && payment.status?.toLowerCase() !== exportFilters.paymentStatus) {
      return false;
    }
    // Date range filter
    if (exportFilters.dateFrom && payment.createdAt) {
      const paymentDate = new Date(payment.createdAt).toISOString().split('T')[0];
      if (paymentDate < exportFilters.dateFrom) return false;
    }
    if (exportFilters.dateTo && payment.createdAt) {
      const paymentDate = new Date(payment.createdAt).toISOString().split('T')[0];
      if (paymentDate > exportFilters.dateTo) return false;
    }
    // Search filter
    if (exportFilters.searchTerm) {
      const searchLower = exportFilters.searchTerm.toLowerCase();
      return (
        payment.userName?.toLowerCase().includes(searchLower) ||
        payment.userEmail?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const filteredTokenLogs = tokenLogs.filter(log => {
    // Action type filter
    if (exportFilters.tokenType !== 'all' && log.action?.toLowerCase() !== exportFilters.tokenType) {
      return false;
    }
    // Date range filter
    if (exportFilters.dateFrom && log.createdAt) {
      const logDate = new Date(log.createdAt).toISOString().split('T')[0];
      if (logDate < exportFilters.dateFrom) return false;
    }
    if (exportFilters.dateTo && log.createdAt) {
      const logDate = new Date(log.createdAt).toISOString().split('T')[0];
      if (logDate > exportFilters.dateTo) return false;
    }
    // Search filter
    if (exportFilters.searchTerm) {
      const searchLower = exportFilters.searchTerm.toLowerCase();
      return (
        log.userName?.toLowerCase().includes(searchLower) ||
        log.userEmail?.toLowerCase().includes(searchLower) ||
        log.description?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Common State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    } else {
      fetchUserDashboardData();
    }

    // Check for payment success
    if (searchParams.get('payment') === 'success') {
      setShowSuccessAlert(true);
      setSearchParams({});
      setTimeout(() => setShowSuccessAlert(false), 5000);
    }
  }, [isAdmin]);

  // User Dashboard Functions
  const fetchUserDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [propertiesData, transactionsData, favoritesData, referralsData]: any = await Promise.all([
        api.getUnlockedProperties(),
        api.getTokenTransactions(),
        fetch('/api/user/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        }).then(res => res.json()),
        fetch('/api/user/referrals', {
          headers: { Authorization: `Bearer ${token}` },
        }).then(res => res.json()),
      ]);
      setUnlockedProperties(propertiesData.properties || []);
      setTransactions(transactionsData.transactions || []);
      setFavoriteProperties(favoritesData.favorites || []);
      setReferralData(referralsData);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (referralData?.referralCode) {
      navigator.clipboard.writeText(referralData.referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const openEditProfile = () => {
    setProfileFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    setIsEditProfileOpen(true);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response: any = await api.updateProfile(profileFormData);
      setSuccess('Profile updated successfully');
      setIsEditProfileOpen(false);
      
      // Refresh user data
      if (!isAdmin) {
        await fetchUserDashboardData();
      }
      
      // Update auth context by reloading user
      window.location.reload();
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    }
  };

  // Admin Dashboard Functions
  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [propertiesData, usersData, paymentsData, logsData, analyticsData]: any = await Promise.all([
        api.getAdminProperties(),
        api.getUsers(),
        api.getPayments(),
        api.getTokenLogs(),
        fetch('/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        }).then(res => res.json()),
      ]);
      setProperties(propertiesData.properties || []);
      setUsers(usersData.users || []);
      setPayments(paymentsData.payments || []);
      setTokenLogs(logsData.logs || []);
      setAnalytics(analyticsData);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(createEmptyPropertyForm());
    setEditingProperty(null);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProperty = async () => {
    setError('');
    setSuccess('');
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
        numberOfUnits: formData.numberOfUnits ? parseInt(formData.numberOfUnits) : null,
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

      if (editingProperty) {
        await api.updateProperty(editingProperty.id, propertyData);
        setSuccess('Property updated successfully');
        toast.success('Property updated successfully with all details!');
      } else {
        await api.createProperty(propertyData);
        setSuccess('Property created successfully');
        toast.success('Property created successfully with all details!');
      }

      setIsPropertyDialogOpen(false);
      resetForm();
      fetchAdminData();
    } catch (error: any) {
      setError(error.message || 'Failed to save property');
      toast.error(error.message || 'Failed to save property');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProperty = async (property: Property) => {
    try {
      // Fetch full property details
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/properties/${property.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const fullProperty = data.property;
      
      setEditingProperty(property);
      setFormData({
        title: fullProperty.title || '',
        propertyCategory: fullProperty.propertyCategory || '',
        type: fullProperty.type || '',
        propertyStatus: fullProperty.propertyStatus || '',
        location: fullProperty.location || '',
        address: fullProperty.address || '',
        propertyId: fullProperty.propertyId || '',
        landArea: fullProperty.landArea || '',
        builtUpArea: fullProperty.builtUpArea || '',
        area: fullProperty.area || '',
        plotDimensions: fullProperty.plotDimensions || '',
        zoning: fullProperty.zoning || '',
        landUse: fullProperty.landUse || '',
        developmentType: fullProperty.developmentType || '',
        layoutName: fullProperty.layoutName || '',
        numberOfUnits: fullProperty.numberOfUnits?.toString() || '',
        unitSizes: fullProperty.unitSizes || '',
        floorPlan: fullProperty.floorPlan || '',
        roadAccess: fullProperty.roadAccess || '',
        roadWidth: fullProperty.roadWidth || '',
        powerAvailability: fullProperty.powerAvailability || '',
        waterAvailability: fullProperty.waterAvailability || '',
        drainageSystem: fullProperty.drainageSystem || '',
        sewageSystem: fullProperty.sewageSystem || '',
        parkingSpaces: fullProperty.parkingSpaces || '',
        vehicleAccess: fullProperty.vehicleAccess || '',
        amenities: fullProperty.amenities || '',
        infrastructure: fullProperty.infrastructure || '',
        furnishingStatus: fullProperty.furnishingStatus || '',
        constructionStatus: fullProperty.constructionStatus || '',
        governmentApprovals: fullProperty.governmentApprovals || '',
        reraStatus: fullProperty.reraStatus || '',
        dtcpStatus: fullProperty.dtcpStatus || '',
        cmdaStatus: fullProperty.cmdaStatus || '',
        environmentalClearance: fullProperty.environmentalClearance || '',
        legalVerificationStatus: fullProperty.legalVerificationStatus || '',
        ownershipType: fullProperty.ownershipType || '',
        titleDeedDetails: fullProperty.titleDeedDetails || '',
        taxStatus: fullProperty.taxStatus || '',
        encumbranceStatus: fullProperty.encumbranceStatus || '',
        price: fullProperty.price || '',
        pricePerSqft: fullProperty.pricePerSqft || '',
        pricePerAcre: fullProperty.pricePerAcre || '',
        marketValueTrend: fullProperty.marketValueTrend || '',
        investmentPotential: fullProperty.investmentPotential || '',
        rentalIncome: fullProperty.rentalIncome || '',
        leaseTerms: fullProperty.leaseTerms || '',
        paymentTerms: fullProperty.paymentTerms || '',
        description: fullProperty.description || '',
        connectivity: fullProperty.connectivity || '',
        nearbyFacilities: fullProperty.nearbyFacilities || '',
        suitability: fullProperty.suitability || '',
        projectPhase: fullProperty.projectPhase || '',
        developmentStage: fullProperty.developmentStage || '',
        builderName: fullProperty.builderName || '',
        developerName: fullProperty.developerName || '',
        contractorName: fullProperty.contractorName || '',
        maintenanceCost: fullProperty.maintenanceCost || '',
        operatingCost: fullProperty.operatingCost || '',
        riskAssessment: fullProperty.riskAssessment || '',
        complianceCheck: fullProperty.complianceCheck || '',
        imageUrl: fullProperty.imageUrl || '',
        ownerName: fullProperty.ownerName || '',
        ownerEmail: fullProperty.ownerEmail || '',
        ownerPhone: fullProperty.ownerPhone || '',
        ownerAddress: fullProperty.ownerAddress || '',
        identityVerification: fullProperty.identityVerification || '',
        tokenCost: fullProperty.tokenCost?.toString() || '50',
        viewsCount: fullProperty.viewsCount?.toString() || '0',
      });
      setIsPropertyDialogOpen(true);
    } catch (error) {
      console.error('Error loading property:', error);
      toast.error('Failed to load property details');
    }
  };

  const handleDeleteProperty = async (id: number) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      await api.deleteProperty(id);
      setSuccess('Property deleted successfully');
      toast.success('Property deleted successfully');
      fetchAdminData();
    } catch (error: any) {
      setError(error.message || 'Failed to delete property');
      toast.error(error.message || 'Failed to delete property');
    }
  };

  const handleDeleteTokenLog = async () => {
    if (!deletingTokenLogId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/token-logs/${deletingTokenLogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete token log');
      }

      toast.success('Token log deleted successfully');
      setIsDeleteTokenLogOpen(false);
      setDeletingTokenLogId(null);
      fetchAdminData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete token log');
    }
  };

  const openEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      tokenBalance: user.tokenBalance.toString(),
      role: user.role,
    });
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!editingUser) return;

    try {
      await api.updateUser(editingUser.id, {
        name: userFormData.name,
        email: userFormData.email,
        phone: userFormData.phone || undefined,
        address: userFormData.address || undefined,
        tokenBalance: parseInt(userFormData.tokenBalance),
        role: userFormData.role,
      });
      setSuccess('User updated successfully');
      setIsEditUserOpen(false);
      setEditingUser(null);
      fetchAdminData();
    } catch (error: any) {
      setError(error.message || 'Failed to update user');
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setError('Please select a CSV file');
      return;
    }

    setUploadProgress('Uploading...');
    setUploadErrors([]);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/properties/bulk-upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setUploadProgress(`Success! ${result.successCount} properties uploaded`);
      toast.success(`${result.successCount} properties uploaded successfully and are now live!`);
      
      if (result.errors && result.errors.length > 0) {
        setUploadErrors(result.errors);
        toast.warning(`${result.errors.length} properties had errors`);
      }

      setIsBulkUploadDialogOpen(false);
      setUploadFile(null);
      fetchAdminData();
    } catch (error: any) {
      setUploadProgress('');
      setError(error.message || 'Upload failed');
      toast.error(error.message || 'Upload failed');
    }
  };

  const downloadTemplate = () => {
    window.open('/assets/property-upload-template.csv', '_blank');
  };

  // Download Project Function
  const downloadProject = async () => {
    try {
      setIsDownloadingProject(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch('/api/admin/download-project', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to download project');
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `ownaccessy-project-${new Date().toISOString().split('T')[0]}.zip`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Project downloaded successfully');
    } catch (error: any) {
      console.error('Download project error:', error);
      toast.error(error.message || 'Failed to download project');
    } finally {
      setIsDownloadingProject(false);
    }
  };

  // Excel Export Functions
  const exportAnalyticsToExcel = async () => {
    if (!analytics) return;

    try {
      const workbook = new ExcelJS.Workbook();
      
      // Filter data by date range if specified
      const filterByDate = (data: any[]) => {
        if (!exportFilters.dateFrom && !exportFilters.dateTo) return data;
        return data.filter(item => {
          const itemDate = new Date(item.date);
          const fromDate = exportFilters.dateFrom ? new Date(exportFilters.dateFrom) : null;
          const toDate = exportFilters.dateTo ? new Date(exportFilters.dateTo) : null;
          if (fromDate && itemDate < fromDate) return false;
          if (toDate && itemDate > toDate) return false;
          return true;
        });
      };

      const filteredRevenue = filterByDate(analytics.charts.revenueByDay);
      const filteredUserGrowth = filterByDate(analytics.charts.userGrowth);
      const filteredUnlocks = filterByDate(analytics.charts.unlocksByDay);

      // Calculate filtered totals
      const filteredTotalRevenue = filteredRevenue.reduce((sum, item) => sum + (item.revenue || 0), 0);
      const filteredTotalUsers = filteredUserGrowth.reduce((sum, item) => sum + (item.count || 0), 0);
      const filteredTotalUnlocks = filteredUnlocks.reduce((sum, item) => sum + (item.count || 0), 0);
      
      // Summary Sheet
      const summarySheet = workbook.addWorksheet('Summary');
      summarySheet.columns = [
        { header: 'Metric', key: 'metric', width: 30 },
        { header: 'Value', key: 'value', width: 20 },
      ];
      summarySheet.addRows([
        { metric: 'Total Revenue', value: `₹${filteredTotalRevenue.toLocaleString()}` },
        { metric: 'Total Users (New)', value: filteredTotalUsers },
        { metric: 'Total Properties', value: analytics.totalProperties },
        { metric: 'Total Unlocks', value: filteredTotalUnlocks },
        { metric: 'Date Range', value: exportFilters.dateFrom && exportFilters.dateTo ? `${exportFilters.dateFrom} to ${exportFilters.dateTo}` : 'All Time' },
      ]);

      // Revenue by Day Sheet
      const revenueSheet = workbook.addWorksheet('Revenue by Day');
      revenueSheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Revenue (₹)', key: 'revenue', width: 15 },
      ];
      revenueSheet.addRows(filteredRevenue);

      // User Growth Sheet
      const userGrowthSheet = workbook.addWorksheet('User Growth');
      userGrowthSheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'New Users', key: 'count', width: 15 },
      ];
      userGrowthSheet.addRows(filteredUserGrowth);

      // Unlocks by Day Sheet
      const unlocksSheet = workbook.addWorksheet('Unlocks by Day');
      unlocksSheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Unlocks', key: 'count', width: 15 },
      ];
      unlocksSheet.addRows(filteredUnlocks);

      // Popular Properties Sheet
      const popularSheet = workbook.addWorksheet('Popular Properties');
      popularSheet.columns = [
        { header: 'Property ID', key: 'propertyId', width: 15 },
        { header: 'Title', key: 'title', width: 30 },
        { header: 'Location', key: 'location', width: 25 },
        { header: 'Unlock Count', key: 'unlockCount', width: 15 },
      ];
      popularSheet.addRows(analytics.popularProperties);

      // Style headers
      [summarySheet, revenueSheet, userGrowthSheet, unlocksSheet, popularSheet].forEach(sheet => {
        sheet.getRow(1).font = { bold: true };
        sheet.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' },
        };
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Analytics exported successfully');
    } catch (error) {
      toast.error('Failed to export analytics');
      console.error(error);
    }
  };

  const exportPropertiesToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Properties');
      
      // Filter properties
      let filteredProperties = properties.filter(property => {
        // Category filter
        if (exportFilters.propertyCategory && exportFilters.propertyCategory !== 'all' && property.propertyCategory !== exportFilters.propertyCategory) {
          return false;
        }
        // Status filter
        if (exportFilters.propertyStatus && exportFilters.propertyStatus !== 'all' && property.propertyStatus !== exportFilters.propertyStatus) {
          return false;
        }
        // Search term filter
        if (exportFilters.searchTerm) {
          const searchLower = exportFilters.searchTerm.toLowerCase();
          const matchesSearch = 
            property.title?.toLowerCase().includes(searchLower) ||
            property.location?.toLowerCase().includes(searchLower) ||
            property.address?.toLowerCase().includes(searchLower) ||
            property.ownerName?.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }
        // Date range filter
        if (exportFilters.dateFrom || exportFilters.dateTo) {
          const propertyDate = property.createdAt ? new Date(property.createdAt) : null;
          if (propertyDate) {
            const fromDate = exportFilters.dateFrom ? new Date(exportFilters.dateFrom) : null;
            const toDate = exportFilters.dateTo ? new Date(exportFilters.dateTo) : null;
            if (fromDate && propertyDate < fromDate) return false;
            if (toDate && propertyDate > toDate) return false;
          }
        }
        return true;
      });

      worksheet.columns = [
        // Basic Information
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Title', key: 'title', width: 30 },
        { header: 'Property Category', key: 'propertyCategory', width: 18 },
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Property Status', key: 'propertyStatus', width: 18 },
        { header: 'Location', key: 'location', width: 25 },
        { header: 'Address', key: 'address', width: 35 },
        { header: 'Property ID', key: 'propertyId', width: 20 },
        
        // Areas & Dimensions
        { header: 'Land Area', key: 'landArea', width: 15 },
        { header: 'Built-Up Area', key: 'builtUpArea', width: 15 },
        { header: 'Area', key: 'area', width: 15 },
        { header: 'Plot Dimensions', key: 'plotDimensions', width: 20 },
        
        // Zoning & Development
        { header: 'Zoning', key: 'zoning', width: 15 },
        { header: 'Land Use', key: 'landUse', width: 15 },
        { header: 'Development Type', key: 'developmentType', width: 20 },
        { header: 'Layout Name', key: 'layoutName', width: 25 },
        { header: 'Number of Units', key: 'numberOfUnits', width: 15 },
        { header: 'Unit Sizes', key: 'unitSizes', width: 20 },
        { header: 'Floor Plan', key: 'floorPlan', width: 20 },
        
        // Infrastructure
        { header: 'Road Access', key: 'roadAccess', width: 15 },
        { header: 'Road Width', key: 'roadWidth', width: 15 },
        { header: 'Power Availability', key: 'powerAvailability', width: 20 },
        { header: 'Water Availability', key: 'waterAvailability', width: 20 },
        { header: 'Drainage System', key: 'drainageSystem', width: 20 },
        { header: 'Sewage System', key: 'sewageSystem', width: 20 },
        { header: 'Parking Spaces', key: 'parkingSpaces', width: 15 },
        { header: 'Vehicle Access', key: 'vehicleAccess', width: 15 },
        
        // Amenities & Construction
        { header: 'Amenities', key: 'amenities', width: 30 },
        { header: 'Infrastructure', key: 'infrastructure', width: 30 },
        { header: 'Furnishing Status', key: 'furnishingStatus', width: 18 },
        { header: 'Construction Status', key: 'constructionStatus', width: 20 },
        
        // Legal & Approvals
        { header: 'Government Approvals', key: 'governmentApprovals', width: 25 },
        { header: 'RERA Status', key: 'reraStatus', width: 15 },
        { header: 'DTCP Status', key: 'dtcpStatus', width: 15 },
        { header: 'CMDA Status', key: 'cmdaStatus', width: 15 },
        { header: 'Environmental Clearance', key: 'environmentalClearance', width: 25 },
        { header: 'Legal Verification', key: 'legalVerificationStatus', width: 20 },
        
        // Ownership
        { header: 'Ownership Type', key: 'ownershipType', width: 18 },
        { header: 'Title Deed Details', key: 'titleDeedDetails', width: 30 },
        { header: 'Tax Status', key: 'taxStatus', width: 15 },
        { header: 'Encumbrance Status', key: 'encumbranceStatus', width: 20 },
        
        // Financial
        { header: 'Price', key: 'price', width: 15 },
        { header: 'Price Per Sqft', key: 'pricePerSqft', width: 15 },
        { header: 'Price Per Acre', key: 'pricePerAcre', width: 15 },
        { header: 'Market Value Trend', key: 'marketValueTrend', width: 20 },
        { header: 'Investment Potential', key: 'investmentPotential', width: 25 },
        { header: 'Rental Income', key: 'rentalIncome', width: 15 },
        { header: 'Lease Terms', key: 'leaseTerms', width: 20 },
        { header: 'Payment Terms', key: 'paymentTerms', width: 20 },
        
        // Description & Location
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Connectivity', key: 'connectivity', width: 30 },
        { header: 'Nearby Facilities', key: 'nearbyFacilities', width: 30 },
        { header: 'Suitability', key: 'suitability', width: 25 },
        
        // Development
        { header: 'Project Phase', key: 'projectPhase', width: 18 },
        { header: 'Development Stage', key: 'developmentStage', width: 20 },
        { header: 'Builder Name', key: 'builderName', width: 25 },
        { header: 'Developer Name', key: 'developerName', width: 25 },
        { header: 'Contractor Name', key: 'contractorName', width: 25 },
        { header: 'Maintenance Cost', key: 'maintenanceCost', width: 18 },
        { header: 'Operating Cost', key: 'operatingCost', width: 18 },
        
        // Risk
        { header: 'Risk Assessment', key: 'riskAssessment', width: 25 },
        { header: 'Compliance Check', key: 'complianceCheck', width: 25 },
        
        // Media
        { header: 'Image URL', key: 'imageUrl', width: 40 },
        
        // Owner (Token Protected)
        { header: 'Owner Name', key: 'ownerName', width: 25 },
        { header: 'Owner Email', key: 'ownerEmail', width: 30 },
        { header: 'Owner Phone', key: 'ownerPhone', width: 15 },
        { header: 'Owner Address', key: 'ownerAddress', width: 35 },
        { header: 'Identity Verification', key: 'identityVerification', width: 25 },
        
        // Meta
        { header: 'Token Cost', key: 'tokenCost', width: 12 },
        { header: 'Views', key: 'viewsCount', width: 10 },
        { header: 'Active', key: 'isActive', width: 10 },
        { header: 'Created At', key: 'createdAt', width: 20 },
      ];

      filteredProperties.forEach(property => {
        worksheet.addRow({
          // Basic Information
          id: property.id,
          title: property.title || '',
          propertyCategory: property.propertyCategory || '',
          type: property.type || '',
          propertyStatus: property.propertyStatus || '',
          location: property.location || '',
          address: property.address || '',
          propertyId: property.propertyId || '',
          
          // Areas & Dimensions
          landArea: property.landArea || '',
          builtUpArea: property.builtUpArea || '',
          area: property.area || '',
          plotDimensions: property.plotDimensions || '',
          
          // Zoning & Development
          zoning: property.zoning || '',
          landUse: property.landUse || '',
          developmentType: property.developmentType || '',
          layoutName: property.layoutName || '',
          numberOfUnits: property.numberOfUnits || '',
          unitSizes: property.unitSizes || '',
          floorPlan: property.floorPlan || '',
          
          // Infrastructure
          roadAccess: property.roadAccess || '',
          roadWidth: property.roadWidth || '',
          powerAvailability: property.powerAvailability || '',
          waterAvailability: property.waterAvailability || '',
          drainageSystem: property.drainageSystem || '',
          sewageSystem: property.sewageSystem || '',
          parkingSpaces: property.parkingSpaces || '',
          vehicleAccess: property.vehicleAccess || '',
          
          // Amenities & Construction
          amenities: property.amenities || '',
          infrastructure: property.infrastructure || '',
          furnishingStatus: property.furnishingStatus || '',
          constructionStatus: property.constructionStatus || '',
          
          // Legal & Approvals
          governmentApprovals: property.governmentApprovals || '',
          reraStatus: property.reraStatus || '',
          dtcpStatus: property.dtcpStatus || '',
          cmdaStatus: property.cmdaStatus || '',
          environmentalClearance: property.environmentalClearance || '',
          legalVerificationStatus: property.legalVerificationStatus || '',
          
          // Ownership
          ownershipType: property.ownershipType || '',
          titleDeedDetails: property.titleDeedDetails || '',
          taxStatus: property.taxStatus || '',
          encumbranceStatus: property.encumbranceStatus || '',
          
          // Financial
          price: property.price || '',
          pricePerSqft: property.pricePerSqft || '',
          pricePerAcre: property.pricePerAcre || '',
          marketValueTrend: property.marketValueTrend || '',
          investmentPotential: property.investmentPotential || '',
          rentalIncome: property.rentalIncome || '',
          leaseTerms: property.leaseTerms || '',
          paymentTerms: property.paymentTerms || '',
          
          // Description & Location
          description: property.description || '',
          connectivity: property.connectivity || '',
          nearbyFacilities: property.nearbyFacilities || '',
          suitability: property.suitability || '',
          
          // Development
          projectPhase: property.projectPhase || '',
          developmentStage: property.developmentStage || '',
          builderName: property.builderName || '',
          developerName: property.developerName || '',
          contractorName: property.contractorName || '',
          maintenanceCost: property.maintenanceCost || '',
          operatingCost: property.operatingCost || '',
          
          // Risk
          riskAssessment: property.riskAssessment || '',
          complianceCheck: property.complianceCheck || '',
          
          // Media
          imageUrl: property.imageUrl || '',
          
          // Owner (Token Protected)
          ownerName: property.ownerName || '',
          ownerEmail: property.ownerEmail || '',
          ownerPhone: property.ownerPhone || '',
          ownerAddress: property.ownerAddress || '',
          identityVerification: property.identityVerification || '',
          
          // Meta
          tokenCost: property.tokenCost || '',
          viewsCount: property.viewsCount || 0,
          isActive: property.isActive ? 'Yes' : 'No',
          createdAt: property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A',
        });
      });

      // Style header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
      };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `properties_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Properties exported successfully');
    } catch (error) {
      toast.error('Failed to export properties');
      console.error(error);
    }
  };

  const exportUsersToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Users');
      
      // Filter users
      let filteredUsers = users.filter(user => {
        // Role filter
        if (exportFilters.userRole && exportFilters.userRole !== 'all' && user.role !== exportFilters.userRole) {
          return false;
        }
        // Search term filter
        if (exportFilters.searchTerm) {
          const searchLower = exportFilters.searchTerm.toLowerCase();
          const matchesSearch = 
            user.name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.phone?.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }
        // Date range filter (registration date)
        if (exportFilters.dateFrom || exportFilters.dateTo) {
          const userDate = user.createdAt ? new Date(user.createdAt) : null;
          if (userDate) {
            const fromDate = exportFilters.dateFrom ? new Date(exportFilters.dateFrom) : null;
            const toDate = exportFilters.dateTo ? new Date(exportFilters.dateTo) : null;
            if (fromDate && userDate < fromDate) return false;
            if (toDate && userDate > toDate) return false;
          }
        }
        return true;
      });

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Phone', key: 'phone', width: 15 },
        { header: 'Role', key: 'role', width: 12 },
        { header: 'Token Balance', key: 'tokenBalance', width: 15 },
        { header: 'Referral Code', key: 'referralCode', width: 15 },
        { header: 'Referred By', key: 'referredBy', width: 15 },
        { header: 'Created At', key: 'createdAt', width: 20 },
      ];

      filteredUsers.forEach(user => {
        worksheet.addRow({
          ...user,
          createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
        });
      });

      // Style header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
      };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Users exported successfully');
    } catch (error) {
      toast.error('Failed to export users');
      console.error(error);
    }
  };

  const exportPaymentsToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Payments');
      
      // Filter payments
      let filteredPayments = payments.filter(payment => {
        // Status filter
        if (exportFilters.paymentStatus && payment.status !== exportFilters.paymentStatus) {
          return false;
        }
        // Search term filter
        if (exportFilters.searchTerm) {
          const searchLower = exportFilters.searchTerm.toLowerCase();
          const matchesSearch = 
            payment.userName?.toLowerCase().includes(searchLower) ||
            payment.userEmail?.toLowerCase().includes(searchLower) ||
            payment.orderId?.toLowerCase().includes(searchLower) ||
            payment.paymentId?.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }
        // Date range filter
        if (exportFilters.dateFrom || exportFilters.dateTo) {
          const paymentDate = payment.createdAt ? new Date(payment.createdAt) : null;
          if (paymentDate) {
            const fromDate = exportFilters.dateFrom ? new Date(exportFilters.dateFrom) : null;
            const toDate = exportFilters.dateTo ? new Date(exportFilters.dateTo) : null;
            if (fromDate && paymentDate < fromDate) return false;
            if (toDate && paymentDate > toDate) return false;
          }
        }
        return true;
      });

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'User ID', key: 'userId', width: 10 },
        { header: 'User Name', key: 'userName', width: 25 },
        { header: 'User Email', key: 'userEmail', width: 30 },
        { header: 'Amount (₹)', key: 'amount', width: 15 },
        { header: 'Tokens', key: 'tokens', width: 12 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Order ID', key: 'orderId', width: 25 },
        { header: 'Payment ID', key: 'paymentId', width: 25 },
        { header: 'Created At', key: 'createdAt', width: 20 },
      ];

      filteredPayments.forEach(payment => {
        worksheet.addRow({
          ...payment,
          createdAt: payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A',
        });
      });

      // Style header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
      };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payments_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Payments exported successfully');
    } catch (error) {
      toast.error('Failed to export payments');
      console.error(error);
    }
  };

  const exportTokenLogsToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Token Logs');
      
      // Filter token logs
      let filteredLogs = tokenLogs.filter(log => {
        // Type filter
        if (exportFilters.tokenType && log.type !== exportFilters.tokenType) {
          return false;
        }
        // Search term filter
        if (exportFilters.searchTerm) {
          const searchLower = exportFilters.searchTerm.toLowerCase();
          const matchesSearch = 
            log.userName?.toLowerCase().includes(searchLower) ||
            log.userEmail?.toLowerCase().includes(searchLower) ||
            log.description?.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }
        // Date range filter
        if (exportFilters.dateFrom || exportFilters.dateTo) {
          const logDate = log.createdAt ? new Date(log.createdAt) : null;
          if (logDate) {
            const fromDate = exportFilters.dateFrom ? new Date(exportFilters.dateFrom) : null;
            const toDate = exportFilters.dateTo ? new Date(exportFilters.dateTo) : null;
            if (fromDate && logDate < fromDate) return false;
            if (toDate && logDate > toDate) return false;
          }
        }
        return true;
      });

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'User ID', key: 'userId', width: 10 },
        { header: 'User Name', key: 'userName', width: 25 },
        { header: 'User Email', key: 'userEmail', width: 30 },
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Amount', key: 'amount', width: 12 },
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Created At', key: 'createdAt', width: 20 },
      ];

      filteredLogs.forEach(log => {
        worksheet.addRow({
          ...log,
          createdAt: log.createdAt ? new Date(log.createdAt).toLocaleDateString() : 'N/A',
        });
      });

      // Style header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
      };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `token_logs_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Token logs exported successfully');
    } catch (error) {
      toast.error('Failed to export token logs');
      console.error(error);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Render Admin Dashboard
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage properties, users, and view analytics</p>
          </div>

          {error && (
            <Alert className="mb-6 border-destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-primary">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Analytics Overview */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{analytics.overview.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analytics.overview.conversionRate}% conversion rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.totalUsers}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Avg {analytics.overview.avgTokenBalance.toFixed(0)} tokens/user
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Properties</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.totalProperties}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analytics.overview.totalUnlocks} total unlocks
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Tokens Sold</CardTitle>
                  <Coins className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.totalTokensSold}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total tokens distributed</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Admin Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 h-auto p-2">
              <TabsTrigger value="profile" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Profile</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Analytics</TabsTrigger>
              <TabsTrigger value="properties" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Properties</TabsTrigger>
              <TabsTrigger value="users" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Users</TabsTrigger>
              <TabsTrigger value="payments" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Payments</TabsTrigger>
              <TabsTrigger value="logs" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Token Logs</TabsTrigger>
              <TabsTrigger value="config" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Configure</TabsTrigger>
            </TabsList>

            {/* Admin Profile Tab */}
            <TabsContent value="profile">
              <div className="space-y-6">
                {/* Admin Information Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Information</CardTitle>
                    <CardDescription>Your administrator account details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                        <p className="text-base font-medium mt-1">{user?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                        <p className="text-base font-medium mt-1">{user?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                        <Badge className="mt-1">Administrator</Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Admin Since</Label>
                        <p className="text-base font-medium mt-1">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Platform Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Overview</CardTitle>
                    <CardDescription>Key metrics at a glance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-primary/5 rounded-lg">
                          <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                          <div className="text-2xl font-bold">₹{analytics.overview.totalRevenue.toLocaleString()}</div>
                          <p className="text-xs text-muted-foreground mt-1">Total Revenue</p>
                        </div>
                        <div className="text-center p-4 bg-primary/5 rounded-lg">
                          <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                          <div className="text-2xl font-bold">{analytics.overview.totalUsers}</div>
                          <p className="text-xs text-muted-foreground mt-1">Total Users</p>
                        </div>
                        <div className="text-center p-4 bg-primary/5 rounded-lg">
                          <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
                          <div className="text-2xl font-bold">{analytics.overview.totalProperties}</div>
                          <p className="text-xs text-muted-foreground mt-1">Properties</p>
                        </div>
                        <div className="text-center p-4 bg-primary/5 rounded-lg">
                          <Coins className="h-8 w-8 text-primary mx-auto mb-2" />
                          <div className="text-2xl font-bold">{analytics.overview.totalTokensSold}</div>
                          <p className="text-xs text-muted-foreground mt-1">Tokens Sold</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Admin Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => {
                          const tabs = document.querySelector('[role="tablist"]');
                          const analyticsTab = tabs?.querySelector('[value="analytics"]') as HTMLElement;
                          analyticsTab?.click();
                        }}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => window.location.href = '/add-property'}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Property
                      </Button>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => {
                          const tabs = document.querySelector('[role="tablist"]');
                          const usersTab = tabs?.querySelector('[value="users"]') as HTMLElement;
                          usersTab?.click();
                        }}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Manage Users
                      </Button>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => {
                          const tabs = document.querySelector('[role="tablist"]');
                          const paymentsTab = tabs?.querySelector('[value="payments"]') as HTMLElement;
                          paymentsTab?.click();
                        }}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        View Payments
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Download Project Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Management</CardTitle>
                    <CardDescription>Download complete project source code</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      variant="default"
                      onClick={downloadProject}
                      disabled={isDownloadingProject}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isDownloadingProject ? 'Preparing Download...' : 'Download Project'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3">
                      Downloads the entire project as a ZIP file including frontend, backend, and configuration files. 
                      Excludes node_modules, build folders, and secret files.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Analytics Overview</h2>
                <Button onClick={exportAnalyticsToExcel} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Excel
                </Button>
              </div>
              
              {/* Analytics Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Export Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="analytics-date-from">From Date</Label>
                      <Input
                        id="analytics-date-from"
                        type="date"
                        value={exportFilters.dateFrom}
                        onChange={(e) => setExportFilters({ ...exportFilters, dateFrom: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="analytics-date-to">To Date</Label>
                      <Input
                        id="analytics-date-to"
                        type="date"
                        value={exportFilters.dateTo}
                        onChange={(e) => setExportFilters({ ...exportFilters, dateTo: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setExportFilters({ ...exportFilters, dateFrom: '', dateTo: '' })}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
              {analytics && (
                <>
                  {/* Revenue Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Trend (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.charts.revenueByDay}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" name="Revenue (₹)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* User Growth & Unlocks */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={analytics.charts.userGrowth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#06b6d4" name="New Users" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Property Unlocks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={analytics.charts.unlocksByDay}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#10b981" name="Unlocks" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Popular Properties */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Most Popular Properties</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Property</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">Unlocks</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {analytics.popularProperties.map((prop) => (
                            <TableRow key={prop.propertyId}>
                              <TableCell className="font-medium">{prop.title}</TableCell>
                              <TableCell>{prop.location}</TableCell>
                              <TableCell className="text-right">{prop.unlockCount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Properties Tab */}
            <TabsContent value="properties" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Properties Management</h2>
                <div className="flex gap-2">
                  <Button onClick={exportPropertiesToExcel} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Excel
                  </Button>
                  <Dialog open={isBulkUploadDialogOpen} onOpenChange={setIsBulkUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Bulk Upload
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Bulk Upload Properties</DialogTitle>
                        <DialogDescription>
                          Upload a CSV file with property data
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleBulkUpload} className="space-y-4">
                        <div>
                          <Label htmlFor="csv-file">CSV or Excel File</Label>
                          <Input
                            id="csv-file"
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                          />
                          <p className="text-xs text-muted-foreground mt-1">Supported formats: CSV, XLSX, XLS</p>
                        </div>
                        <Button type="button" variant="outline" onClick={downloadTemplate}>
                          <Download className="h-4 w-4 mr-2" />
                          Download Template
                        </Button>
                        {uploadProgress && <p className="text-sm text-muted-foreground">{uploadProgress}</p>}
                        <Button type="submit" disabled={!uploadFile}>
                          Upload
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button onClick={() => window.location.href = '/add-property'}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Button>
                </div>
              </div>

              {/* Properties Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Export Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="prop-category">Category</Label>
                      <Select value={exportFilters.propertyCategory} onValueChange={(value) => setExportFilters({ ...exportFilters, propertyCategory: value })}>
                        <SelectTrigger id="prop-category">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="Residential">Residential</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Agricultural">Agricultural</SelectItem>
                          <SelectItem value="Industrial">Industrial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="prop-status">Status</Label>
                      <Select value={exportFilters.propertyStatus} onValueChange={(value) => setExportFilters({ ...exportFilters, propertyStatus: value })}>
                        <SelectTrigger id="prop-status">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Sold">Sold</SelectItem>
                          <SelectItem value="Under Contract">Under Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="prop-date-from">From Date</Label>
                      <Input
                        id="prop-date-from"
                        type="date"
                        value={exportFilters.dateFrom}
                        onChange={(e) => setExportFilters({ ...exportFilters, dateFrom: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="prop-date-to">To Date</Label>
                      <Input
                        id="prop-date-to"
                        type="date"
                        value={exportFilters.dateTo}
                        onChange={(e) => setExportFilters({ ...exportFilters, dateTo: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-4">
                      <Label htmlFor="prop-search">Search</Label>
                      <Input
                        id="prop-search"
                        type="text"
                        placeholder="Search by title, location, owner..."
                        value={exportFilters.searchTerm}
                        onChange={(e) => setExportFilters({ ...exportFilters, searchTerm: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setExportFilters({ ...exportFilters, propertyCategory: 'all', propertyStatus: 'all', dateFrom: '', dateTo: '', searchTerm: '' })}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProperties.map((property) => (
                        <TableRow key={property.id}>
                          <TableCell className="font-medium">{property.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{property.type}</Badge>
                          </TableCell>
                          <TableCell>{property.location}</TableCell>
                          <TableCell>₹{typeof property.price === 'string' ? property.price : property.price.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={property.isActive ? 'default' : 'secondary'}>
                              {property.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => window.location.href = `/add-property?id=${property.id}`}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteProperty(property.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              {/* Users Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Export Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="user-role">Role</Label>
                      <Select value={exportFilters.userRole} onValueChange={(value) => setExportFilters({ ...exportFilters, userRole: value })}>
                        <SelectTrigger id="user-role">
                          <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="user-date-from">From Date</Label>
                      <Input
                        id="user-date-from"
                        type="date"
                        value={exportFilters.dateFrom}
                        onChange={(e) => setExportFilters({ ...exportFilters, dateFrom: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-date-to">To Date</Label>
                      <Input
                        id="user-date-to"
                        type="date"
                        value={exportFilters.dateTo}
                        onChange={(e) => setExportFilters({ ...exportFilters, dateTo: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Label htmlFor="user-search">Search</Label>
                      <Input
                        id="user-search"
                        type="text"
                        placeholder="Search by name, email, phone..."
                        value={exportFilters.searchTerm}
                        onChange={(e) => setExportFilters({ ...exportFilters, searchTerm: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setExportFilters({ ...exportFilters, userRole: 'all', dateFrom: '', dateTo: '', searchTerm: '' })}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Users Management</CardTitle>
                    <Button onClick={exportUsersToExcel} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Excel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Token Balance</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Coins className="h-4 w-4 text-primary" />
                              {user.tokenBalance}
                            </div>
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline" onClick={() => openEditUser(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Payment Transactions</CardTitle>
                    <Button onClick={exportPaymentsToExcel} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Excel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Filter UI */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <Label htmlFor="payment-status-filter" className="text-sm font-medium mb-2 block">Payment Status</Label>
                      <Select
                        value={exportFilters.paymentStatus}
                        onValueChange={(value) => setExportFilters({ ...exportFilters, paymentStatus: value })}
                      >
                        <SelectTrigger id="payment-status-filter">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="payment-search" className="text-sm font-medium mb-2 block">Search</Label>
                      <Input
                        id="payment-search"
                        placeholder="User name, email..."
                        value={exportFilters.searchTerm}
                        onChange={(e) => setExportFilters({ ...exportFilters, searchTerm: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="payment-date-from" className="text-sm font-medium mb-2 block">From Date</Label>
                      <Input
                        id="payment-date-from"
                        type="date"
                        value={exportFilters.dateFrom}
                        onChange={(e) => setExportFilters({ ...exportFilters, dateFrom: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="payment-date-to" className="text-sm font-medium mb-2 block">To Date</Label>
                      <Input
                        id="payment-date-to"
                        type="date"
                        value={exportFilters.dateTo}
                        onChange={(e) => setExportFilters({ ...exportFilters, dateTo: e.target.value })}
                      />
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Tokens</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{payment.userName}</div>
                              <div className="text-sm text-muted-foreground">{payment.userEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>₹{payment.amount}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Coins className="h-4 w-4 text-primary" />
                              {payment.tokensGranted}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Token Logs Tab */}
            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Token Transaction Logs</CardTitle>
                    <Button onClick={exportTokenLogsToExcel} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Excel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Filter UI */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <Label htmlFor="token-type-filter" className="text-sm font-medium mb-2 block">Action Type</Label>
                      <Select
                        value={exportFilters.tokenType}
                        onValueChange={(value) => setExportFilters({ ...exportFilters, tokenType: value })}
                      >
                        <SelectTrigger id="token-type-filter">
                          <SelectValue placeholder="All Actions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Actions</SelectItem>
                          <SelectItem value="unlock">Unlock</SelectItem>
                          <SelectItem value="purchase">Purchase</SelectItem>
                          <SelectItem value="referral_bonus">Referral Bonus</SelectItem>
                          <SelectItem value="refund">Refund</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="token-search" className="text-sm font-medium mb-2 block">Search</Label>
                      <Input
                        id="token-search"
                        placeholder="User name, email..."
                        value={exportFilters.searchTerm}
                        onChange={(e) => setExportFilters({ ...exportFilters, searchTerm: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="token-date-from" className="text-sm font-medium mb-2 block">From Date</Label>
                      <Input
                        id="token-date-from"
                        type="date"
                        value={exportFilters.dateFrom}
                        onChange={(e) => setExportFilters({ ...exportFilters, dateFrom: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="token-date-to" className="text-sm font-medium mb-2 block">To Date</Label>
                      <Input
                        id="token-date-to"
                        type="date"
                        value={exportFilters.dateTo}
                        onChange={(e) => setExportFilters({ ...exportFilters, dateTo: e.target.value })}
                      />
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Tokens</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTokenLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.userName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.action}</Badge>
                          </TableCell>
                          <TableCell>{log.propertyTitle || '-'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Coins className="h-4 w-4 text-primary" />
                              {log.tokensUsed}
                            </div>
                          </TableCell>
                          <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => {
                                  setSelectedTokenLog(log);
                                  setIsTokenLogDetailsOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => {
                                  setDeletingTokenLogId(log.id);
                                  setIsDeleteTokenLogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configuration Tab */}
            <TabsContent value="config">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    <CardTitle>Razorpay Configuration</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">Configure Razorpay payment gateway for production</p>
                </CardHeader>
                <CardContent>
                  <form 
                    className="space-y-6"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setConfigLoading(true);
                      try {
                        const token = localStorage.getItem('token');
                        const response = await fetch('/api/admin/config', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify(configData),
                        });
                        
                        if (response.ok) {
                          toast.success('Configuration saved successfully');
                        } else {
                          const error = await response.json();
                          toast.error(error.error || 'Failed to save configuration');
                        }
                      } catch (error) {
                        toast.error('Failed to save configuration');
                        console.error(error);
                      } finally {
                        setConfigLoading(false);
                      }
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <h3 className="text-lg font-semibold">Razorpay API Credentials</h3>
                      </div>
                      
                      <Alert>
                        <AlertDescription>
                          Get your Razorpay API credentials from the{' '}
                          <a 
                            href="https://dashboard.razorpay.com/app/keys" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary underline"
                          >
                            Razorpay Dashboard
                          </a>
                          . Use live keys for production.
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="razorpay-key-id">Razorpay Key ID *</Label>
                          <Input
                            id="razorpay-key-id"
                            type="text"
                            placeholder="rzp_live_xxxxxxxxxxxxx"
                            value={configData.razorpayKeyId}
                            onChange={(e) => setConfigData({ ...configData, razorpayKeyId: e.target.value })}
                            required
                          />
                          <p className="text-xs text-muted-foreground mt-1">Your Razorpay API Key ID (starts with rzp_live_ or rzp_test_)</p>
                        </div>
                        <div>
                          <Label htmlFor="razorpay-key-secret">Razorpay Key Secret *</Label>
                          <Input
                            id="razorpay-key-secret"
                            type="password"
                            placeholder="••••••••••••••••••••"
                            value={configData.razorpayKeySecret}
                            onChange={(e) => setConfigData({ ...configData, razorpayKeySecret: e.target.value })}
                            required
                          />
                          <p className="text-xs text-muted-foreground mt-1">Your Razorpay API Key Secret (keep this confidential)</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem('token');
                            const response = await fetch('/api/admin/config', {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            });
                            
                            if (response.ok) {
                              const data = await response.json();
                              setConfigData(data);
                              toast.success('Configuration loaded');
                            }
                          } catch (error) {
                            toast.error('Failed to load configuration');
                          }
                        }}
                      >
                        Load Saved Configuration
                      </Button>
                      <Button
                        type="submit"
                        disabled={configLoading}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {configLoading ? 'Saving...' : 'Save Configuration'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Edit User Dialog */}
          <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>Update user information and settings</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="user-name">Full Name *</Label>
                    <Input
                      id="user-name"
                      value={userFormData.name}
                      onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-email">Email *</Label>
                    <Input
                      id="user-email"
                      type="email"
                      value={userFormData.email}
                      onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="user-phone">Phone Number</Label>
                    <Input
                      id="user-phone"
                      type="tel"
                      value={userFormData.phone}
                      onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-tokens">Token Balance *</Label>
                    <Input
                      id="user-tokens"
                      type="number"
                      value={userFormData.tokenBalance}
                      onChange={(e) => setUserFormData({ ...userFormData, tokenBalance: e.target.value })}
                      required
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="user-address">Address</Label>
                  <Textarea
                    id="user-address"
                    value={userFormData.address}
                    onChange={(e) => setUserFormData({ ...userFormData, address: e.target.value })}
                    placeholder="Optional"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="user-role">Role *</Label>
                  <Select value={userFormData.role} onValueChange={(value) => setUserFormData({ ...userFormData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {error && (
                  <Alert className="border-destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditUserOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Token Log Details Dialog */}
          <Dialog open={isTokenLogDetailsOpen} onOpenChange={setIsTokenLogDetailsOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Token Transaction Details</DialogTitle>
                <DialogDescription>Complete information about this token transaction</DialogDescription>
              </DialogHeader>
              {selectedTokenLog && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Transaction ID</Label>
                      <p className="text-sm font-mono">#{selectedTokenLog.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Action Type</Label>
                      <div className="mt-1">
                        <Badge variant="outline">{selectedTokenLog.action || selectedTokenLog.type || 'N/A'}</Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-2 block">User Information</Label>
                    <div className="space-y-2 bg-muted/50 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Name:</span>
                        <span className="text-sm font-medium">{selectedTokenLog.userName}</span>
                      </div>
                      {selectedTokenLog.userEmail && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Email:</span>
                          <span className="text-sm font-medium">{selectedTokenLog.userEmail}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">User ID:</span>
                        <span className="text-sm font-medium">#{selectedTokenLog.userId}</span>
                      </div>
                    </div>
                  </div>

                  {(selectedTokenLog.propertyId || selectedTokenLog.propertyTitle) && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground mb-2 block">Property Information</Label>
                      <div className="space-y-2 bg-muted/50 p-3 rounded-lg">
                        {selectedTokenLog.propertyTitle && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Title:</span>
                            <span className="text-sm font-medium">{selectedTokenLog.propertyTitle}</span>
                          </div>
                        )}
                        {selectedTokenLog.propertyId && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Property ID:</span>
                            <span className="text-sm font-medium">#{selectedTokenLog.propertyId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-2 block">Transaction Details</Label>
                    <div className="space-y-2 bg-muted/50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Tokens:</span>
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-primary" />
                          <span className="text-sm font-bold">{selectedTokenLog.tokensUsed || selectedTokenLog.amount || 0}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Date & Time:</span>
                        <span className="text-sm font-medium">
                          {new Date(selectedTokenLog.timestamp || selectedTokenLog.createdAt || '').toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedTokenLog.description && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground mb-2 block">Description</Label>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm">{selectedTokenLog.description}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsTokenLogDetailsOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Token Log Confirmation Dialog */}
          <AlertDialog open={isDeleteTokenLogOpen} onOpenChange={setIsDeleteTokenLogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Token Log</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this token transaction log? This action cannot be undone and will permanently remove the transaction record from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeletingTokenLogId(null)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteTokenLog}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }

  // Render User Dashboard
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>

        {showSuccessAlert && (
          <Alert className="mb-6 border-primary">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Payment successful! Your tokens have been added to your account.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 border-destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Token Balance</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.tokenBalance || 0}</div>
              <Link to="/pricing">
                <Button variant="link" className="px-0 h-auto text-xs mt-1">
                  Buy more tokens
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unlocked Properties</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unlockedProperties.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Properties accessed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{favoriteProperties.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Saved properties</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Referrals</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{referralData?.stats.totalReferrals || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {referralData?.stats.totalEarned || 0} tokens earned
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 h-auto p-2">
            <TabsTrigger value="profile" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Profile</TabsTrigger>
            <TabsTrigger value="unlocked" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Unlocked</TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Favorites</TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Transactions</TabsTrigger>
            <TabsTrigger value="referrals" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Referrals</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="space-y-6">
              {/* Personal Information Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your account details</CardDescription>
                  </div>
                  <Button onClick={openEditProfile} variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                      <p className="text-base font-medium mt-1">{user?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                      <p className="text-base font-medium mt-1">{user?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                      <p className="text-base font-medium mt-1">{user?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                      <p className="text-base font-medium mt-1">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  {user?.address && (
                    <div className="mt-6">
                      <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                      <p className="text-base font-medium mt-1">{user.address}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Statistics</CardTitle>
                  <CardDescription>Your activity summary</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <Coins className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{user?.tokenBalance || 0}</div>
                      <p className="text-xs text-muted-foreground mt-1">Token Balance</p>
                    </div>
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{unlockedProperties.length}</div>
                      <p className="text-xs text-muted-foreground mt-1">Properties Unlocked</p>
                    </div>
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{favoriteProperties.length}</div>
                      <p className="text-xs text-muted-foreground mt-1">Favorites</p>
                    </div>
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <Gift className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{referralData?.stats.totalReferrals || 0}</div>
                      <p className="text-xs text-muted-foreground mt-1">Referrals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Referral Code Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Referral Program</CardTitle>
                  <CardDescription>
                    Share your referral code and earn 50 tokens for each friend who signs up!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Your Referral Code</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={referralData?.referralCode || ''}
                          readOnly
                          className="font-mono text-lg"
                        />
                        <Button onClick={copyReferralCode} variant="outline">
                          {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Referrals</p>
                        <p className="text-2xl font-bold">{referralData?.stats.totalReferrals || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-2xl font-bold text-green-600">{referralData?.stats.completedReferrals || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tokens Earned</p>
                        <p className="text-2xl font-bold flex items-center gap-1">
                          <Coins className="h-5 w-5 text-primary" />
                          {referralData?.stats.totalEarned || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/properties" className="block">
                      <Button className="w-full" variant="outline">
                        <Building2 className="h-4 w-4 mr-2" />
                        Browse Properties
                      </Button>
                    </Link>
                    <Link to="/pricing" className="block">
                      <Button className="w-full" variant="outline">
                        <Coins className="h-4 w-4 mr-2" />
                        Buy Tokens
                      </Button>
                    </Link>
                    <Button className="w-full" variant="outline" onClick={copyReferralCode}>
                      <Gift className="h-4 w-4 mr-2" />
                      Share Referral Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Unlocked Properties Tab */}
          <TabsContent value="unlocked">
            <Card>
              <CardHeader>
                <CardTitle>Unlocked Properties</CardTitle>
                <CardDescription>Properties you have access to</CardDescription>
              </CardHeader>
              <CardContent>
                {unlockedProperties.length === 0 ? (
                  <div className="text-center py-8">
                    <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">You haven't unlocked any properties yet</p>
                    <Link to="/properties">
                      <Button>Browse Properties</Button>
                    </Link>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Unlocked On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unlockedProperties.map((property) => (
                        <TableRow key={property.id}>
                          <TableCell className="font-medium">{property.propertyTitle}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{property.propertyType}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {property.propertyLocation}
                            </div>
                          </TableCell>
                          <TableCell>{new Date(property.unlockedAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Link to={`/properties/${property.propertyId}`}>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Properties</CardTitle>
                <CardDescription>Properties you've saved for later</CardDescription>
              </CardHeader>
              <CardContent>
                {favoriteProperties.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No favorites yet</p>
                    <Link to="/properties">
                      <Button>Browse Properties</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteProperties.map((fav) => (
                      <Card key={fav.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{fav.property.title}</CardTitle>
                              <CardDescription>{fav.property.location}</CardDescription>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleFavorite(fav.propertyId)}
                            >
                              <Heart className="h-4 w-4 fill-current text-red-500" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Price:</span>
                              <span className="font-semibold">₹{parseFloat(fav.property.price).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Area:</span>
                              <span>{fav.property.area} sq ft</span>
                            </div>
                            <Link to={`/properties/${fav.propertyId}`}>
                              <Button className="w-full mt-4" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Token Transactions</CardTitle>
                <CardDescription>Your token purchase and usage history</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No transactions yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <Badge
                              variant={transaction.type === 'purchase' ? 'default' : 'secondary'}
                            >
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Coins className="h-4 w-4 text-primary" />
                              <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                                {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals">
            <div className="space-y-6">
              {/* Referral Code Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Referral Code</CardTitle>
                  <CardDescription>
                    Share your code and earn 50 tokens for each friend who signs up!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Input
                      value={referralData?.referralCode || ''}
                      readOnly
                      className="font-mono text-lg"
                    />
                    <Button onClick={copyReferralCode} variant="outline">
                      {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Referral Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{referralData?.stats.totalReferrals || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {referralData?.stats.completedReferrals || 0}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Tokens Earned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      <Coins className="h-6 w-6 text-primary" />
                      {referralData?.stats.totalEarned || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Referral List */}
              <Card>
                <CardHeader>
                  <CardTitle>Referral History</CardTitle>
                </CardHeader>
                <CardContent>
                  {!referralData || referralData.referrals.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No referrals yet</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Bonus</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referralData.referrals.map((referral) => (
                          <TableRow key={referral.id}>
                            <TableCell className="font-medium">{referral.refereeName}</TableCell>
                            <TableCell>
                              <Badge
                                variant={referral.status === 'completed' ? 'default' : 'secondary'}
                              >
                                {referral.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Coins className="h-4 w-4 text-primary" />
                                {referral.referrerBonus}
                              </div>
                            </TableCell>
                            <TableCell>{new Date(referral.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>Update your personal information</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={profileFormData.name}
                  onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={profileFormData.phone}
                  onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                  placeholder="Optional"
                />
              </div>
              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Textarea
                  id="edit-address"
                  value={profileFormData.address}
                  onChange={(e) => setProfileFormData({ ...profileFormData, address: e.target.value })}
                  placeholder="Optional"
                  rows={3}
                />
              </div>
              {error && (
                <Alert className="border-destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
