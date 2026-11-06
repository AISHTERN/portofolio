import { useState } from "react";
import { CERTIFICATES, certificateAssets } from "../../data/certificates";
import { useLang } from "../../i18n/context";
import { formatDate } from "../../lib/date";
import { ImageLightbox, type LightboxImage } from "../ui/ImageLightbox";
import { ExpandIcon } from "../ui/icons";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

const RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const TEXT_LINK = `rounded-full px-2 py-1 text-sm font-semibold text-accent hover:underline ${RING}`;

export function Certificates() {
  const { t, lang } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const verifyLabel = t({ id: "Verifikasi", en: "Verify" });
  const pdfLabel = t({ id: "Buka PDF", en: "Open PDF" });

  const images: LightboxImage[] = CERTIFICATES.map((certificate) => {
    const assets = certificateAssets(certificate.id);
    const title = t(certificate.title);
    return {
      src: assets.full,
      alt: t({
        id: `Sertifikat ${title} dari ${certificate.issuer}`,
        en: `${title} certificate from ${certificate.issuer}`,
      }),
      caption: `${certificate.issuer} · ${formatDate(certificate.date, lang)}`,
      links: [
        ...(certificate.verifyUrl ? [{ label: verifyLabel, href: certificate.verifyUrl }] : []),
        { label: pdfLabel, href: assets.pdf },
      ],
    };
  });

  return (
    <section
      id="certificates"
      aria-labelledby="certificates-title"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <Reveal>
        <SectionHeading
          id="certificates-title"
          eyebrow={t({ id: "Pelatihan & Sertifikasi", en: "Training & Certification" })}
          title={t({ id: "Sertifikat", en: "Certificates" })}
          description={t({
            id: "Sertifikat yang saya peroleh. Klik gambar untuk melihat versi besar, atau verifikasi langsung di penerbitnya.",
            en: "Certificates I have earned. Click an image to view it full size, or verify it directly with the issuer.",
          })}
        />
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATES.map((certificate, index) => {
          const assets = certificateAssets(certificate.id);
          const title = t(certificate.title);
          return (
            <Reveal key={certificate.id} delay={index * 0.08} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-soft">
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={t({
                    id: `Lihat sertifikat ${title}`,
                    en: `View ${title} certificate`,
                  })}
                  className={`group relative block aspect-[4/3] w-full overflow-hidden border-b border-line bg-canvas ${RING}`}
                >
                  <img
                    src={assets.thumb}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-surface/90 text-ink shadow-soft"
                  >
                    <ExpandIcon />
                  </span>
                </button>

                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="font-display text-lg font-semibold leading-snug text-ink">
                    {title}
                  </h3>
                  <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
                    <span>{certificate.issuer}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={certificate.date}>{formatDate(certificate.date, lang)}</time>
                  </p>
                  <p className="text-sm leading-relaxed text-muted">{t(certificate.description)}</p>

                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    {certificate.verifyUrl && (
                      <a
                        href={certificate.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={TEXT_LINK}
                      >
                        {verifyLabel}
                      </a>
                    )}
                    <a
                      href={assets.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={TEXT_LINK}
                    >
                      {pdfLabel}
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <ImageLightbox
        images={images}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
      />
    </section>
  );
}
