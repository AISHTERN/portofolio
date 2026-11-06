export type FloatingIconSpec = {
  /** Mengacu ke id di data/skills.ts. */
  skillId: string;
  /** Kelas Tailwind posisi (tanpa translate: animasi memakai transform). */
  position: string;
  /** Detik. Dibedakan per ikon agar gerakannya tidak seragam. */
  delay: number;
  duration: number;
};

// 8 ikon (batas 10) di sekeliling foto hero.
export const HERO_FLOATING_ICONS: readonly FloatingIconSpec[] = [
  { skillId: "react", position: "absolute left-0 top-[8%] -ml-3 md:-ml-6", delay: 0, duration: 4.2 },
  { skillId: "laravel", position: "absolute right-0 top-[24%] -mr-3 md:-mr-5", delay: 0.6, duration: 4.8 },
  { skillId: "vuejs", position: "absolute left-0 top-[46%] -ml-3 md:-ml-7", delay: 1.2, duration: 5 },
  { skillId: "javascript", position: "absolute right-0 top-[64%] -mr-3 md:-mr-5", delay: 0.3, duration: 4.4 },
  { skillId: "python", position: "absolute bottom-0 left-[10%] -mb-3", delay: 0.9, duration: 4.6 },
  { skillId: "mysql", position: "absolute bottom-0 right-[12%] -mb-4", delay: 1.5, duration: 5.2 },
  { skillId: "figma", position: "absolute right-[16%] top-0 -mt-3", delay: 0.4, duration: 4.1 },
  { skillId: "git", position: "absolute left-[26%] top-0 -mt-4", delay: 1.1, duration: 4.9 },
];
