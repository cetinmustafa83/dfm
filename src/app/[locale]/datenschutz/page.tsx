import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function DatenschutzPage() {
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

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-bold">Datenschutzerklärung</CardTitle>
            <p className="text-muted-foreground mt-2">Stand: 28. Dezember 2023</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            {/* Präambel */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Präambel</h2>
              <p className="text-muted-foreground">
                Mit der folgenden Datenschutzerklärung möchten wir Sie darüber aufklären, welche Arten Ihrer personenbezogenen Daten (nachfolgend auch kurz als „Daten" bezeichnet) wir zu welchen Zwecken und in welchem Umfang verarbeiten. Die Datenschutzerklärung gilt für alle von uns durchgeführten Verarbeitungen personenbezogener Daten, sowohl im Rahmen der Erbringung unserer Leistungen als auch insbesondere auf unseren Webseiten, in mobilen Applikationen sowie innerhalb externer Onlinepräsenzen, wie z. B. unserer Social-Media-Profile (nachfolgend zusammenfassend bezeichnet als „Onlineangebot").
              </p>
              <p className="text-muted-foreground mt-2">
                Die verwendeten Begriffe sind nicht geschlechtsspezifisch.
              </p>
            </section>

            {/* Inhaltsübersicht */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Inhaltsübersicht</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Präambel</li>
                <li>Verantwortlicher</li>
                <li>Übersicht der Verarbeitungen</li>
                <li>Maßgebliche Rechtsgrundlagen</li>
                <li>Sicherheitsmaßnahmen</li>
                <li>Übermittlung von personenbezogenen Daten</li>
                <li>Internationale Datentransfers</li>
                <li>Löschung von Daten</li>
                <li>Rechte der betroffenen Personen</li>
                <li>Einsatz von Cookies</li>
                <li>Geschäftliche Leistungen</li>
                <li>Bereitstellung des Onlineangebotes und Webhosting</li>
                <li>Kontakt- und Anfragenverwaltung</li>
                <li>Kommunikation via Messenger</li>
                <li>Newsletter und elektronische Benachrichtigungen</li>
                <li>Werbliche Kommunikation via E-Mail, Post, Fax oder Telefon</li>
                <li>Webanalyse, Monitoring und Optimierung</li>
                <li>Onlinemarketing</li>
                <li>Präsenzen in sozialen Netzwerken (Social Media)</li>
                <li>Plugins und eingebettete Funktionen sowie Inhalte</li>
              </ul>
            </section>

            {/* Verantwortlicher */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Verantwortlicher</h2>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-semibold">DFM Solutions – Inh. Fatme Mustafa</p>
                <p>Flöz-Matthias-Straße 12</p>
                <p>46119 Oberhausen</p>
                <p>Deutschland</p>
                <p className="mt-2">
                  <strong>E-Mail-Adresse:</strong>{' '}
                  <a href="mailto:info@dfmsolutions.de" className="text-primary hover:underline">
                    info@dfmsolutions.de
                  </a>
                </p>
                <p>
                  <strong>Telefon:</strong> 0208 581 537 26
                </p>
                <p>
                  <strong>Impressum:</strong>{' '}
                  <Link href="/impressum" className="text-primary hover:underline">
                    https://www.dfmsolutions.de/impressum/
                  </Link>
                </p>
              </div>
            </section>

            {/* Übersicht der Verarbeitungen */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Übersicht der Verarbeitungen</h2>
              <p className="text-muted-foreground mb-4">
                Die nachfolgende Übersicht fasst die Arten der verarbeiteten Daten und die Zwecke ihrer Verarbeitung zusammen und verweist auf die betroffenen Personen.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Arten der verarbeiteten Daten</h3>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Bestandsdaten.</li>
                <li>Zahlungsdaten.</li>
                <li>Standortdaten.</li>
                <li>Kontaktdaten.</li>
                <li>Inhaltsdaten.</li>
                <li>Vertragsdaten.</li>
                <li>Nutzungsdaten.</li>
                <li>Meta-, Kommunikations- und Verfahrensdaten.</li>
                <li>Event-Daten (Facebook).</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Kategorien betroffener Personen</h3>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Interessenten.</li>
                <li>Kommunikationspartner.</li>
                <li>Nutzer.</li>
                <li>Geschäfts- und Vertragspartner.</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Zwecke der Verarbeitung</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Erbringung vertraglicher Leistungen und Erfüllung vertraglicher Pflichten.</li>
                <li>Kontaktanfragen und Kommunikation.</li>
                <li>Sicherheitsmaßnahmen.</li>
                <li>Direktmarketing.</li>
                <li>Reichweitenmessung.</li>
                <li>Tracking.</li>
                <li>Büro- und Organisationsverfahren.</li>
                <li>Konversionsmessung.</li>
                <li>Verwaltung und Beantwortung von Anfragen.</li>
                <li>Firewall.</li>
                <li>Feedback.</li>
                <li>Marketing.</li>
                <li>Profile mit nutzerbezogenen Informationen.</li>
                <li>Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit.</li>
                <li>Informationstechnische Infrastruktur.</li>
              </ul>
            </section>

            {/* Maßgebliche Rechtsgrundlagen */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Maßgebliche Rechtsgrundlagen</h2>
              <p className="text-muted-foreground mb-4">
                <strong>Maßgebliche Rechtsgrundlagen nach der DSGVO:</strong> Im Folgenden erhalten Sie eine Übersicht der Rechtsgrundlagen der DSGVO, auf deren Basis wir personenbezogene Daten verarbeiten. Bitte nehmen Sie zur Kenntnis, dass neben den Regelungen der DSGVO nationale Datenschutzvorgaben in Ihrem bzw. unserem Wohn- oder Sitzland gelten können. Sollten ferner im Einzelfall speziellere Rechtsgrundlagen maßgeblich sein, teilen wir Ihnen diese in der Datenschutzerklärung mit.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Einwilligung (Art. 6 Abs. 1 S. 1 lit. a) DSGVO)</strong> – Die betroffene Person hat ihre Einwilligung in die Verarbeitung der sie betreffenden personenbezogenen Daten für einen spezifischen Zweck oder mehrere bestimmte Zwecke gegeben.
                </li>
                <li>
                  <strong>Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO)</strong> – Die Verarbeitung ist für die Erfüllung eines Vertrags, dessen Vertragspartei die betroffene Person ist, oder zur Durchführung vorvertraglicher Maßnahmen erforderlich, die auf Anfrage der betroffenen Person erfolgen.
                </li>
                <li>
                  <strong>Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c) DSGVO)</strong> – Die Verarbeitung ist zur Erfüllung einer rechtlichen Verpflichtung erforderlich, der der Verantwortliche unterliegt.
                </li>
                <li>
                  <strong>Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO)</strong> – Die Verarbeitung ist zur Wahrung der berechtigten Interessen des Verantwortlichen oder eines Dritten erforderlich, sofern nicht die Interessen oder Grundrechte und Grundfreiheiten der betroffenen Person, die den Schutz personenbezogener Daten erfordern, überwiegen.
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                <strong>Nationale Datenschutzregelungen in Deutschland:</strong> Zusätzlich zu den Datenschutzregelungen der DSGVO gelten nationale Regelungen zum Datenschutz in Deutschland. Hierzu gehört insbesondere das Gesetz zum Schutz vor Missbrauch personenbezogener Daten bei der Datenverarbeitung (Bundesdatenschutzgesetz – BDSG). Das BDSG enthält insbesondere Spezialregelungen zum Recht auf Auskunft, zum Recht auf Löschung, zum Widerspruchsrecht, zur Verarbeitung besonderer Kategorien personenbezogener Daten, zur Verarbeitung für andere Zwecke und zur Übermittlung sowie automatisierten Entscheidungsfindung im Einzelfall einschließlich Profiling. Ferner können Landesdatenschutzgesetze der einzelnen Bundesländer zur Anwendung gelangen.
              </p>
            </section>

            {/* Sicherheitsmaßnahmen */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Sicherheitsmaßnahmen</h2>
              <p className="text-muted-foreground mb-4">
                Wir treffen nach Maßgabe der gesetzlichen Vorgaben unter Berücksichtigung des Stands der Technik, der Implementierungskosten und der Art, des Umfangs, der Umstände und der Zwecke der Verarbeitung sowie der unterschiedlichen Eintrittswahrscheinlichkeiten und des Ausmaßes der Bedrohung der Rechte und Freiheiten natürlicher Personen geeignete technische und organisatorische Maßnahmen, um ein dem Risiko angemessenes Schutzniveau zu gewährleisten.
              </p>
              <p className="text-muted-foreground mb-4">
                Zu den Maßnahmen gehören insbesondere die Sicherung der Vertraulichkeit, Integrität und Verfügbarkeit von Daten durch Kontrolle des physischen und elektronischen Zugangs zu den Daten als auch des sie betreffenden Zugriffs, der Eingabe, der Weitergabe, der Sicherung der Verfügbarkeit und ihrer Trennung. Des Weiteren haben wir Verfahren eingerichtet, die eine Wahrnehmung von Betroffenenrechten, die Löschung von Daten und Reaktionen auf die Gefährdung der Daten gewährleisten. Ferner berücksichtigen wir den Schutz personenbezogener Daten bereits bei der Entwicklung bzw. Auswahl von Hardware, Software sowie Verfahren entsprechend dem Prinzip des Datenschutzes, durch Technikgestaltung und durch datenschutzfreundliche Voreinstellungen.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Kürzung der IP-Adresse:</strong> Sofern IP-Adressen von uns oder von den eingesetzten Dienstleistern und Technologien verarbeitet werden und die Verarbeitung einer vollständigen IP-Adresse nicht erforderlich ist, wird die IP-Adresse gekürzt (auch als „IP-Masking" bezeichnet). Hierbei werden die letzten beiden Ziffern, bzw. der letzte Teil der IP-Adresse nach einem Punkt entfernt, bzw. durch Platzhalter ersetzt. Mit der Kürzung der IP-Adresse soll die Identifizierung einer Person anhand ihrer IP-Adresse verhindert oder wesentlich erschwert werden.
              </p>
              <p className="text-muted-foreground">
                <strong>TLS/SSL-Verschlüsselung (https):</strong> Um die Daten der Benutzer, die über unsere Online-Dienste übertragen werden, zu schützen, verwenden wir TLS/SSL-Verschlüsselung. Secure Sockets Layer (SSL) ist die Standardtechnologie zur Sicherung von Internetverbindungen durch Verschlüsselung der zwischen einer Website oder App und einem Browser (oder zwischen zwei Servern) übertragenen Daten. Transport Layer Security (TLS) ist eine aktualisierte und sicherere Version von SSL. Hyper Text Transfer Protocol Secure (HTTPS) wird in der URL angezeigt, wenn eine Website durch ein SSL/TLS-Zertifikat gesichert ist.
              </p>
            </section>

            {/* Übermittlung von personenbezogenen Daten */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Übermittlung von personenbezogenen Daten</h2>
              <p className="text-muted-foreground">
                Im Rahmen unserer Verarbeitung von personenbezogenen Daten kommt es vor, dass die Daten an andere Stellen, Unternehmen, rechtlich selbstständige Organisationseinheiten oder Personen übermittelt oder sie ihnen gegenüber offengelegt werden. Zu den Empfängern dieser Daten können z. B. mit IT-Aufgaben beauftragte Dienstleister oder Anbieter von Diensten und Inhalten, die in eine Webseite eingebunden werden, gehören. In solchen Fällen beachten wir die gesetzlichen Vorgaben und schließen insbesondere entsprechende Verträge bzw. Vereinbarungen, die dem Schutz Ihrer Daten dienen, mit den Empfängern Ihrer Daten ab.
              </p>
            </section>

            {/* Internationale Datentransfers */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Internationale Datentransfers</h2>
              <p className="text-muted-foreground mb-4">
                <strong>Datenverarbeitung in Drittländern:</strong> Sofern wir Daten in einem Drittland (d. h., außerhalb der Europäischen Union (EU), des Europäischen Wirtschaftsraums (EWR)) verarbeiten oder die Verarbeitung im Rahmen der Inanspruchnahme von Diensten Dritter oder der Offenlegung bzw. Übermittlung von Daten an andere Personen, Stellen oder Unternehmen stattfindet, erfolgt dies nur im Einklang mit den gesetzlichen Vorgaben.
              </p>
              <p className="text-muted-foreground">
                <strong>EU-US Trans-Atlantic Data Privacy Framework:</strong> Im Rahmen des sogenannten „Data Privacy Framework" (DPF) hat die EU-Kommission das Datenschutzniveau ebenfalls für bestimmte Unternehmen aus den USA im Rahmen der Angemessenheitsbeschlusses vom 10.07.2023 als sicher anerkannt. Die Liste der zertifizierten Unternehmen als auch weitere Informationen zu dem DPF können Sie der Webseite des Handelsministeriums der USA unter https://www.dataprivacyframework.gov/ (in Englisch) entnehmen.
              </p>
            </section>

            {/* Löschung von Daten */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Löschung von Daten</h2>
              <p className="text-muted-foreground">
                Die von uns verarbeiteten Daten werden nach Maßgabe der gesetzlichen Vorgaben gelöscht, sobald deren zur Verarbeitung erlaubten Einwilligungen widerrufen werden oder sonstige Erlaubnisse entfallen (z. B. wenn der Zweck der Verarbeitung dieser Daten entfallen ist oder sie für den Zweck nicht erforderlich sind). Sofern die Daten nicht gelöscht werden, weil sie für andere und gesetzlich zulässige Zwecke erforderlich sind, wird deren Verarbeitung auf diese Zwecke beschränkt. D. h., die Daten werden gesperrt und nicht für andere Zwecke verarbeitet. Das gilt z. B. für Daten, die aus handels- oder steuerrechtlichen Gründen aufbewahrt werden müssen oder deren Speicherung zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen oder zum Schutz der Rechte einer anderen natürlichen oder juristischen Person erforderlich ist.
              </p>
            </section>

            {/* Rechte der betroffenen Personen */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Rechte der betroffenen Personen</h2>
              <p className="text-muted-foreground mb-4">
                <strong>Rechte der betroffenen Personen aus der DSGVO:</strong> Ihnen stehen als Betroffene nach der DSGVO verschiedene Rechte zu, die sich insbesondere aus Art. 15 bis 21 DSGVO ergeben:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Widerspruchsrecht:</strong> Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten, die aufgrund von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, Widerspruch einzulegen.
                </li>
                <li>
                  <strong>Widerrufsrecht bei Einwilligungen:</strong> Sie haben das Recht, erteilte Einwilligungen jederzeit zu widerrufen.
                </li>
                <li>
                  <strong>Auskunftsrecht:</strong> Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob betreffende Daten verarbeitet werden und auf Auskunft über diese Daten sowie auf weitere Informationen und Kopie der Daten entsprechend den gesetzlichen Vorgaben.
                </li>
                <li>
                  <strong>Recht auf Berichtigung:</strong> Sie haben entsprechend den gesetzlichen Vorgaben das Recht, die Vervollständigung der Sie betreffenden Daten oder die Berichtigung der Sie betreffenden unrichtigen Daten zu verlangen.
                </li>
                <li>
                  <strong>Recht auf Löschung und Einschränkung der Verarbeitung:</strong> Sie haben nach Maßgabe der gesetzlichen Vorgaben das Recht, zu verlangen, dass Sie betreffende Daten unverzüglich gelöscht werden, bzw. alternativ nach Maßgabe der gesetzlichen Vorgaben eine Einschränkung der Verarbeitung der Daten zu verlangen.
                </li>
                <li>
                  <strong>Recht auf Datenübertragbarkeit:</strong> Sie haben das Recht, Sie betreffende Daten, die Sie uns bereitgestellt haben, nach Maßgabe der gesetzlichen Vorgaben in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten oder deren Übermittlung an einen anderen Verantwortlichen zu fordern.
                </li>
                <li>
                  <strong>Beschwerde bei Aufsichtsbehörde:</strong> Sie haben unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs das Recht auf Beschwerde bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthaltsorts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes, wenn Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden personenbezogenen Daten gegen die Vorgaben der DSGVO verstößt.
                </li>
              </ul>
            </section>

            {/* Einsatz von Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Einsatz von Cookies</h2>
              <p className="text-muted-foreground mb-4">
                Cookies sind kleine Textdateien, bzw. sonstige Speichervermerke, die Informationen auf Endgeräten speichern und Informationen aus den Endgeräten auslesen. Z. B. um den Login-Status in einem Nutzerkonto, einen Warenkorbinhalt in einem E-Shop, die aufgerufenen Inhalte oder verwendete Funktionen eines Onlineangebotes speichern. Cookies können ferner zu unterschiedlichen Zwecken eingesetzt werden, z. B. zu Zwecken der Funktionsfähigkeit, Sicherheit und Komfort von Onlineangeboten sowie der Erstellung von Analysen der Besucherströme.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Hinweise zur Einwilligung:</strong> Wir setzen Cookies im Einklang mit den gesetzlichen Vorschriften ein. Daher holen wir von den Nutzern eine vorhergehende Einwilligung ein, außer wenn diese gesetzlich nicht gefordert ist. Eine Einwilligung ist insbesondere nicht notwendig, wenn das Speichern und das Auslesen der Informationen, also auch von Cookies, unbedingt erforderlich sind, um dem den Nutzern einen von ihnen ausdrücklich gewünschten Telemediendienst (also unser Onlineangebot) zur Verfügung zu stellen.
              </p>
              <p className="text-muted-foreground">
                <strong>Allgemeine Hinweise zum Widerruf und Widerspruch (sog. „Opt-Out"):</strong> Nutzer können die von ihnen abgegebenen Einwilligungen jederzeit widerrufen und der Verarbeitung entsprechend den gesetzlichen Vorgaben widersprechen. Hierzu können Nutzer unter anderem die Verwendung von Cookies in den Einstellungen ihres Browsers einschränken (wobei dadurch auch die Funktionalität unseres Onlineangebotes eingeschränkt sein kann).
              </p>
            </section>

            {/* Geschäftliche Leistungen */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Geschäftliche Leistungen</h2>
              <p className="text-muted-foreground mb-4">
                Wir verarbeiten Daten unserer Vertrags- und Geschäftspartner, z. B. Kunden und Interessenten (zusammenfassend bezeichnet als „Vertragspartner") im Rahmen von vertraglichen und vergleichbaren Rechtsverhältnissen sowie damit verbundenen Maßnahmen und im Rahmen der Kommunikation mit den Vertragspartnern (oder vorvertraglich), z. B., um Anfragen zu beantworten.
              </p>
              <p className="text-muted-foreground">
                Wir verarbeiten diese Daten, um unsere vertraglichen Verpflichtungen zu erfüllen. Dazu gehören insbesondere die Verpflichtungen zur Erbringung der vereinbarten Leistungen, etwaige Aktualisierungspflichten und Abhilfe bei Gewährleistungs- und sonstigen Leistungsstörungen. Darüber hinaus verarbeiten wir die Daten zur Wahrung unserer Rechte und zum Zwecke der mit diesen Pflichten verbundenen Verwaltungsaufgaben sowie der Unternehmensorganisation.
              </p>
            </section>

            {/* Bereitstellung des Onlineangebotes und Webhosting */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Bereitstellung des Onlineangebotes und Webhosting</h2>
              <p className="text-muted-foreground mb-4">
                Wir verarbeiten die Daten der Nutzer, um ihnen unsere Online-Dienste zur Verfügung stellen zu können. Zu diesem Zweck verarbeiten wir die IP-Adresse des Nutzers, die notwendig ist, um die Inhalte und Funktionen unserer Online-Dienste an den Browser oder das Endgerät der Nutzer zu übermitteln.
              </p>
              <p className="text-muted-foreground">
                <strong>Erhebung von Zugriffsdaten und Logfiles:</strong> Der Zugriff auf unser Onlineangebot wird in Form von so genannten „Server-Logfiles" protokolliert. Zu den Serverlogfiles können die Adresse und Name der abgerufenen Webseiten und Dateien, Datum und Uhrzeit des Abrufs, übertragene Datenmengen, Meldung über erfolgreichen Abruf, Browsertyp nebst Version, das Betriebssystem des Nutzers, Referrer URL (die zuvor besuchte Seite) und im Regelfall IP-Adressen und der anfragende Provider gehören. Logfile-Informationen werden für die Dauer von maximal 30 Tagen gespeichert und danach gelöscht oder anonymisiert.
              </p>
            </section>

            {/* Kontakt- und Anfragenverwaltung */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Kontakt- und Anfragenverwaltung</h2>
              <p className="text-muted-foreground">
                Bei der Kontaktaufnahme mit uns (z. B. per Post, Kontaktformular, E-Mail, Telefon oder via soziale Medien) sowie im Rahmen bestehender Nutzer- und Geschäftsbeziehungen werden die Angaben der anfragenden Personen verarbeitet soweit dies zur Beantwortung der Kontaktanfragen und etwaiger angefragter Maßnahmen erforderlich ist.
              </p>
            </section>

            {/* Footer Note */}
            <div className="mt-12 pt-8 border-t">
              <p className="text-sm text-muted-foreground text-center">
                Bei Fragen zur Datenverarbeitung oder zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte unter{' '}
                <a href="mailto:info@dfmsolutions.de" className="text-primary hover:underline">
                  info@dfmsolutions.de
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}