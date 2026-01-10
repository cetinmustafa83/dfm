import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { CheckCircle, AlertTriangle, Euro, Clock, Shield, Zap } from 'lucide-react'

export default function ArbeitsgrundsaetzeUndRegelnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zurück zur Startseite
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-bold">Arbeitsgrundsätze und Regeln</CardTitle>
            <p className="text-muted-foreground mt-2">Unsere Werte, Prinzipien und Richtlinien bei DFM Solutions</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            
            {/* Grundsätze für neue und bestehende Projekte */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                Grundsätze für neue und bestehende Projekte
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    number: "1",
                    title: "Kommunikation über CRM-System",
                    content: "Bitte erkundigen Sie sich nach Möglichkeit per E-Mail oder Ticketsystem über den Projektstatus. Wenn Sie sich nicht an Ihre CRM-Anmeldeinformationen erinnern, fordern Sie diese an. Informationen zu Ihren Projekten finden Sie in unserem CRM-System und Sie können Ihr Projekt hier Schritt für Schritt verfolgen. Sie können Ihrem Projekt eine zusätzliche Anfrage oder ein Bild hinzufügen. Sie können Korrekturen anfordern oder Seitentext hinzufügen (z. B. Impressumstext)."
                  },
                  {
                    number: "2",
                    title: "Detaillierte Projektbeschreibung",
                    content: "Wenn Sie Ihr Projekt zum ersten Mal bei uns anfordern, erläutern Sie es bitte im Detail. Anschließend werden die angeforderten Ergänzungen und Korrekturen als Extra berechnet und dies erhöht die Kosten Ihres Projekts."
                  },
                  {
                    number: "3",
                    title: "Bereitstellung von Inhalten",
                    content: "Bitte senden Sie uns zu Beginn Ihres Projekts die von Ihnen vorbereiteten Texte und Bilder zu den Seiten Ihres Projekts. Andernfalls warten wir maximal 3 Tage, bis wir eine Information von Ihnen erhalten, und dann (wir berechnen diese Wartezeittage extra) wird leider das nächste Projekt gestartet.",
                    warning: true
                  },
                  {
                    number: "4",
                    title: "Zusatzpakete für Inhalte",
                    content: "Wenn Sie keinen Text oder Bilder vorbereitet haben, können Sie diese bei uns anfordern. Wir haben verschiedene Zusatzpakete im Angebot. Bitte beachten Sie, dass diese Pakete kostenpflichtig sind und zu den Kosten Ihres Projekts hinzugerechnet werden."
                  },
                  {
                    number: "5",
                    title: "Angebotserstellung",
                    content: "Fordern Sie bei uns ein Angebot an, um unseren Rabatt für Sie zu erfahren. Dies kann je nach Angebotsauslastung oder gewähltem Paket variieren. Vergessen Sie nicht, das Angebot zu bestätigen, sonst startet Ihr Projekt nicht."
                  },
                  {
                    number: "6",
                    title: "Zahlungsbedingungen",
                    content: "Sie müssen 50 % der Zahlung geleistet haben, bevor Sie mit dem Projekt beginnen. Die restlichen 50 % müssen vor der Bereitstellung Ihrer Website bezahlt werden. Das fertige Projekt wird erst geliefert, wenn Sie Ihre Zahlung abgeschlossen haben. Bitte beachten Sie, dass zwischen der ersten und der zweiten Zahlung maximal 7 Tage vergehen. Andernfalls unterbrechen wir Ihr Projekt. In diesem Fall kann es zu Verzögerungen bei Ihrem Projekt kommen.",
                    warning: true,
                    note: "Aufgrund verspäteter Zahlungen müssen wir manchmal mit dem nächsten Projekt fortfahren und aus diesem Grund kann es zu Verzögerungen bei Ihrem Projekt kommen. Diese Verzögerungen werden von Ihnen verursacht und wir übernehmen keine Verantwortung."
                  },
                  {
                    number: "7",
                    title: "CMS-Virenprüfung oder Virenentfernung",
                    content: "Für diesen Service gibt es keine 100-prozentige Garantie und der Zeitaufwand wird extra berechnet. Manchmal infizieren Viren die gesamte Hauptstruktur und können irreversible Fehler verursachen. In diesem Fall empfehlen wir Ihnen die Wiederherstellung aus einem Backup, falls verfügbar, oder im schlimmsten Fall eine neue Webseite. Wenn Sie eine neue Webseite anfordern, gewähren wir einen Rabatt unter Berücksichtigung der zuvor aufgewendeten Zeit."
                  },
                  {
                    number: "8",
                    title: "Shell-Dateien und Hosting-Bereinigung",
                    content: "Wenn Trojaner oder Viren eine Shell-Datei im Hosting erstellt haben, kann es notwendig sein, das Hosting zu bereinigen. In diesem Fall kontaktieren Sie uns bitte, bevor Sie etwas tun.",
                    warning: true
                  },
                  {
                    number: "9",
                    title: "Update-Probleme",
                    content: "Bei Problemen, die durch Aktualisierungen entstehen, kontaktieren Sie uns bitte, bevor Sie etwas tun, da Sie sonst möglicherweise noch mehr Schaden anrichten und wir mehr Zeit verschwenden. Das kostet Sie natürlich mehr.",
                    warning: true
                  },
                  {
                    number: "10",
                    title: "Externe Änderungen",
                    content: "Wenn Sie oder jemand anderes aus irgendeinem Grund Eingriffe oder Änderungen an der Website oder dem E-Shop vornimmt, wenden Sie sich bitte zunächst an uns. Wenn Sie aufgrund eines Änderungs- oder Systemfehlers eine Korrektur benötigen, ist es hilfreich zu wissen, dass dies mit gewissen Kosten verbunden ist. Der Zeitaufwand wird extra berechnet."
                  },
                  {
                    number: "11",
                    title: "Was nicht im Standard Support-Paket enthalten ist",
                    content: "Die Neugestaltung und Programmierung jeglicher Webseiten ist nicht enthalten.",
                    list: [
                      "Grafikdesigns: Banner, Logo, Bildänderungen und Farbänderungen sind nicht enthalten",
                      "Text: Das Umschreiben von Texten durch uns ist nicht inbegriffen",
                      "Sprachzusätze: Sprachliche Ergänzungen oder Umschreibungen von Texten durch uns sind nicht inbegriffen",
                      "Support per Telefon oder WhatsApp ist nicht inbegriffen. Kontaktieren Sie uns per E-Mail oder Ticket und Sie erhalten innerhalb von 48 Stunden eine Antwort"
                    ],
                    note: "Unsere Supportpakete variieren und bestehen aus jährlichen Zahlungen."
                  }
                ].map((item, idx) => (
                  <div key={idx} className={`border-l-4 ${item.warning ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' : 'border-primary bg-primary/5'} p-6 rounded-r-lg`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full ${item.warning ? 'bg-orange-500' : 'bg-primary'} text-white flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                        {item.number}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                          {item.title}
                          {item.warning && <AlertTriangle className="w-5 h-5 text-orange-500" />}
                        </h3>
                        <p className="text-muted-foreground mb-3">{item.content}</p>
                        {item.list && (
                          <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground mb-3">
                            {item.list.map((listItem, listIdx) => (
                              <li key={listIdx}>{listItem}</li>
                            ))}
                          </ul>
                        )}
                        {item.note && (
                          <div className="mt-3 p-3 bg-muted/50 rounded text-sm italic">
                            <strong>Hinweis:</strong> {item.note}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Warum 7 Tage */}
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  Warum erlauben wir max. 7 Tage zwischen den Zahlungen?
                </h3>
                <p className="text-muted-foreground">
                  Denn die gesamte geleistete Arbeit wird nach der aufgewendeten Zeit berechnet. In diesem Fall kann das vom Kunden gestartete und verlangsamte Projekt teilweise bis zu 30 Tage dauern (Farbwechsel, optische Veränderung, Textlieferung etc.). In diesem Fall schadet es unserem Unternehmen, 30 Tage lang auf die Zahlung zu warten. Daher liegt das Maximum bei 7 Tagen.
                </p>
              </div>
            </section>

            {/* Kundenpanel & Partnerpanel */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Systeme & Zugang</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg border-2 border-primary/20">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Kundenpanel</h3>
                  <ul className="space-y-2">
                    {['Projekt Überwachung', 'Informationsaustausch', 'Teilen von Bildern oder Logos', 'Ticket System'].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Badge className="bg-primary">Kundenlogin</Badge>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 p-6 rounded-lg border-2 border-green-200 dark:border-green-800">
                  <h3 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-400">Partnerpanel</h3>
                  <ul className="space-y-2">
                    {[
                      'Projekt Überwachung',
                      'Informationsaustausch',
                      'Teilen von Bildern oder Logos',
                      'Ticket System',
                      'Neues Projekt erstellen',
                      'Neuen Kunden hinzufügen',
                      'TODO hinzufügen',
                      'Angebot erstellen und an Ihren Kunden versenden'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Badge className="bg-green-600">Partnerlogin</Badge>
                  </div>
                </div>
              </div>
            </section>

            {/* Support-Pakete */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Zap className="w-8 h-8 text-primary" />
                Support-Pakete
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Standard */}
                <div className="border-2 rounded-lg p-6 hover:border-primary transition-colors">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">Standard</h3>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-sm text-muted-foreground">ab</span>
                      <span className="text-4xl font-bold text-primary">29€</span>
                      <span className="text-sm text-muted-foreground">/Monat</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {[
                      { included: true, text: 'Support per Ticket (max 2 Stunden)' },
                      { included: true, text: 'Support per E-Mail (max 2 Stunden)' },
                      { included: false, text: 'Support per Telefon' },
                      { included: true, text: 'Kleinere Änderungen' },
                      { included: false, text: 'Einschließlich des Hinzufügens neuer Unterseiten' },
                      { included: true, text: 'Austausch der von Ihnen bereitgestellten Inhalte' },
                      { included: false, text: 'Neugestaltung' },
                      { included: false, text: 'Seitenfarbe ändern' },
                      { included: true, text: 'Integration vertrauensbildender Elemente Basic' },
                      { included: true, text: 'Wartezeit: 48 Stunden' }
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        {item.included ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <span className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500">✕</span>
                        )}
                        <span className={!item.included ? 'text-muted-foreground' : ''}>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pro */}
                <div className="border-2 border-primary rounded-lg p-6 relative bg-primary/5">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">Beliebt</Badge>
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">Pro</h3>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-sm text-muted-foreground">ab</span>
                      <span className="text-4xl font-bold text-primary">69€</span>
                      <span className="text-sm text-muted-foreground">/Monat</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {[
                      { included: true, text: 'Support per Ticket (max 4 Stunden)' },
                      { included: true, text: 'Support per E-Mail (max 4 Stunden)' },
                      { included: true, text: 'Support per Telefon (max 2 Stunden)' },
                      { included: true, text: 'Allgemeine Änderungen' },
                      { included: true, text: 'Hinzufügen neuer Unterseiten (bis 3 Seiten)' },
                      { included: true, text: 'Austausch der von Ihnen bereitgestellten Inhalte' },
                      { included: false, text: 'Neugestaltung' },
                      { included: false, text: 'Seitenfarbe ändern' },
                      { included: true, text: 'Integration vertrauensbildender Elemente Standard' },
                      { included: true, text: 'Wartezeit: 24 Stunden' }
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        {item.included ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <span className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500">✕</span>
                        )}
                        <span className={!item.included ? 'text-muted-foreground' : ''}>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pro+ */}
                <div className="border-2 rounded-lg p-6 hover:border-primary transition-colors">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">Pro +</h3>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-sm text-muted-foreground">ab</span>
                      <span className="text-4xl font-bold text-primary">99€</span>
                      <span className="text-sm text-muted-foreground">/Monat</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {[
                      { included: true, text: 'Support per Ticket (max 6 Stunden)' },
                      { included: true, text: 'Support per E-Mail (max 6 Stunden)' },
                      { included: true, text: 'Support per Telefon (max 3 Stunden)' },
                      { included: true, text: 'Allgemeine Änderungen' },
                      { included: true, text: 'Hinzufügen neuer Unterseiten (bis 6 Seiten)' },
                      { included: true, text: 'Austausch der von Ihnen bereitgestellten Inhalte' },
                      { included: false, text: 'Neugestaltung' },
                      { included: true, text: 'Seitenfarbe ändern' },
                      { included: true, text: 'Integration vertrauensbildender Elemente Premium' },
                      { included: true, text: 'Mahnschutz (Optional)' },
                      { included: true, text: 'Wartezeit: 12 Stunden' }
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        {item.included ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <span className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500">✕</span>
                        )}
                        <span className={!item.included ? 'text-muted-foreground' : ''}>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* E-Shop & Produktservice */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-3">E-Shop Support Service</h3>
                  <p className="text-sm text-muted-foreground">
                    Der E-Shop-Support kann je nach Anfrage oder Bedarf variieren. Aus diesem Grund gibt es kein klares Unterstützungspaket. Wenn Sie Unterstützung anfordern, teilen Sie uns bitte Ihre Bedürfnisse mit. Wir erstellen den für Sie am besten geeigneten Angebot und senden ihn per E-Mail. Wenn Sie das erstellte Angebot nicht genehmigen, wird Ihr Supportpaket nicht aktiviert.
                  </p>
                </div>

                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-3">Produktservice</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Möchten Sie Produkte zu Ihrer Webseite hinzufügen? Okay, wir helfen Ihnen gerne weiter. Bitte zögern Sie nicht uns zu kontaktieren.
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    Unsere Preise variieren je nach Anzahl der Produkte!
                  </p>
                </div>
              </div>
            </section>

            {/* Zusatzpakete */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Euro className="w-8 h-8 text-primary" />
                Zusatzpakete & Preise
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    title: 'Fotopaket',
                    price: '299€',
                    type: 'einmalig',
                    description: 'Diese Pakete beinhalten häufig eine Vielzahl von Fotos, die von professionellen Fotografen aufgenommen wurden, sowie die nötigen Nutzungsrechte für deren Verwendung auf Websites und in Marketingkampagnen. Sie sind auch perfekt für Unternehmen, die schnell und einfach auf visuelle Inhalte zugreifen möchten.'
                  },
                  {
                    title: 'Logo Design',
                    price: '299€',
                    type: 'einmalig',
                    description: 'Ein Logo ist ein visuelles Symbol, das eine Organisation, eine Marke, ein Produkt oder eine Dienstleistung repräsentiert. Der Designprozess umfasst Recherche, Analyse, Brainstorming, Konzeptentwicklung und Finalisierung.'
                  },
                  {
                    title: 'Textpaket (KI)',
                    price: '299€',
                    type: 'einmalig',
                    description: 'Web Textpakete sind eine bequeme Lösung für Unternehmen, die regelmäßig Texte für ihre Website oder soziale Medien benötigen. Die Texte sind speziell für das Internet optimiert und suchmaschinenfreundlich.'
                  },
                  {
                    title: 'Zusätzliches Sprachpaket',
                    price: '699€',
                    type: 'einmalig',
                    description: 'Ein Web Sprachpaket ermöglicht es Benutzern, die Seite in ihrer bevorzugten Sprache zu verwenden. Es enthält Übersetzungen für Schaltflächen, Menüs, Texte und andere Elemente. Wird für jede weitere Sprache separat berechnet!'
                  },
                  {
                    title: 'Sprachpaket für E-Shop (CMS)',
                    price: '1299€',
                    type: 'einmalig',
                    description: 'E-Shop Sprachpakete ermöglichen dynamischen Sprachwechsel ohne Neuladen der Seite. Enthält vollständige Übersetzungen aller E-Shop-Elemente. Wird für jede weitere Sprache separat berechnet!'
                  }
                ].map((pkg, idx) => (
                  <div key={idx} className="border-2 rounded-lg p-6 hover:border-primary transition-colors bg-card">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">{pkg.price}</span>
                        <Badge variant="outline">{pkg.type}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  </div>
                ))}
              </div>

              {/* Detaillierte Infos */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                  <h3 className="text-xl font-bold mb-3">Logo Design - Wichtige Überlegungen</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Einfachheit:</strong> Ein einfaches Design ist leichter zu merken und vielseitiger einsetzbar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Skalierbarkeit:</strong> Das Logo sollte in verschiedenen Größen gut aussehen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Zeitlosigkeit:</strong> Ein zeitloses Design bleibt auch in vielen Jahren relevant</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Einzigartigkeit:</strong> Das Logo sollte sich von der Konkurrenz abheben</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <h3 className="text-xl font-bold mb-3">Textpaket - Vorteile</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Web Textpakete sind eine effektive Möglichkeit, um die Arbeit von Webentwicklern und Marketingspezialisten zu unterstützen und die Online-Präsenz zu erhöhen.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>Suchmaschinenfreundliche Texte</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>Qualitätskontrolle durch professionelle Schreiber</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>Zeitersparnis und einheitliche Darstellung</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Kontakt CTA */}
            <section className="mt-12">
              <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-8 rounded-lg text-center">
                <h2 className="text-3xl font-bold mb-4">Haben Sie Fragen?</h2>
                <p className="text-lg mb-6 opacity-90">
                  Kontaktieren Sie uns für weitere Informationen zu unseren Arbeitsgrundsätzen, Support-Paketen oder Zusatzleistungen
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:info@dfmsolutions.de"
                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    E-Mail senden
                  </a>
                  <a
                    href="tel:02085815 3726"
                    className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                  >
                    0208 581 537 26
                  </a>
                </div>
              </div>
            </section>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}