import type { ReactNode } from "react";
import { SiGithub } from "react-icons/si";
import { PROFILE } from "../../data/profile";
import { useContactLinks } from "../../hooks/useContactLinks";
import { useLang } from "../../i18n/context";
import { Button } from "../ui/Button";
import { ChatIcon, DownloadIcon, MailIcon, PinIcon } from "../ui/icons";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

type ContactCard = {
  id: string;
  label: string;
  value: string;
  icon: ReactNode;
  href?: string;
  external?: boolean;
};

const RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const CARD =
  "flex items-center gap-4 rounded-card border border-line bg-surface p-5 shadow-soft";

export function Contact() {
  const { t } = useLang();
  const links = useContactLinks();
  const cv = t(PROFILE.cv);

  const cards: ContactCard[] = [
    { id: "email", label: "Email", value: PROFILE.email, icon: <MailIcon />, href: links.email },
    {
      id: "whatsapp",
      label: "WhatsApp",
      value: PROFILE.phoneDisplay,
      icon: <ChatIcon />,
      href: links.whatsapp,
      external: true,
    },
    {
      id: "github",
      label: "GitHub",
      value: `github.com/${PROFILE.github.handle}`,
      icon: <SiGithub aria-hidden="true" className="h-[18px] w-[18px]" />,
      href: PROFILE.github.url,
      external: true,
    },
    {
      id: "location",
      label: t({ id: "Lokasi", en: "Location" }),
      value: t(PROFILE.location),
      icon: <PinIcon />,
    },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <Reveal>
        <div className="rounded-[2rem] border border-line bg-accent-soft p-8 sm:p-12">
          <SectionHeading
            id="contact-title"
            eyebrow={t({ id: "Hubungi Saya", en: "Get in Touch" })}
            title={t({ id: "Kontak", en: "Contact" })}
            description={t({
              id: "Tertarik berkolaborasi atau punya peluang kerja? Hubungi saya lewat WhatsApp atau email, atau unduh CV saya.",
              en: "Interested in working together or have an opportunity? Reach me on WhatsApp or by email, or download my CV.",
            })}
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={links.whatsapp} external icon={<ChatIcon />}>
              {t({ id: "Chat WhatsApp", en: "Chat on WhatsApp" })}
            </Button>
            <Button href={links.email} variant="secondary" icon={<MailIcon />}>
              {t({ id: "Kirim Email", en: "Send Email" })}
            </Button>
            <Button
              href={cv.href}
              download={cv.fileName}
              variant="ghost"
              icon={<DownloadIcon />}
            >
              {t({ id: "Unduh CV", en: "Download CV" })}
            </Button>
          </div>
        </div>
      </Reveal>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => {
          const content = (
            <>
              <span
                aria-hidden="true"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent"
              >
                {card.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-widest text-muted">
                  {card.label}
                </span>
                <span className="block break-words font-medium text-ink">{card.value}</span>
              </span>
            </>
          );

          return (
            <li key={card.id}>
              <Reveal delay={index * 0.06} className="h-full">
                {card.href ? (
                  <a
                    href={card.href}
                    {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={`${CARD} transition-colors hover:border-accent ${RING}`}
                  >
                    {content}
                  </a>
                ) : (
                  <div className={CARD}>{content}</div>
                )}
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
