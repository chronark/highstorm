export type FlatObject = Record<string, number | string | boolean | null>;

export function flatten(obj: Record<string, unknown>, prefix = ""): FlatObject {
  const flattened: FlatObject = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      Object.assign(flattened, flatten(value as any, newKey));
    } else {
      flattened[newKey] = value as any;
    }
  }
  return flattened;
}
