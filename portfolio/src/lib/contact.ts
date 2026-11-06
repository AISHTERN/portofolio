/** Ubah nomor lokal/internasional apa pun menjadi digit internasional (default Indonesia, 62). */
export function toInternationalPhone(phone: string, countryCode = "62"): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) throw new Error(`Invalid phone number: "${phone}"`);

  if (digits.startsWith(countryCode)) return digits;
  if (digits.startsWith("0")) return countryCode + digits.slice(1);
  return digits;
}

export function buildWhatsAppUrl(phone: string, message?: string): string {
  const base = `https://wa.me/${toInternationalPhone(phone)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function buildMailtoUrl(email: string, subject?: string, body?: string): string {
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return params.length ? `mailto:${email}?${params.join("&")}` : `mailto:${email}`;
}
