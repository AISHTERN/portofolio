/** URL berkas di folder public/, tetap benar bila situs di-host di sub-path (BASE_URL). */
export function publicUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}
