import { constituencies } from "./constituencies";

export const getDefaultResult = () => {
  const defaultResult = new Map<string, string | null>(
	constituencies.map(({ code }) => [code, null])
  );
  defaultResult.set("MH", "PAP");
  return defaultResult;
};