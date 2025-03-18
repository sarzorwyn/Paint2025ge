"use client";
import MapElement from "./mapElement";
import { constituencies } from "@/lib/constituencies";
import { useMemo, useState } from "react";
import ParliamentSemicircle from "./parliamentSemicircle";
import PartySeatTable from "./partySeatTable";

const MapSemicircleContainer = () => {
  const [partyAreas, setPartyAreas] = useState<Map<string, string | null>>(
    new Map(constituencies.map(({ code }) => [code, null]))
  );
  const partySeats: Map<string, number> = useMemo(() => {
    return new Map([...[...partyAreas].reduce((acc, [areaCode, party]) => {
      if (party) {
        acc.set(
          party,
          (constituencies.find(({ code }) => code === areaCode)?.seats || 0) +
            (acc.get(party) || 0)
        );
      } else {
        acc.set(
          "Vaccant",
          (constituencies.find(({ code }) => code === areaCode)?.seats || 0) +
            (acc.get("Vaccant") || 0)
        );
      }
      return acc;
    }, new Map<string, number>()).entries()].sort((a, b) => b[1] - a[1]));
  }, [partyAreas]);

  const updateArea = (newId, party) => {
    setPartyAreas((prev) => {
      const newPartyAreas = new Map(prev);
      const code = constituencies.find(({ id }) => id === newId)?.code;

      if (code !== undefined) {
        newPartyAreas.set(code, party);
      }
      return newPartyAreas;
    });
  };

  return (
    <div className="relative flex  max-w-5xl w-full mx-auto flex-col gap-x-2 gap-y-40 sm:gap-y-45 md:gap-y-20 ">

      <div className="h-[37rem] max-md:h-[26rem] max-md:min-h-[26rem]  xl:flex-row">      <MapElement
        partyAreas={partyAreas}
        partySeats={partySeats}
        updateArea={updateArea}
      /></div>
      <div className="flex justify-center pt-20 md:pt-10">
        <ParliamentSemicircle partySeats={partySeats} />
      </div>

      <div className="flex justify-center md:my-8 md:pt-20">
        <PartySeatTable partySeats={partySeats} />
      </div>
    </div>
  );
};

export default MapSemicircleContainer;
