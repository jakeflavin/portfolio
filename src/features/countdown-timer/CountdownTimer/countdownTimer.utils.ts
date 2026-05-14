export interface TimeParts {
  h: number;
  m: number;
  s: number;
}

export function toTotalSeconds(h: number, m: number, s: number): number {
  return h * 3600 + m * 60 + s;
}

export function fromTotalSeconds(total: number): TimeParts {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { h, m, s };
}

export function padTimePart(value: number): string {
  return value.toString().padStart(2, "0");
}
