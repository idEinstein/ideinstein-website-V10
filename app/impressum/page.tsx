import { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'

export const metadata: Metadata = {
  title: 'Impressum | IdEinstein',
  description: 'Legal disclosure and company information for IdEinstein - Engineering services in Germany',
  robots: 'noindex, nofollow'
}

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="Impressum"
        subtitle="Legal Disclosure and Company Information as required by German law"
        centered={true}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-4xl mx-auto prose prose-sm sm:prose-base lg:prose-lg">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">Company Information</h2>
              <div className="text-text/80 space-y-2 mb-4">
                <p><strong>Company Name:</strong> IdEinstein</p>
                <p><strong>Legal Form:</strong> Individual Business / Einzelunternehmen</p>
                <p><strong>Owner:</strong> Saravanakumar</p>
                <p><strong>Business Address:</strong> Taunusstein, Germany</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">Contact Information</h2>
              <div className="text-text/80 space-y-2 mb-4">
                <p><strong>Email:</strong> <a href="mailto:info@ideinstein.com" className="text-primary hover:underline">info@ideinstein.com</a></p>
                <p><strong>Phone:</strong> <a href="tel:+4915255409314" className="text-primary hover:underline">+49 15255409314</a></p>
                <p><strong>Website:</strong> <a href="https://ideinstein.com" className="text-primary hover:underline">www.ideinstein.com</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">Professional Information</h2>
              <div className="text-text/80 mb-4">
                <p className="mb-2"><strong>Business Activity:</strong> Engineering Services, Mechanical Design, CAD Modeling, Product Development, Technical Consulting, 3D Printing Services</p>
                <p className="mb-2"><strong>Professional Qualifications:</strong> Bachelor of Engineering (B.Eng.) in Mechanical Engineering, specialized in Product Development and Manufacturing</p>
                <p><strong>Regulatory Authority:</strong> Gewerbeamt Taunusstein (Registration pending completion)</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">Tax Information</h2>
              <div className="text-text/80 mb-4">
                <p className="mb-2"><strong>VAT ID:</strong> VAT identification number will be provided upon business registration completion</p>
                <p><strong>Tax Office:</strong> Finanzamt Bad Schwalbach (Responsible for Taunusstein area)</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">Disclaimer</h2>
              <div className="text-text/80 mb-4">
                <p className="mb-4"><strong>Liability for Content:</strong> The contents of our pages have been created with the utmost care. However, we cannot guarantee the contents' accuracy, completeness, or topicality. According to statutory provisions, we are furthermore responsible for our own content on these web pages.</p>
                <p className="mb-4"><strong>Liability for Links:</strong> Our offer contains links to external third parties' websites. We have no influence on the contents of those websites, therefore we cannot guarantee for those contents. Providers or administrators of linked websites are always responsible for their own contents.</p>
                <p><strong>Copyright:</strong> The content and works on these pages created by the site operators are subject to German copyright law. Duplication, processing, distribution, or any form of commercialization of such material beyond the scope of the copyright law shall require the prior written consent of its respective author or creator.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">Online Dispute Resolution</h2>
              <div className="text-text/80 mb-4">
                <p className="mb-2">The European Commission provides a platform for online dispute resolution (ODR): <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://ec.europa.eu/consumers/odr/</a></p>
                <p>We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.</p>
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
              <p className="text-sm text-text/60 mt-2">
                This Impressum complies with German law requirements (§5 TMG, §55 RStV)
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}