import { decompressSync, strFromU8, strToU8, compressSync } from "fflate";

const isValidKey = (key: string) => /^[a-zA-Z0-9_-]+$/.test(key);

export const parseStateFromUrl = (param: string | null, init: any[]) => {
    if (!param) return new Map(init);
  
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

export const getStateQuery = (partyAreas: Map<string, string | null>, ncmpCount: Map<string, number>) => {
    const encodeState = (state: Map<string, string | null | number>) => {
      const jsonString = JSON.stringify(Object.fromEntries(state));
      const compressed = compressSync(strToU8(jsonString));

      return btoa(String.fromCharCode(...compressed));
    };

    const query = new URLSearchParams();
    if (Array.from(partyAreas.values()).some(value => value !== null)) {
      query.set("partyAreas", encodeState(partyAreas));
    }

    if (Array.from(ncmpCount.values()).some(value => value > 0)) {
      query.set("ncmpCount", encodeState(ncmpCount!));
    }

    return query;
  }