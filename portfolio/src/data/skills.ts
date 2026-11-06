import type { IconType } from "react-icons";
import { FaCss3Alt } from "react-icons/fa";
import {
  SiFigma,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiMysql,
  SiPhp,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiReact,
  SiThreedotjs,
  SiVuedotjs,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import type { Localized } from "../i18n/types";

export type Skill = {
  id: string;
  label: Localized;
  /** Logo teknologi. Skill tanpa logo tampil sebagai chip teks. */
  icon?: IconType;
  /** Warna merek untuk logo (hex). */
  color?: string;
};

export type SkillCategory = {
  id: string;
  title: Localized;
  skills: readonly Skill[];
};

/** Istilah teknis yang sama di kedua bahasa. */
const same = (text: string): Localized => ({ id: text, en: text });

// Sumber: bagian "KEAHLIAN UTAMA" di CV, ditambah Three.js dari bagian proyek.
export const SKILL_CATEGORIES: readonly SkillCategory[] = [
  {
    id: "ai",
    title: { id: "AI & Pengembangan", en: "AI & Development" },
    skills: [
      { id: "generative-ai", label: same("Generative AI") },
      { id: "prompt-engineering", label: same("Prompt Engineering") },
      {
        id: "ai-app-building",
        label: {
          id: "Pembuatan & Deployment Aplikasi dengan AI",
          en: "App Building & Deployment with AI",
        },
      },
      {
        id: "ai-data-analysis",
        label: { id: "Analisis Data dengan AI", en: "Data Analysis with AI" },
      },
    ],
  },
  {
    id: "web",
    title: { id: "Pemrograman & Web", en: "Programming & Web" },
    skills: [
      { id: "php", label: same("PHP"), icon: SiPhp, color: "#777BB4" },
      { id: "laravel", label: same("Laravel"), icon: SiLaravel, color: "#FF2D20" },
      { id: "javascript", label: same("JavaScript"), icon: SiJavascript, color: "#E8B800" },
      { id: "vuejs", label: same("Vue.js"), icon: SiVuedotjs, color: "#4FC08D" },
      { id: "react", label: same("React"), icon: SiReact, color: "#149ECA" },
      { id: "threejs", label: same("Three.js"), icon: SiThreedotjs, color: "#16181D" },
      { id: "python", label: same("Python"), icon: SiPython, color: "#3776AB" },
      { id: "html5", label: same("HTML5"), icon: SiHtml5, color: "#E34F26" },
      { id: "css3", label: same("CSS3"), icon: FaCss3Alt, color: "#1572B6" },
      { id: "rest-api", label: same("RESTful API") },
      {
        id: "seo",
        label: { id: "Optimasi SEO", en: "SEO Optimization" },
      },
    ],
  },
  {
    id: "data",
    title: { id: "Data & Database", en: "Data & Database" },
    skills: [
      { id: "sql", label: same("SQL") },
      { id: "mysql", label: same("MySQL"), icon: SiMysql, color: "#4479A1" },
      { id: "postgresql", label: same("PostgreSQL"), icon: SiPostgresql, color: "#4169E1" },
      {
        id: "data-processing",
        label: {
          id: "Pengolahan & Manajemen Data",
          en: "Data Processing & Management",
        },
      },
      { id: "spreadsheet", label: same("Spreadsheet") },
    ],
  },
  {
    id: "hardware",
    title: { id: "Hardware & Jaringan", en: "Hardware & Network" },
    skills: [
      {
        id: "pc-assembly",
        label: {
          id: "Perakitan PC & Upgrade RAM",
          en: "PC Assembly & RAM Upgrades",
        },
      },
      { id: "os-imaging", label: same("OS Imaging") },
      {
        id: "device-staging",
        label: { id: "Staging Perangkat", en: "Device Staging" },
      },
      { id: "troubleshooting", label: same("Troubleshooting") },
      {
        id: "lan-installation",
        label: { id: "Instalasi LAN", en: "LAN Installation" },
      },
    ],
  },
  {
    id: "tools",
    title: { id: "Tools", en: "Tools" },
    skills: [
      { id: "git", label: same("Git"), icon: SiGit, color: "#F05032" },
      { id: "github", label: same("GitHub"), icon: SiGithub, color: "#16181D" },
      { id: "vscode", label: same("VS Code"), icon: VscVscode, color: "#007ACC" },
      { id: "figma", label: same("Figma (UI/UX)"), icon: SiFigma, color: "#F24E1E" },
      { id: "postman", label: same("Postman"), icon: SiPostman, color: "#FF6C37" },
    ],
  },
];

export const SKILL_BY_ID: Readonly<Record<string, Skill>> = Object.fromEntries(
  SKILL_CATEGORIES.flatMap((category) => category.skills).map((skill) => [skill.id, skill]),
);

export function getSkill(id: string): Skill {
  const skill = SKILL_BY_ID[id];
  if (!skill) throw new Error(`Unknown skill id: "${id}"`);
  return skill;
}
