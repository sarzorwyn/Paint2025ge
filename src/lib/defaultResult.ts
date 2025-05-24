import { constituencies } from "./constituencies";

export const getDefaultAreaResult = () => {
  const defaultResult = new Map<string, string | null>(
	constituencies.map(({ code }) => [code, "PAP"])
  );
  defaultResult.set("SK", "WP");
  defaultResult.set("AJ", "WP");
  defaultResult.set("HG", "WP");

  return defaultResult;
};

export const getDefaultNCMPResult = () => {
  const defaultResult = new Map<string, number>();

  defaultResult.set("WP", 2);
  return defaultResult;
};