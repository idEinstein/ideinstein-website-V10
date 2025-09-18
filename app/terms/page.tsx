import { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'

export const metadata: Metadata = {
  title: 'Terms and Conditions (AGB) | IdEinstein',
  description: 'General Terms and Conditions for engineering services provided by IdEinstein',
  robots: 'noindex'
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="Terms and Conditions"
        subtitle="General Terms and Conditions (AGB) for IdEinstein Engineering Services"
        centered={true}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-4xl mx-auto prose prose-sm sm:prose-base lg:prose-lg">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">1. Scope of Application</h2>
              <p className="text-text/80 mb-4">
                These General Terms and Conditions (AGB) apply to all engineering services provided by IdEinstein, 
                including but not limited to CAD modeling, machine design, FEA/CFD analysis, technical documentation, 
                and 3D printing services.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">2. Services</h2>
              <p className="text-text/80 mb-4">
                IdEinstein provides professional mechanical engineering services including:
              </p>
              <ul className="list-disc pl-6 text-text/80 space-y-2">
                <li>Research & Development consulting</li>
                <li>CAD Modeling and 3D design</li>
                <li>Machine Design and BIW Design</li>
                <li>FEA & CFD Analysis</li>
                <li>GD&T and Tolerance Analysis</li>
                <li>Technical Documentation</li>
                <li>3D Printing Services</li>
                <li>Supplier Sourcing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">3. Contract Formation</h2>
              <p className="text-text/80 mb-4">
                Contracts are formed upon written confirmation of project scope, timeline, and pricing. 
                All project specifications must be agreed upon in writing before work commences.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">4. Payment Terms</h2>
              <ul className="list-disc pl-6 text-text/80 space-y-2">
                <li>Payment terms are Net 30 days unless otherwise agreed</li>
                <li>For projects exceeding €5,000, a 50% deposit is required</li>
                <li>Late payment fees of 1.5% per month may apply</li>
                <li>All prices are exclusive of applicable taxes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">5. Intellectual Property</h2>
              <p className="text-text/80 mb-4">
                Upon full payment, clients receive full rights to deliverables created specifically for their project. 
                IdEinstein retains rights to general methodologies, processes, and know-how developed independently.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">6. Confidentiality</h2>
              <p className="text-text/80 mb-4">
                IdEinstein maintains strict confidentiality regarding all client information, designs, and proprietary data. 
                Non-disclosure agreements are available upon request.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">7. Liability</h2>
              <p className="text-text/80 mb-4">
                IdEinstein's liability is limited to the contract value. We maintain professional indemnity insurance 
                and follow industry best practices for all engineering work.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">8. Governing Law</h2>
              <p className="text-text/80 mb-4">
                These terms are governed by German law. Place of jurisdiction is Wiesbaden, Germany.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">9. Contact Information</h2>
              <div className="text-text/80">
                <p><strong>IdEinstein</strong></p>
                <p>Taunusstein, Germany</p>
                <p>Email: info@ideinstein.com</p>
                <p>Phone: +49 15255409314</p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-6 sm:mb-8">
                <p className="text-sm font-medium text-gray-900">Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}