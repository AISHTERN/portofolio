import { PROFILE } from "../data/profile";
import { useLang } from "../i18n/context";
import { buildMailtoUrl, buildWhatsAppUrl } from "../lib/contact";

/** Satu sumber tautan WhatsApp/email (Hero, Kontak, Footer) agar selalu sama dan sesuai bahasa. */
export function useContactLinks() {
  const { t } = useLang();

  return {
    whatsapp: buildWhatsAppUrl(PROFILE.phone, t(PROFILE.whatsappMessage)),
    email: buildMailtoUrl(PROFILE.email, t(PROFILE.emailSubject)),
  };
}
