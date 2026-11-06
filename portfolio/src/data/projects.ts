import type { Localized } from "../i18n/types";

export type ProjectTech = {
  name: string;
  /** Id di data/skills.ts, agar chip memakai logo yang sama. */
  skillId?: string;
};

export type Project = {
  id: string;
  title: string;
  category: Localized;
  description: Localized;
  tech: readonly ProjectTech[];
  /** Isi bila sudah ada tautan; tombol hanya muncul untuk tautan yang terisi. */
  links?: { demo?: string; repo?: string };
};

// Sumber: bagian "PROYEK & PORTOFOLIO" di CV. Tautan demo/repo belum ada.
export const PROJECTS: readonly Project[] = [
  {
    id: "virtual-assistant-chatbot-3d",
    title: "Virtual Assistant Chatbot 3D",
    category: { id: "Integrasi AI & Web 3D", en: "AI & 3D Web Integration" },
    description: {
      id: "Asisten virtual 3D interaktif berbasis web (Embodied Conversational Agent) yang memakai React Three Fiber / Three.js dan integrasi AI untuk layanan informasi akademik yang responsif.",
      en: "An interactive web-based 3D virtual assistant (Embodied Conversational Agent) built with React Three Fiber / Three.js and AI integration to deliver responsive academic information services.",
    },
    tech: [
      { name: "React", skillId: "react" },
      { name: "Three.js", skillId: "threejs" },
      { name: "React Three Fiber" },
      { name: "AI Integration" },
    ],
  },
  {
    id: "oh-my-cake",
    title: "Oh My Cake",
    category: { id: "Pengembangan Web", en: "Web Development" },
    description: {
      id: "Platform toko online toko kue lengkap berbasis Laravel dan MySQL, dengan katalog produk interaktif, keranjang belanja, dan manajemen transaksi.",
      en: "A full-featured online cake shop platform built with Laravel and MySQL, featuring an interactive product catalog, a shopping cart, and transaction management.",
    },
    tech: [
      { name: "Laravel", skillId: "laravel" },
      { name: "MySQL", skillId: "mysql" },
    ],
  },
];
