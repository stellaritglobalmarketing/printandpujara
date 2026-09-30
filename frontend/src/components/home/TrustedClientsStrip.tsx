import { Container } from "@/components/ui/Container";
import type { HomeClient } from "@/services/homeService";
import { ClientMarquee } from "./ClientMarquee";

// Client logo strip straight under the hero; the homepage's only client list.
export function TrustedClientsStrip({ clients }: { clients: HomeClient[] | null }) {
  if (!clients?.length) return null;
  return <section className="trusted-strip" aria-labelledby="trusted-strip-heading">
    <Container>
      <div className="trusted-strip-head">
        <h2 id="trusted-strip-heading">Trusted by leading brands across India</h2>
      </div>
      <ClientMarquee clients={clients} limit={16} />
    </Container>
  </section>;
}
