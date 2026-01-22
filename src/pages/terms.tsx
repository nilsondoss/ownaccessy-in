import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Last updated: January 9, 2026</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing and using ownaccessy ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground mb-4">
                ownaccessy is a real estate information platform that operates on a token-based system. Users purchase tokens to unlock access to property owner contact information and detailed property data.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Tokens are virtual credits used to unlock property information</li>
                <li>Each property requires a specific number of tokens to unlock</li>
                <li>Once unlocked, property information remains accessible to your account</li>
                <li>Tokens are non-refundable once purchased</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground mb-4">
                To use certain features of the Platform, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain the security of your password and account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Be responsible for all activities that occur under your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Token Purchase and Usage</h2>
              <p className="text-muted-foreground mb-4">
                <strong>Purchase Terms:</strong>
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>All token purchases are final and non-refundable</li>
                <li>Tokens do not expire and remain in your account indefinitely</li>
                <li>Tokens cannot be transferred between accounts</li>
                <li>We reserve the right to modify token pricing with notice</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>Usage Terms:</strong>
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Tokens are deducted only when successfully unlocking new property information</li>
                <li>Re-accessing previously unlocked properties does not consume additional tokens</li>
                <li>Token costs per property are clearly displayed before unlocking</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Payment Processing</h2>
              <p className="text-muted-foreground mb-4">
                Payments are processed securely through Razorpay. By making a purchase, you agree to Razorpay's terms of service. We do not store your complete payment card information on our servers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Acceptable Use</h2>
              <p className="text-muted-foreground mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Use the Platform for any illegal purpose or in violation of any laws</li>
                <li>Share, resell, or redistribute property information obtained through the Platform</li>
                <li>Attempt to circumvent the token system or access restricted information</li>
                <li>Use automated systems (bots, scrapers) to access the Platform</li>
                <li>Harass, abuse, or harm property owners whose information you access</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Property Information</h2>
              <p className="text-muted-foreground mb-4">
                While we strive to provide accurate and up-to-date property information:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>We do not guarantee the accuracy, completeness, or timeliness of any information</li>
                <li>Property details may change without notice</li>
                <li>You should independently verify all information before making decisions</li>
                <li>We are not responsible for any errors or omissions in property data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">8. Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                The Platform and its original content, features, and functionality are owned by ownaccessy and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">9. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                ownaccessy shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Platform, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Loss of profits, data, or business opportunities</li>
                <li>Decisions made based on property information provided</li>
                <li>Unauthorized access to your account or data</li>
                <li>Service interruptions or technical issues</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">10. Termination</h2>
              <p className="text-muted-foreground mb-4">
                We reserve the right to terminate or suspend your account and access to the Platform immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, unused tokens will be forfeited.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">11. Changes to Terms</h2>
              <p className="text-muted-foreground mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the Platform. Your continued use of the Platform after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">12. Governing Law</h2>
              <p className="text-muted-foreground mb-4">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">13. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="text-muted-foreground">
                Email: legal@ownaccessy.in<br />
                Address: [Your Business Address]
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
