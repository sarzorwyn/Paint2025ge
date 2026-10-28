import { Decompress, strFromU8, strToU8, compressSync } from "fflate";
import { constituencies } from "../lib/constituencies";
import { maxNCMPs, politicalParties } from "../lib/politicalParties";

const MAX_ENCODED_LENGTH = 8192;
const MAX_DECODED_LENGTH = 16384;
const areaCodes = new Set(constituencies.map(({ code }) => code));
const partyNames = new Set(politicalParties.map(({ name }) => name));

type StateKind = "partyAreas" | "ncmpCount";
export function parseStateFromUrl(param: string | null, kind: "partyAreas"): Map<string, string | null> | null;
export function parseStateFromUrl(param: string | null, kind: "ncmpCount"): Map<string, number> | null;
export function parseStateFromUrl(param: string | null, kind: StateKind): Map<string, string | null | number> | null {
  if (!param || param.length > MAX_ENCODED_LENGTH) return null;

  try {
    const compressed = Uint8Array.from(atob(param), c => c.charCodeAt(0));
    const chunks: Uint8Array[] = [];
    let length = 0;
    const decoder = new Decompress((chunk) => {
      length += chunk.length;
      if (length > MAX_DECODED_LENGTH) throw new Error("State is too large");
      chunks.push(chunk);
    });
    // Small input chunks bound allocation before the output limit is checked.
    for (let offset = 0; offset < compressed.length; offset += 64) {
      decoder.push(compressed.subarray(offset, offset + 64), offset + 64 >= compressed.length);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const parsed: unknown = JSON.parse(strFromU8(bytes));
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;

    const map = new Map<string, string | null | number>();
    let totalNCMPs = 0;
    for (const [key, value] of Object.entries(parsed)) {
      if (kind === "partyAreas") {
        if (!areaCodes.has(key) || (value !== null && (typeof value !== "string" || !partyNames.has(value)))) return null;
      } else {
        if (!partyNames.has(key) || typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > maxNCMPs) return null;
        totalNCMPs += value;
        if (totalNCMPs > maxNCMPs) return null;
      }
      map.set(key, value as string | null | number);
    }
    return map;
  } catch {
    return null;
  }
}

export const getStateQuery = (partyAreas: Map<string, string | null>, ncmpCount: Map<string, number>) => {
    const encodeState = (state: Map<string, string | null | number>) => {
      const jsonString = JSON.stringify(Object.fromEntries(state));
      const compressed = compressSync(strToU8(jsonString));
      return btoa(String.fromCharCode(...compressed));
    };
    const query = new URLSearchParams();
    if (partyAreas && Array.from(partyAreas.values()).some(value => value !== null)) {
      query.set("partyAreas", encodeState(partyAreas));
    }
    if (ncmpCount && Array.from(ncmpCount.values()).some(value => value > 0)) {
      query.set("ncmpCount", encodeState(ncmpCount));
    }
    return query;
};
