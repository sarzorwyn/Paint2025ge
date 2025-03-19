import { politicalParties } from "@/lib/politicalParties";

export const getPartyColor = (party: string | null) => (politicalParties.find((polParty) => polParty.name === party)?.color)

export const getHexPartyColor = (party: string | null) => {
  return (
    getPartyColor(party)?.hex ||
    "#e0e0ff"
  );
};

export const getHoverColor = (selectedParty: string | null, hoverId: string | null, partyAreas: Map<string, string>) => {
  return getPartyColor(selectedParty)?.BorderLColor 
  || getPartyColor(partyAreas.get(hoverId))?.BorderLColor
  || "bg-gray-300";
}

export const getTablePartyColor = (party: string | null) => {
  return getPartyColor(party)?.BorderLColor
  || "border-l-gray-300";
}