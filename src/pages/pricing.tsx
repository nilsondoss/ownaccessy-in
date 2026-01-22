import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Coins, Zap, TrendingUp } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

interface TokenPack {
  id: string;
  name: string;
  tokens: number;
  price: number;
  popular?: boolean;
  savings?: string;
}

const tokenPacks: TokenPack[] = [
  {
    id: 'starter',
    name: 'Starter',
    tokens: 10,
    price: 500,
  },
  {
    id: 'professional',
    name: 'Professional',
    tokens: 25,
    price: 1000,
    popular: true,
    savings: 'Best Value',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tokens: 60,
    price: 2000,
    savings: 'Maximum Savings',
  },
];

export default function PricingPage() {
  const { isAuthenticated, user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handlePurchase = async (pack: TokenPack) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(pack.id);
    setError('');

    try {
      // Create Razorpay order
      const orderData: any = await api.createPaymentOrder({
        amount: pack.price,
        tokens: pack.tokens,
      });

      // Initialize Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ownaccessy',
        description: `${pack.tokens} Tokens`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: pack.price,
              tokens: pack.tokens,
            });

            // Refresh user data to get updated token balance
            await refreshUser();

            // Redirect to dashboard with success message
            navigate('/dashboard?payment=success');
          } catch (error: any) {
            setError(error.message || 'Payment verification failed');
            setLoading(null);
          }
        },
        prefill: {
          email: user?.email,
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: function() {
            setLoading(null);
          }
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      setError(error.message || 'Failed to initiate payment');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-muted/30 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Coins className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Token Pricing</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Choose Your Token Pack</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Purchase tokens to unlock property owner details. Pay once, access forever.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {tokenPacks.map((pack) => (
              <Card key={pack.id} className={pack.popular ? 'border-primary shadow-lg relative' : ''}>
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="px-4 py-1">
                      <Zap className="h-3 w-3 mr-1" />
                      POPULAR
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl mb-2">{pack.name}</CardTitle>
                  {pack.savings && (
                    <Badge variant="outline" className="mx-auto mb-4">
                      {pack.savings}
                    </Badge>
                  )}
                  <div className="mt-4">
                    <span className="text-4xl font-bold">₹{pack.price.toLocaleString()}</span>
                  </div>
                  <CardDescription className="mt-2 flex items-center justify-center gap-2">
                    <Coins className="h-5 w-5 text-primary" />
                    <span className="text-xl font-semibold text-foreground">{pack.tokens} Tokens</span>
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mt-2">
                    ₹{Math.round(pack.price / pack.tokens)} per token
                  </p>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Unlock {pack.tokens} properties</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Lifetime access to unlocked data</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>PDF & Excel downloads</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Verified owner details</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Secure payment processing</span>
                    </li>
                  </ul>
                  
                  <Button 
                    onClick={() => handlePurchase(pack)} 
                    disabled={loading === pack.id}
                    className="w-full"
                    variant={pack.popular ? 'default' : 'outline'}
                  >
                    {loading === pack.id ? 'Processing...' : 'Purchase Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features */}
          <div className="bg-muted/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-8">What You Get With Every Token</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Verified Data</h3>
                <p className="text-sm text-muted-foreground">
                  All property and owner information is verified and regularly updated
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">No Expiry</h3>
                <p className="text-sm text-muted-foreground">
                  Tokens never expire. Use them whenever you need property information
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-3">Transparent Pricing</h3>
                <p className="text-sm text-muted-foreground">
                  1 token = 1 property unlock. No hidden fees or recurring charges
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">How do tokens work?</h3>
              <p className="text-muted-foreground">
                Each token allows you to unlock one property's owner details. Once unlocked, you have lifetime access to that property's information.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Do tokens expire?</h3>
              <p className="text-muted-foreground">
                No, tokens never expire. You can use them whenever you need to unlock property information.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Can I download the data multiple times?</h3>
              <p className="text-muted-foreground">
                Yes! Once you unlock a property, you can download the owner details in PDF or Excel format as many times as you want.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major payment methods through Razorpay including credit/debit cards, UPI, net banking, and wallets.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
