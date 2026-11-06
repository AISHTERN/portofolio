import type { Localized } from "../i18n/types";
import { PROFILE } from "./profile";

// Sumber: "RINGKASAN PROFESIONAL" di CV. Terjemahan Inggris perlu di-review pemilik.
export const ABOUT_PARAGRAPHS: readonly Localized[] = [
  {
    id: "Saya lulusan baru S1 Teknik Informatika Universitas Mercu Buana yang telah menuntaskan seluruh kewajiban akademik dan kini menunggu penerbitan ijazah. Saya tersertifikasi BNSP sebagai Software Engineer dan memegang Google AI Professional Certificate.",
    en: "I am a recent graduate in Informatics Engineering from Universitas Mercu Buana. I have completed all academic requirements and am awaiting the issuance of my diploma. I am BNSP-certified as a Software Engineer and hold the Google AI Professional Certificate.",
  },
  {
    id: "Keahlian saya mencakup pengembangan web Full Stack, optimasi SEO, rekayasa prompt dan integrasi AI, pengolahan data, serta infrastruktur IT dan deployment hardware. Saya berpengalaman merancang web responsif dengan Laravel dan Vue.js, mengonfigurasi RESTful API, mengelola situs, serta melakukan OS imaging dan staging perangkat.",
    en: "My skills span full-stack web development, SEO optimization, prompt engineering and AI integration, data processing, and IT infrastructure and hardware deployment. I have built responsive websites with Laravel and Vue.js, configured RESTful APIs, managed websites, and handled OS imaging and device staging.",
  },
];

export type AboutFact = { id: string; label: Localized; value: Localized };

export const ABOUT_FACTS: readonly AboutFact[] = [
  {
    id: "location",
    label: { id: "Lokasi", en: "Location" },
    value: PROFILE.location,
  },
  {
    id: "education",
    label: { id: "Pendidikan", en: "Education" },
    value: {
      id: "S1 Teknik Informatika, Universitas Mercu Buana",
      en: "Bachelor's in Informatics Engineering, Universitas Mercu Buana",
    },
  },
  {
    id: "focus",
    label: { id: "Fokus", en: "Focus" },
    value: {
      id: "Web Full Stack, SEO, AI, dan infrastruktur IT",
      en: "Full-stack web, SEO, AI, and IT infrastructure",
    },
  },
  {
    id: "availability",
    label: { id: "Ketersediaan", en: "Availability" },
    value: PROFILE.availability,
  },
];
