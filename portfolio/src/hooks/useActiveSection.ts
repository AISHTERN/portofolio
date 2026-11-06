import { useEffect, useState } from "react";

/** Section paling atas (menurut urutan halaman) di antara yang sedang terlihat. */
export function pickActiveId(
  ids: readonly string[],
  visible: ReadonlySet<string>,
): string | null {
  return ids.find((id) => visible.has(id)) ?? null;
}

/**
 * Mengembalikan id section yang sedang melewati area tengah layar.
 * `ids` harus berupa referensi stabil (mis. konstanta modul).
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setActiveId(pickActiveId(ids, visible));
      },
      // Pita tipis di sekitar tengah layar: hanya satu section yang "aktif".
      { rootMargin: "-40% 0px -55% 0px" },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
