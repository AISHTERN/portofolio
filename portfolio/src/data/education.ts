import { same } from "../i18n/helpers";
import type { Localized } from "../i18n/types";

export type Education = {
  id: string;
  institution: string;
  program: Localized;
  /** Format "2022 – 2026" (en dash). */
  years: string;
  note?: Localized;
  location: Localized;
};

const JAKARTA = same("Jakarta, Indonesia");

// Sumber: "PENDIDIKAN" di CV.
export const EDUCATION: readonly Education[] = [
  {
    id: "universitas-mercu-buana",
    institution: "Universitas Mercu Buana",
    program: {
      id: "S1 Teknik Informatika",
      en: "Bachelor's in Informatics Engineering",
    },
    years: "2022 – 2026",
    note: {
      id: "Lulus, menunggu penerbitan ijazah",
      en: "Graduated, diploma pending",
    },
    location: JAKARTA,
  },
  {
    id: "smkn-56-jakarta",
    institution: "SMKN 56 Jakarta",
    program: {
      id: "Teknik Komputer dan Jaringan (TKJ)",
      en: "Computer and Network Engineering (TKJ)",
    },
    years: "2019 – 2022",
    location: JAKARTA,
  },
];
