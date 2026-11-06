import photoLarge from "../../assets/profile-800.webp";
import photoSmall from "../../assets/profile-480.webp";
import { HERO_FLOATING_ICONS } from "../../data/floatingIcons";
import { PROFILE } from "../../data/profile";
import { getSkill } from "../../data/skills";
import { useContactLinks } from "../../hooks/useContactLinks";
import { useLang } from "../../i18n/context";
import { Button } from "../ui/Button";
import { FloatingIcon } from "../ui/FloatingIcon";
import { ChatIcon, DownloadIcon, MailIcon } from "../ui/icons";
import { Reveal } from "../ui/Reveal";

// Ukuran asli profile-800.webp; dipakai agar browser memesan ruang sebelum gambar dimuat.
const PHOTO_WIDTH = 800;
const PHOTO_HEIGHT = 1067;

export function Hero() {
  const { t } = useLang();
  const links = useContactLinks();
  const cv = t(PROFILE.cv);

  return (
    <section
      id="home"
      className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl overflow-x-clip items-center gap-12 px-6 py-16 md:grid-cols-[1.1fr_0.9fr]"
    >
      <Reveal className="flex flex-col items-start gap-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          {t({
            id: "Selamat datang di portofolio saya",
            en: "Welcome to my portfolio",
          })}
        </p>

        <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-6xl">
          {PROFILE.name}
        </h1>

        <p className="text-lg font-medium text-ink/80 sm:text-xl">{PROFILE.role}</p>

        <p className="max-w-xl text-base leading-relaxed text-muted">
          {t(PROFILE.summary)}
        </p>

        <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-1.5 text-sm font-medium text-accent">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
          {t(PROFILE.availability)}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            href={links.whatsapp}
            external
            icon={<ChatIcon />}
          >
            {t({ id: "Chat WhatsApp", en: "Chat on WhatsApp" })}
          </Button>
          <Button
            href={links.email}
            variant="secondary"
            icon={<MailIcon />}
          >
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
      </Reveal>

      <Reveal delay={0.15} className="relative mx-auto w-full max-w-sm md:max-w-md">
        {/* Latar lembut di belakang foto. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rotate-3 rounded-[2rem] bg-accent-soft"
        />
        <img
          src={photoLarge}
          srcSet={`${photoSmall} 480w, ${photoLarge} 800w`}
          sizes="(min-width: 768px) 448px, 384px"
          width={PHOTO_WIDTH}
          height={PHOTO_HEIGHT}
          alt={t(PROFILE.photoAlt)}
          decoding="async"
          className="h-auto w-full rounded-[2rem] object-cover shadow-soft ring-1 ring-line"
        />

        <div
          role="group"
          aria-label={t({ id: "Teknologi yang saya gunakan", en: "Technologies I use" })}
        >
          {HERO_FLOATING_ICONS.map((spec) => {
            const skill = getSkill(spec.skillId);
            return (
              <FloatingIcon
                key={spec.skillId}
                icon={skill.icon}
                color={skill.color}
                label={t(skill.label)}
                delay={spec.delay}
                duration={spec.duration}
                className={spec.position}
              />
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
