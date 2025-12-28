import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            ← Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Impressum</CardTitle>
            <p className="text-muted-foreground">Angaben gemäß § 5 TMG</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Kontakt</h2>
                <p className="mb-1">
                  <strong>Telefon:</strong>{' '}
                  <a href="tel:+4920858153726" className="text-primary hover:underline">
                    0208 581 537 26
                  </a>
                </p>
                <p className="mb-1">
                  <strong>E-Mail:</strong>{' '}
                  <a href="mailto:info@dfmsolutions.de" className="text-primary hover:underline">
                    info@dfmsolutions.de
                  </a>
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Inhaber</h2>
                <p className="text-muted-foreground">
                  <strong>Inh.:</strong> Fatme Mustafa
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Steuerinformationen</h2>
                <p className="mb-1">
                  <strong>Umsatzsteuer-Identifikationsnummer(n):</strong> DE365152142
                </p>
                <p className="mb-1">
                  <strong>Ust-Nummer:</strong> 107 / 5104 / 3484
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">EU-Streitschlichtung</h2>
                <p className="text-muted-foreground mb-2">
                  Informationen zur Erfüllung der quantitativen Zielvorgaben zu Altgeräten nach §§ 10 Abs. 3, 22 Abs. 1 ElektroG finden Sie auf den Seiten des{' '}
                  <a
                    href="https://www.bundesumweltministerium.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Bundesumweltministeriums
                  </a>{' '}
                  („Statistik").
                </p>
                <p className="text-muted-foreground mb-2">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie hier finden:{' '}
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                </p>
                <p className="text-muted-foreground">
                  Zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle sind wir nicht verpflichtet und nicht bereit.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Haftung für Inhalte</h2>
                <p className="text-muted-foreground mb-2">
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                </p>
                <p className="text-muted-foreground">
                  Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Haftung für Links</h2>
                <p className="text-muted-foreground">
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Urheberrecht</h2>
                <p className="text-muted-foreground">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}