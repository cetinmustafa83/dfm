import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { settingsDb } from '@/lib/settings-db'

export default async function AGBPage() {
  const settings = await settingsDb.getLegal()
  const general = await settingsDb.getGeneral()

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">AGB</CardTitle>
          <p className="text-muted-foreground">General Terms and Conditions</p>
          <p className="text-sm text-muted-foreground">Last updated: {settings.agb.lastUpdated}</p>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none dark:prose-invert">
          {settings.agb.content ? (
            <div dangerouslySetInnerHTML={{ __html: settings.agb.content }} />
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">1. Scope of Application</h2>
                <p className="text-muted-foreground mb-2">
                  These General Terms and Conditions (AGB) apply to all contracts concluded between {general.companyName} (hereinafter "Provider") and the customer (hereinafter "Client") regarding services offered by the Provider.
                </p>
                <p className="text-muted-foreground mb-2">
                  The Provider's terms and conditions apply exclusively. Deviating, conflicting or supplementary general terms and conditions of the Client shall only become part of the contract if and to the extent that the Provider has expressly agreed to their validity.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">2. Services</h2>
                <p className="text-muted-foreground mb-2">
                  The Provider offers web development, software development, design, and related digital services. The specific scope of services is defined in individual contracts or offers.
                </p>
                <p className="text-muted-foreground mb-2">
                  The Provider reserves the right to use subcontractors for the provision of services. The Provider remains responsible for the proper execution of the contract.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">3. Contract Conclusion</h2>
                <p className="text-muted-foreground mb-2">
                  The presentation of services on the Provider's website does not constitute a binding offer but an invitation to place an order.
                </p>
                <p className="text-muted-foreground mb-2">
                  By submitting an order, the Client makes a binding offer to conclude a contract. The Provider may accept this offer within 5 working days by sending an order confirmation or by beginning to provide the service.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">4. Prices and Payment</h2>
                <p className="text-muted-foreground mb-2">
                  All prices are quoted in Euro (€) and include the applicable statutory VAT unless otherwise stated.
                </p>
                <p className="text-muted-foreground mb-2">
                  Payment is due within 14 days of the invoice date unless otherwise agreed. In the event of default, the Provider is entitled to charge default interest at a rate of 9 percentage points above the base interest rate.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">5. Delivery Time and Performance</h2>
                <p className="text-muted-foreground mb-2">
                  Delivery times stated by the Provider are approximate unless a fixed deadline has been expressly agreed.
                </p>
                <p className="text-muted-foreground mb-2">
                  The Provider shall inform the Client immediately if agreed delivery times cannot be met. The Client may withdraw from the contract if the delay makes the service no longer of interest.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">6. Intellectual Property Rights</h2>
                <p className="text-muted-foreground mb-2">
                  All intellectual property rights to created works remain with the Provider until full payment has been received.
                </p>
                <p className="text-muted-foreground mb-2">
                  Upon full payment, usage rights are transferred to the Client in accordance with the specific contract terms. The Provider retains the right to use created works for portfolio and marketing purposes unless otherwise agreed.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">7. Liability</h2>
                <p className="text-muted-foreground mb-2">
                  The Provider shall be liable without limitation for damages resulting from injury to life, body or health, for damages caused intentionally or through gross negligence, and in accordance with the Product Liability Act.
                </p>
                <p className="text-muted-foreground mb-2">
                  For slight negligence, the Provider shall only be liable in the event of a breach of essential contractual obligations (cardinal obligations). In this case, liability is limited to the foreseeable, typically occurring damage.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">8. Data Protection</h2>
                <p className="text-muted-foreground mb-2">
                  The Provider processes personal data in accordance with the applicable data protection regulations, in particular the GDPR. Details can be found in the privacy policy (Datenschutzerklärung).
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">9. Final Provisions</h2>
                <p className="text-muted-foreground mb-2">
                  The law of the Federal Republic of Germany applies to all legal relationships between the Provider and the Client, excluding the UN Convention on Contracts for the International Sale of Goods.
                </p>
                <p className="text-muted-foreground mb-2">
                  If the Client is a merchant, a legal entity under public law, or a special fund under public law, the exclusive place of jurisdiction for all disputes arising from or in connection with contracts between the Provider and the Client is the Provider's registered office.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Contact</h2>
                <p className="text-muted-foreground mb-1">{general.companyName}</p>
                <p className="text-muted-foreground mb-1">{general.address}</p>
                <p className="text-muted-foreground mb-1">
                  Email:{' '}
                  <a href={`mailto:${general.email}`} className="text-primary hover:underline">
                    {general.email}
                  </a>
                </p>
                <p className="text-muted-foreground">Phone: {general.phone}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}