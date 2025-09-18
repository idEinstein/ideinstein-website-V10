import { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | IdEinstein',
  description: 'Comprehensive privacy policy and data protection information for IdEinstein - GDPR, CCPA, and international standards compliant',
  robots: 'noindex, nofollow'
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="Privacy Policy"
        subtitle="Comprehensive Data Protection and Privacy Information - GDPR, CCPA & International Standards Compliant"
        centered={true}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-4xl mx-auto prose prose-sm sm:prose-base lg:prose-lg">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">Introduction</h2>
              <p className="text-text/80 mb-4">
                IdEinstein is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, process, and protect your information in compliance with the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and other applicable international privacy laws.
              </p>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4 sm:mb-6">
                <h3 className="text-lg font-semibold text-primary mb-2">🔒 Privacy Protection Status</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-text/80 font-semibold mb-1">✅ Security & Compliance:</p>
                    <ul className="text-text/70 space-y-1">
                      <li>• GDPR-compliant security measures</li>
                      <li>• Secure data processing & encryption</li>
                      <li>• IP address pseudonymization</li>
                      <li>• Comprehensive audit logging</li>
                      <li>• Cookie consent management</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-text/80 font-semibold mb-1">🍪 Cookie Management:</p>
                    <ul className="text-text/70 space-y-1">
                      <li>• Granular cookie control</li>
                      <li>• Analytics tracking (with consent)</li>
                      <li>• Marketing cookie controls</li>
                      <li>• Data export & deletion tools</li>
                    </ul>
                  </div>
                </div>
                <p className="text-text/80 text-sm mt-3">
                  <strong>Cookie Policy:</strong> We use essential cookies for functionality and optional cookies for analytics and marketing with your explicit consent.
                </p>
              </div>

              <p className="text-text/80 mb-4">
                <strong>Effective Date:</strong> December 28, 2024<br/>
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}<br/>
                <strong>Review Schedule:</strong> Updated quarterly and when privacy practices change
              </p>
            </section>

            {/* Data Controller */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">1. Data Controller & </h2>
              <div className="bg-blue-50 p-6 rounded-lg mb-4">
                <p className="text-text/80 mb-2"><strong>Data Controller:</strong></p>
                <p className="text-text/80">
                  <strong>IdEinstein</strong><br/>
                  Saravanakumar<br/>
                  Walter-Petri-Ring 49<br/>
                  65232 Taunusstein, Germany<br/>
                  <strong>Email:</strong> info@ideinstein.com<br/>
                  <strong>Phone:</strong> +49 15255409314<br/>
                  <strong>Business Registration:</strong> Solo Engineering Practice
                </p>
              </div>
              <p className="text-text/80">
                As a solo practice based in Germany, IdEinstein is fully compliant with German and EU data protection laws, including GDPR.
              </p>
            </section>

            {/* Data We Collect */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">2. Personal Data We Collect</h2>
              
              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">2.1 Information You Provide Directly</h3>
              <ul className="list-disc pl-6 text-text/80 space-y-2 mb-4">
                <li><strong>Contact Information:</strong> Name, email address, phone number, company name, job title</li>
                <li><strong>Project Information:</strong> Technical requirements, specifications, project descriptions, engineering challenges</li>
                <li><strong>Communication Records:</strong> Messages, consultation requests, support inquiries, meeting notes</li>
                <li><strong>Account Information:</strong> User credentials, preferences, dashboard settings (if applicable)</li>
                <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely by third parties)</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">2.2 Information Collected Automatically</h3>
              <ul className="list-disc pl-6 text-text/80 space-y-2 mb-4">
                <li><strong>Technical Data:</strong> IP address (pseudonymized), browser type, operating system, device information</li>
                <li><strong>Security Data:</strong> Basic access logs for security purposes (30-day retention)</li>
                <li><strong>Performance Data:</strong> Page load times, error logs, system performance metrics</li>
                <li><strong>Essential Cookies:</strong> Session cookies, security cookies, preference cookies ✅ <em>Currently Active</em></li>
                <li><strong>Analytics Data:</strong> Website usage patterns, page views, user behavior (collected with Google Analytics 4 when consent is provided)</li>
                <li><strong>Marketing Tracking:</strong> Campaign effectiveness and user engagement metrics (only with explicit consent)</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">2.3 Special Categories of Data</h3>
              <p className="text-text/80 mb-4">
                We do not intentionally collect special categories of personal data (sensitive data) such as health information, political opinions, or biometric data. If such data is inadvertently provided, we will delete it immediately upon discovery.
              </p>
            </section>

            {/* Legal Basis */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">3. Legal Basis for Processing (GDPR Art. 6)</h2>
              <p className="text-text/80 mb-4">We process your personal data based on the following legal grounds:</p>
              <ul className="list-disc pl-6 text-text/80 space-y-2">
                <li><strong>Contract Performance (Art. 6(1)(b)):</strong> To provide engineering services, process consultations, and fulfill project requirements</li>
                <li><strong>Legitimate Interests (Art. 6(1)(f)):</strong> To improve our services, conduct business analytics, and ensure website security</li>
                <li><strong>Consent (Art. 6(1)(a)):</strong> For marketing communications, non-essential cookies, and optional data processing</li>
                <li><strong>Legal Obligations (Art. 6(1)(c)):</strong> To comply with tax, accounting, and other legal requirements</li>
                <li><strong>Vital Interests (Art. 6(1)(d)):</strong> In rare cases where processing is necessary to protect someone's life</li>
              </ul>
            </section>

            {/* How We Use Data */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">4. How We Use Your Personal Data</h2>
              
              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">4.1 Service Delivery</h3>
              <ul className="list-disc pl-6 text-text/80 space-y-2 mb-4">
                <li>Provide engineering and design services</li>
                <li>Process consultation requests and quotations</li>
                <li>Manage project communications and deliverables</li>
                <li>Provide customer support and technical assistance</li>
                <li>Process payments and manage billing</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">4.2 Business Operations</h3>
              <ul className="list-disc pl-6 text-text/80 space-y-2 mb-4">
                <li>Improve our services and website functionality</li>
                <li>Conduct market research and analytics</li>
                <li>Ensure website security and prevent fraud</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Maintain business records and documentation</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">4.3 Marketing Communications (With Consent)</h3>
              <ul className="list-disc pl-6 text-text/80 space-y-2">
                <li>Send newsletters and service announcements</li>
                <li>Provide information about new services and capabilities</li>
                <li>Share relevant industry insights and technical content</li>
                <li>Invite to webinars, events, or educational content</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">5. Data Sharing and Third-Party Services</h2>
              
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="text-text/80 font-semibold">
                  🔒 We do not sell, rent, or trade your personal data to third parties for marketing purposes.
                </p>
              </div>

              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">5.1 Zoho Corporation (India) - GDPR Compliant</h3>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="text-text/80 font-semibold mb-2">
                  ✅ EU-India Adequacy Decision (2024) - Fully GDPR Compliant
                </p>
                <p className="text-text/80 text-sm">
                  The European Commission has recognized India as having adequate data protection laws, ensuring your data is fully protected.
                </p>
              </div>
              <p className="text-text/80 mb-2">We use Zoho services for business operations:</p>
              <ul className="list-disc pl-6 text-text/80 space-y-2 mb-4">
                <li><strong>Zoho CRM:</strong> Contact and lead management</li>
                <li><strong>Zoho Projects:</strong> Project tracking and collaboration</li>
                <li><strong>Zoho WorkDrive:</strong> Secure document and file management</li>
                <li><strong>Zoho Books:</strong> Billing and invoicing</li>
              </ul>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-text/80 mb-2"><strong>Zoho India Advantages:</strong></p>
                <ul className="list-disc pl-4 text-text/80 space-y-1 text-sm">
                  <li><strong>Server Location:</strong> Chennai Data Center, India</li>
                  <li><strong>Compliance:</strong> ISO 27001, SOC 2 Type II certified</li>
                  <li><strong>Performance:</strong> Lower latency and optimized for our operations</li>
                  <li><strong>Data Protection:</strong> EU-India Adequacy Decision ensures GDPR compliance</li>
                </ul>
              </div>
              <p className="text-text/80 mb-4">
                <strong>More Information:</strong> 
                <a href="https://www.zoho.com/privacy.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 transition-all duration-200 ml-1">Zoho Privacy Policy</a> | 
                <a href="https://commission.europa.eu/law/law-topic/data-protection_en" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 transition-all duration-200 ml-1">EU-India Adequacy Decision</a>
              </p>

              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">5.2 Other Service Providers</h3>
              <ul className="list-disc pl-6 text-text/80 space-y-2 mb-4">
                <li><strong>Website Hosting:</strong> Vercel (GDPR compliant hosting)</li>
                <li><strong>Analytics:</strong> Privacy-focused analytics tools</li>
                <li><strong>Email Services:</strong> Secure email providers for communications</li>
                <li><strong>Payment Processing:</strong> Secure payment processors (data not stored by us)</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">5.3 Legal Disclosures</h3>
              <p className="text-text/80">
                We may disclose your data when required by law, court order, or to protect our legal rights, prevent fraud, or ensure public safety.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">6. International Data Transfers</h2>
              <p className="text-text/80 mb-4">
                <strong>Primary Data Location:</strong> European Union (Germany)<br/>
                <strong>Backup Storage:</strong> EU-based cloud infrastructure with data residency guarantees
              </p>
              <p className="text-text/80 mb-4">
                When data is transferred outside the EU, we ensure adequate protection through:
              </p>
              <ul className="list-disc pl-6 text-text/80 space-y-2">
                <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                <li>Adequacy decisions for transfers to approved countries</li>
                <li>Additional safeguards and encryption for enhanced protection</li>
                <li>Regular compliance assessments of third-party providers</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">7. Your Privacy Rights</h2>
              
              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">7.1 GDPR Rights (EU Residents)</h3>
              <ul className="list-disc pl-6 text-text/80 space-y-2 mb-4">
                <li><strong>Right of Access (Art. 15):</strong> Request copies of your personal data</li>
                <li><strong>Right to Rectification (Art. 16):</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure (Art. 17):</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Right to Restrict Processing (Art. 18):</strong> Limit how we process your data</li>
                <li><strong>Right to Data Portability (Art. 20):</strong> Receive your data in a structured format</li>
                <li><strong>Right to Object (Art. 21):</strong> Object to processing for marketing or legitimate interests</li>
                <li><strong>Right to Withdraw Consent (Art. 7):</strong> Withdraw consent at any time</li>
                <li><strong>Right to Lodge a Complaint:</strong> File complaints with supervisory authorities</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">7.2 CCPA Rights (California Residents)</h3>
              <ul className="list-disc pl-6 text-text/80 space-y-2 mb-4">
                <li><strong>Right to Know:</strong> What personal information we collect and how it's used</li>
                <li><strong>Right to Delete:</strong> Request deletion of your personal information</li>
                <li><strong>Right to Opt-Out:</strong> Opt-out of the sale of personal information (we do not sell data)</li>
                <li><strong>Right to Non-Discrimination:</strong> Equal service regardless of privacy choices</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">7.3 How to Exercise Your Rights</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-text/80 mb-2"><strong>Contact Methods:</strong></p>
                <p className="text-text/80">
                  <strong>Email:</strong> info@ideinstein.com<br/>
                  <strong>Phone:</strong> +49 15255409314<br/>
                  <strong>Response Time:</strong> Within 30 days (GDPR) or 45 days (CCPA)<br/>
                  <strong>Verification:</strong> We may require identity verification for security
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">8. Data Security Measures</h2>
              <p className="text-text/80 mb-4">
                We implement comprehensive technical and organizational measures to protect your data:
              </p>
              
              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">8.1 Technical Safeguards</h3>
              <ul className="list-disc pl-6 text-text/80 space-y-2 mb-4">
                <li><strong>Encryption:</strong> All data transmission uses SSL/TLS encryption (minimum TLS 1.2)</li>
                <li><strong>Data Encryption:</strong> Personal data encrypted at rest using AES-256</li>
                <li><strong>Access Controls:</strong> Role-based access with multi-factor authentication</li>
                <li><strong>Network Security:</strong> Firewalls, intrusion detection, and monitoring</li>
                <li><strong>Regular Updates:</strong> Security patches and system updates</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">8.2 Organizational Measures</h3>
              <ul className="list-disc pl-6 text-text/80 space-y-2 mb-4">
                <li><strong>Privacy by Design:</strong> Data protection built into all processes</li>
                <li><strong>Staff Training:</strong> Regular privacy and security training</li>
                <li><strong>Data Minimization:</strong> Collect only necessary data</li>
                <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
                <li><strong>Incident Response:</strong> Procedures for data breach notification</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">8.3 Data Breach Notification</h3>
              <p className="text-text/80">
                In case of a data breach, we will notify relevant supervisory authorities within 72 hours (GDPR requirement) and affected individuals without undue delay if there is a high risk to their rights and freedoms.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">9. Data Retention</h2>
              <p className="text-text/80 mb-4">We retain personal data only as long as necessary for the purposes outlined in this policy:</p>
              
              <ul className="list-disc pl-6 text-text/80 space-y-2 mb-4">
                <li><strong>Active Projects:</strong> Duration of project plus 7 years (German commercial law requirement)</li>
                <li><strong>Marketing Data:</strong> Until consent is withdrawn or 3 years of inactivity</li>
                <li><strong>Website Analytics:</strong> 26 months maximum (Google Analytics standard)</li>
                <li><strong>Communication Records:</strong> 3 years after last contact</li>
                <li><strong>Legal Requirements:</strong> As required by applicable laws (tax records: 10 years)</li>
                <li><strong>Inactive Accounts:</strong> Automatically deleted after 3 years of inactivity</li>
              </ul>

              <p className="text-text/80">
                After retention periods expire, data is securely deleted or anonymized beyond recovery.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">10. Cookies and Tracking Technologies</h2>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4 sm:mb-6">
                <p className="text-text/80 font-semibold mb-2">🍪 Cookie Management System</p>
                <p className="text-text/80 text-sm mb-2">
                  <strong>Consent-Based System:</strong> We use a comprehensive cookie consent management system that allows you to control which cookies are used on our website.
                </p>
                <p className="text-text/80 text-sm">
                  <strong>Your Control:</strong> You can accept all, reject optional cookies, or customize your preferences through our cookie banner and settings.
                </p>
              </div>
              
              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">10.1 Types of Cookies We Use</h3>
              <ul className="list-disc pl-6 text-text/80 space-y-2 mb-4">
                <li><strong>Essential Cookies:</strong> Required for website functionality, security, and basic operations (no consent needed)</li>
                <li><strong>Analytics Cookies (Google Analytics 4):</strong> Help us understand website usage patterns and improve user experience (consent required)</li>
                <li><strong>Preference Cookies:</strong> Remember your settings, language preferences, and customization choices</li>
                <li><strong>Marketing Cookies:</strong> Used for personalized content and relevant advertising (consent required)</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">10.2 Cookie Management Options</h3>
              <p className="text-text/80 mb-4">You can control cookies through multiple methods:</p>
              <ul className="list-disc pl-6 text-text/80 space-y-2 mb-4">
                <li><strong>Cookie Consent Banner:</strong> Granular control over different cookie categories</li>
                <li><strong>Preference Center:</strong> Manage your cookie settings at any time</li>
                <li><strong>Browser Settings:</strong> Block or delete cookies directly in your browser</li>
                <li><strong>Third-party Opt-out:</strong> Google Analytics opt-out tools</li>
                <li><strong>Do Not Track:</strong> We will respect DNT browser signals</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">10.3 Cookie Consent Technology</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-text/80 mb-2"><strong>GDPR-Compliant Cookie Management:</strong></p>
                <p className="text-text/80 text-sm mb-2">
                  We use a professional cookie consent management platform that provides full GDPR and CCPA compliance with advanced features.
                </p>
                <p className="text-text/80 text-sm">
                  <strong>Features:</strong> Granular cookie control, automatic cookie detection, multi-language support, consent logging, and regular compliance updates
                </p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">11. Children's Privacy</h2>
              <p className="text-text/80 mb-4">
                Our services are not intended for children under 16 years of age (GDPR) or 13 years of age (COPPA). We do not knowingly collect personal information from children. If we become aware of such collection, we will delete the information immediately and notify parents/guardians if required by law.
              </p>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">12. Updates to This Privacy Policy</h2>
              <p className="text-text/80 mb-4">
                We may update this Privacy Policy to reflect changes in our practices, services, or legal requirements. We will:
              </p>
              <ul className="list-disc pl-6 text-text/80 space-y-2 mb-4">
                <li>Post the updated policy on our website with a new "Last Updated" date</li>
                <li>Notify you of material changes via email (if we have your email address)</li>
                <li>Provide 30 days notice for significant changes affecting your rights</li>
                <li>Maintain previous versions for reference and transparency</li>
              </ul>
            </section>

            {/* Supervisory Authority */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">13. Supervisory Authority</h2>
              <p className="text-text/80 mb-4">
                If you have concerns about our data practices that we cannot resolve, you have the right to lodge a complaint with the relevant supervisory authority:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-text/80">
                  <strong>For EU Residents:</strong><br/>
                  German Federal Commissioner for Data Protection and Freedom of Information<br/>
                  Website: <a href="https://www.bfdi.bund.de/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 transition-all duration-200">https://www.bfdi.bund.de/</a><br/>
                  Email: poststelle@bfdi.bund.de
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-text/80">
                  <strong>For California Residents:</strong><br/>
                  California Attorney General's Office<br/>
                  Website: <a href="https://oag.ca.gov/privacy/ccpa" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 transition-all duration-200">https://oag.ca.gov/privacy/ccpa</a>
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">14. </h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-text/80 mb-4">
                  <strong>For privacy-related questions, to exercise your rights, or report concerns:</strong>
                </p>
                <p className="text-text/80">
                  <strong>Privacy Officer:</strong> Saravanakumar<br/>
                  <strong>Email:</strong> info@ideinstein.com<br/>
                  <strong>Phone:</strong> +49 15255409314<br/>
                  <strong>Address:</strong> Walter-Petri-Ring 49, 65232 Taunusstein, Germany<br/>
                  <strong>Response Time:</strong> Within 30 days (GDPR) or 45 days (CCPA)
                </p>
              </div>
            </section>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-text/80 font-semibold mb-2">
                  ✅ This privacy policy is fully compliant with GDPR, CCPA, and international privacy standards.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text/70">
                  <div>
                    <p className="font-semibold mb-1">Compliance & Security:</p>
                    <ul className="space-y-1">
                      <li>• GDPR security measures implemented</li>
                      <li>• Zoho India EU-adequacy compliant</li>
                      <li>• Cookie consent management active</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">User Rights & Control:</p>
                    <ul className="space-y-1">
                      <li>• Data export & deletion available</li>
                      <li>• Granular privacy controls</li>
                      <li>• Transparent data processing</li>
                    </ul>
                  </div>
                </div>
              </div>
              <p className="text-sm text-text/60 mb-2">
                <strong>Effective Date:</strong> December 28, 2024<br/>
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}<br/>
                <strong>Compliance Status:</strong> Fully GDPR/CCPA compliant with active cookie management
              </p>
              <p className="text-xs text-text/50">
                IdEinstein - Solo Engineering Practice - Committed to protecting your privacy and data security<br/>
                🇮🇳 Zoho India Integration - EU-India Adequacy Decision Compliant
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}