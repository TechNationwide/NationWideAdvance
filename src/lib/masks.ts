export const masks = {
  ein: (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 9);
    return d.length > 2 ? `${d.slice(0, 2)}-${d.slice(2)}` : d;
  },
  ssn: (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 9);
    if (d.length > 5) return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
    if (d.length > 3) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return d;
  },
  phone: (v: string) => {
    const d = v.replace(/\D/g, "").replace(/^1/, "").slice(0, 10);
    if (d.length > 6) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    if (d.length > 3) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return d;
  },
  zip: (v: string) => v.replace(/\D/g, "").slice(0, 5),
};

export type MaskKey = keyof typeof masks;

export function maskSsn(v: string) {
  return v ? `•••-••-${v.replace(/\D/g, "").slice(-4)}` : "";
}

export function maskEin(v: string) {
  const d = v.replace(/\D/g, "");
  return d ? `••-•••${d.slice(-4)}` : "";
}
