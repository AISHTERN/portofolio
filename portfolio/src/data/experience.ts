import { same } from "../i18n/helpers";
import type { Localized } from "../i18n/types";

export type Experience = {
  id: string;
  company: string;
  role: Localized;
  /** CV tidak mencantumkan tanggal; hanya durasi/jenis bila ada. */
  period?: Localized;
  location: Localized;
  highlights: readonly Localized[];
};

const JAKARTA = same("Jakarta, Indonesia");

// Sumber: "PENGALAMAN KERJA" di CV, urutan sama dengan CV.
export const EXPERIENCES: readonly Experience[] = [
  {
    id: "global-alfa-solusindo",
    company: "PT Global Alfa Solusindo",
    role: same("IT Hardware & Deployment Specialist"),
    period: { id: "Freelance · 6 bulan", en: "Freelance · 6 months" },
    location: JAKARTA,
    highlights: [
      {
        id: "Melakukan staging dan deployment perangkat PC/laptop dalam jumlah besar untuk memastikan kesiapan operasional sesuai standar teknis.",
        en: "Staged and deployed PCs and laptops in large quantities to ensure operational readiness to technical standards.",
      },
      {
        id: "Menjalankan instalasi dan standardisasi sistem operasi melalui teknik OS imaging serta konfigurasi software pendukung.",
        en: "Installed and standardized operating systems through OS imaging and configured supporting software.",
      },
      {
        id: "Melakukan instalasi dan upgrade komponen hardware (RAM, SSD/HDD), uji kelayakan (hardware QA testing), serta troubleshooting.",
        en: "Installed and upgraded hardware components (RAM, SSD/HDD), ran hardware QA testing, and troubleshot issues.",
      },
    ],
  },
  {
    id: "bogajaya-sukses-abadi",
    company: "PT Bogajaya Sukses Abadi",
    role: same("IT Support & Web Specialist"),
    location: JAKARTA,
    highlights: [
      {
        id: "Merancang, mengembangkan, dan memelihara website resmi perusahaan agar responsif, cepat diakses, dan aman.",
        en: "Designed, developed, and maintained the company's official website to keep it responsive, fast, and secure.",
      },
      {
        id: "Menerapkan strategi SEO On-Page dan Technical serta pengelolaan konten berkala untuk meningkatkan visibilitas dan trafik organik di mesin pencari.",
        en: "Applied On-Page and Technical SEO strategies and regular content management to increase visibility and organic search traffic.",
      },
      {
        id: "Mengelola dan mengolah data transaksi operasional lewat SQL dan spreadsheet, serta menangani IT support harian, troubleshooting hardware/software, dan jaringan LAN.",
        en: "Managed and processed operational transaction data with SQL and spreadsheets, and handled daily IT support, hardware/software troubleshooting, and LAN networking.",
      },
    ],
  },
  {
    id: "credibug-partner-solutions",
    company: "CV. Credibug Partner Solutions",
    role: same("Full Stack Developer Intern"),
    period: { id: "Magang", en: "Internship" },
    location: JAKARTA,
    highlights: [
      {
        id: "Mengembangkan antarmuka pengguna (UI) responsif untuk aplikasi web klien serta merancang struktur database relasional dan RESTful API.",
        en: "Built responsive user interfaces for client web applications and designed relational database structures and RESTful APIs.",
      },
      {
        id: "Mengimplementasikan logika bisnis sisi server dengan framework Laravel serta melakukan debugging dan optimasi performa kode.",
        en: "Implemented server-side business logic with the Laravel framework and handled debugging and code performance optimization.",
      },
    ],
  },
];
