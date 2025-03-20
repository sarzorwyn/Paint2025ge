import { decompressSync, strFromU8 } from "fflate";

const isValidKey = (key: string) => /^[a-zA-Z0-9_-]+$/.test(key);

export const parseStateFromUrl = (param: string | null, init: any[]) => {
    if (!param) return new Map();
  
    try {
      const decodedBytes = decompressSync(Uint8Array.from(atob(param), c => c.charCodeAt(0)));
      const decodedStr = strFromU8(decodedBytes);
      const parsed = JSON.parse(decodedStr);
  
      if (typeof parsed !== "object" || parsed === null) return new Map(init);
  
      const map = new Map<string, string | null | number>();
  
      Object.entries(parsed).forEach(([key, value]) => {
        if (isValidKey(key)) {
          if (typeof value === "string" || value === null || typeof value === "number") {
            map.set(key, value);
          }
        }
      });
  
      return map;
    } catch {
      return new Map(init);
    }
  };