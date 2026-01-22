import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Last updated: January 9, 2026</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground mb-4">
                ownaccessy ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform.
              </p>
              <p className="text-muted-foreground mb-4">
                Please read this Privacy Policy carefully. By using the Platform, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
              
              <h3 className="text-lg font-semibold mb-3 mt-4">2.1 Personal Information</h3>
              <p className="text-muted-foreground mb-4">
                We collect information that you provide directly to us:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Account Information:</strong> Name, email address, password (encrypted)</li>
                <li><strong>Payment Information:</strong> Processed through Razorpay (we do not store complete card details)</li>
                <li><strong>Profile Information:</strong> Any additional information you choose to provide</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3 mt-6">2.2 Usage Information</h3>
              <p className="text-muted-foreground mb-4">
                We automatically collect certain information about your use of the Platform:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Transaction Data:</strong> Token purchases, property unlocks, download history</li>
                <li><strong>Log Data:</strong> IP address, browser type, pages visited, time spent</li>
                <li><strong>Device Information:</strong> Device type, operating system, unique device identifiers</li>
                <li><strong>Cookies:</strong> Authentication tokens and preferences</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3 mt-6">2.3 Property Information</h3>
              <p className="text-muted-foreground mb-4">
                When you unlock property information, we record:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Which properties you've unlocked</li>
                <li>When you unlocked them</li>
                <li>Downloads of property documents (PDF/Excel)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We use the collected information for:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Service Delivery:</strong> Process transactions, manage your account, provide customer support</li>
                <li><strong>Platform Improvement:</strong> Analyze usage patterns, develop new features, improve user experience</li>
                <li><strong>Communication:</strong> Send transaction confirmations, account updates, promotional offers (with consent)</li>
                <li><strong>Security:</strong> Detect and prevent fraud, unauthorized access, and other illegal activities</li>
                <li><strong>Legal Compliance:</strong> Comply with legal obligations and enforce our Terms of Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              
              <h3 className="text-lg font-semibold mb-3 mt-4">4.1 Service Providers</h3>
              <p className="text-muted-foreground mb-4">
                We share information with third-party service providers who perform services on our behalf:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Payment Processing:</strong> Razorpay (for secure payment transactions)</li>
                <li><strong>Hosting Services:</strong> Cloud infrastructure providers</li>
                <li><strong>Analytics:</strong> Usage analytics and monitoring services</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3 mt-6">4.2 Legal Requirements</h3>
              <p className="text-muted-foreground mb-4">
                We may disclose your information if required by law or in response to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Legal processes (subpoenas, court orders)</li>
                <li>Government or regulatory requests</li>
                <li>Protection of our rights, property, or safety</li>
                <li>Investigation of fraud or security issues</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3 mt-6">4.3 Business Transfers</h3>
              <p className="text-muted-foreground mb-4">
                If ownaccessy is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organizational measures to protect your information:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Encryption:</strong> Passwords are hashed using bcrypt; data in transit uses HTTPS/TLS</li>
                <li><strong>Access Controls:</strong> Role-based access restrictions for sensitive data</li>
                <li><strong>Secure Storage:</strong> Database security and regular backups</li>
                <li><strong>Payment Security:</strong> PCI-compliant payment processing through Razorpay</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Your Rights and Choices</h2>
              <p className="text-muted-foreground mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data (subject to legal obligations)</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Data Portability:</strong> Request your data in a machine-readable format</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise these rights, please contact us at privacy@ownaccessy.in
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Data Retention</h2>
              <p className="text-muted-foreground mb-4">
                We retain your information for as long as necessary to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide our services and maintain your account</li>
                <li>Comply with legal obligations (tax, accounting, audit requirements)</li>
                <li>Resolve disputes and enforce our agreements</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                When you delete your account, we will delete or anonymize your personal information within 90 days, except where retention is required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">8. Cookies and Tracking</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Maintain your login session</li>
                <li>Remember your preferences</li>
                <li>Analyze Platform usage and performance</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                You can control cookies through your browser settings. Disabling cookies may limit some Platform functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">9. Third-Party Links</h2>
              <p className="text-muted-foreground mb-4">
                Our Platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">10. Children's Privacy</h2>
              <p className="text-muted-foreground mb-4">
                ownaccessy is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">11. International Data Transfers</h2>
              <p className="text-muted-foreground mb-4">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending an email notification (for significant changes)</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Your continued use of the Platform after changes constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">13. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <p className="text-muted-foreground">
                Email: privacy@ownaccessy.in<br />
                Address: [Your Business Address]<br />
                Phone: [Your Contact Number]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">14. Consent</h2>
              <p className="text-muted-foreground mb-4">
                By using ownaccessy, you consent to the collection, use, and sharing of your information as described in this Privacy Policy.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
