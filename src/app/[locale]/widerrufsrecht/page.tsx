import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { settingsDb } from '@/lib/settings-db'

export default async function WiderrufsrechtPage() {
  const settings = await settingsDb.getLegal()
  const general = await settingsDb.getGeneral()

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Widerrufsrecht</CardTitle>
          <p className="text-muted-foreground">Right of Withdrawal</p>
          <p className="text-sm text-muted-foreground">Last updated: {settings.widerrufsrecht.lastUpdated}</p>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none dark:prose-invert">
          {settings.widerrufsrecht.content ? (
            <div dangerouslySetInnerHTML={{ __html: settings.widerrufsrecht.content }} />
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Right of Withdrawal for Consumers</h2>
                <p className="text-muted-foreground mb-2">
                  If you are a consumer (i.e., a natural person concluding a legal transaction for purposes that are predominantly neither commercial nor self-employed), you have the following right of withdrawal:
                </p>
              </div>

              <div className="border-2 border-primary/20 rounded-lg p-6 bg-muted/30">
                <h3 className="text-lg font-semibold mb-3">Withdrawal Policy</h3>
                
                <h4 className="font-semibold mb-2">Right of Withdrawal</h4>
                <p className="text-muted-foreground mb-4">
                  You have the right to withdraw from this contract within 14 days without giving any reason.
                </p>

                <p className="text-muted-foreground mb-4">
                  The withdrawal period is 14 days from the day of the conclusion of the contract.
                </p>

                <p className="text-muted-foreground mb-4">
                  To exercise your right of withdrawal, you must inform us:
                </p>

                <div className="bg-background p-4 rounded mb-4">
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

                <p className="text-muted-foreground mb-4">
                  by means of a clear statement (e.g., a letter sent by post or email) of your decision to withdraw from this contract. You may use the attached model withdrawal form, but it is not obligatory.
                </p>

                <p className="text-muted-foreground mb-4">
                  To meet the withdrawal deadline, it is sufficient for you to send your communication concerning your exercise of the right of withdrawal before the withdrawal period has expired.
                </p>

                <h4 className="font-semibold mb-2 mt-4">Consequences of Withdrawal</h4>
                <p className="text-muted-foreground mb-4">
                  If you withdraw from this contract, we shall reimburse to you all payments received from you, including the costs of delivery (with the exception of the supplementary costs resulting from your choice of a type of delivery other than the least expensive type of standard delivery offered by us), without undue delay and in any event not later than 14 days from the day on which we are informed about your decision to withdraw from this contract.
                </p>

                <p className="text-muted-foreground mb-4">
                  We will carry out such reimbursement using the same means of payment as you used for the initial transaction, unless you have expressly agreed otherwise; in any event, you will not incur any fees as a result of such reimbursement.
                </p>

                <p className="text-muted-foreground">
                  If you requested to begin the performance of services during the withdrawal period, you shall pay us an amount which is in proportion to what has been provided until you have communicated us your withdrawal from this contract, in comparison with the full coverage of the contract.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Exclusion and Early Expiry of the Right of Withdrawal</h2>
                <p className="text-muted-foreground mb-2">
                  The right of withdrawal does not apply to contracts:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>
                    For the supply of digital content which is not supplied on a tangible medium if you have given your express consent to the execution of the contract before the expiry of the withdrawal period and you have acknowledged that you thereby lose your right of withdrawal
                  </li>
                  <li>
                    For the supply of goods that are made to your specifications or are clearly personalized
                  </li>
                  <li>
                    For the supply of services if we have fully performed the service and you have expressly agreed before the performance of the service that we may begin with the execution and you have acknowledged that you lose your right of withdrawal once the service has been fully performed
                  </li>
                </ul>
              </div>

              <div className="border-2 border-primary/20 rounded-lg p-6 bg-muted/30">
                <h3 className="text-lg font-semibold mb-3">Model Withdrawal Form</h3>
                <p className="text-sm text-muted-foreground mb-4 italic">
                  (If you wish to withdraw from the contract, please fill out this form and return it to us)
                </p>

                <div className="bg-background p-6 rounded space-y-4 font-mono text-sm">
                  <p>To:</p>
                  <p>{general.companyName}</p>
                  <p>{general.address}</p>
                  <p>Email: {general.email}</p>
                  
                  <p className="pt-4">
                    I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract of sale of the following goods (*)/provision of the following service (*)
                  </p>
                  
                  <p>_______________________________</p>
                  
                  <p>Ordered on (*)/received on (*)</p>
                  
                  <p>_______________________________</p>
                  
                  <p>Name of consumer(s)</p>
                  
                  <p>_______________________________</p>
                  
                  <p>Address of consumer(s)</p>
                  
                  <p>_______________________________</p>
                  
                  <p>Signature of consumer(s) (only if this form is notified on paper)</p>
                  
                  <p>_______________________________</p>
                  
                  <p>Date</p>
                  
                  <p className="pt-4 text-xs">(*) Delete as appropriate</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Special Notes</h2>
                <p className="text-muted-foreground mb-2">
                  <strong>For Digital Content and Services:</strong> If you request that the provision of digital content or services begins during the withdrawal period, you acknowledge that you will lose your right of withdrawal once the service has been fully performed or the digital content has been fully delivered.
                </p>
                <p className="text-muted-foreground mb-2">
                  <strong>For Custom-Made Products:</strong> For products or services that are specifically tailored to your requirements, the right of withdrawal may not apply. This will be clearly indicated in the product description or service agreement.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Contact for Withdrawal</h2>
                <p className="text-muted-foreground mb-2">
                  If you have any questions about your right of withdrawal or need assistance with the withdrawal process, please contact us:
                </p>
                <div className="bg-muted/50 p-4 rounded">
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}