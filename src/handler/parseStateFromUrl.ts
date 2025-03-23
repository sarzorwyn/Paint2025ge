import { decompressSync, strFromU8, strToU8, compressSync } from "fflate";

const isValidKey = (key: string) => /^[a-zA-Z0-9_-]+$/.test(key);

interface InitEntry {
  [key: string]: string | null | number;
}

export const parseStateFromUrl = <T>(param: string | null, init: [string, T][]): Map<string, T> => {
  if (!param) return new Map(init);

  try {
    const decodedBytes: Uint8Array = decompressSync(Uint8Array.from(atob(param), c => c.charCodeAt(0)));
    const decodedStr: string = strFromU8(decodedBytes);
    const parsed: InitEntry = JSON.parse(decodedStr);

    if (typeof parsed !== "object" || parsed === null) return new Map(init);

    const map: Map<string, T> = new Map<string, T>();

    Object.entries(parsed).forEach(([key, value]) => {
      if (isValidKey(key)) {
        if (typeof value === "string" || value === null || typeof value === "number") {
          map.set(key, value as T);
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