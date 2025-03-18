'use client'
import MapElement from "./mapElement";
import { constituencies } from "@/lib/constituencies";
import { politicalParties } from "@/lib/politicalParties";
import { useEffect, useMemo, useRef, useState } from "react";
import ParliamentSemicircle from "./parliamentSemicircle";

const MapSemicircleContainer = () => {
  const [partyAreas, setPartyAreas] = useState<Map<string, string | null>>(new Map(constituencies.map(({ code }) => [code, null])));
  const partySeats: Map<string, number> = useMemo(() => {
    return [...partyAreas].reduce((acc, [areaCode, party]) => {

      if (party) {
        acc.set(party, (constituencies.find(({code}) => code === areaCode)?.seats || 0) + (acc.get(party) || 0));
      } else {
        acc.set('Vaccant', (constituencies.find(({code}) => code === areaCode)?.seats || 0) + (acc.get('Vaccant') || 0));
      }
      return acc;
    }, new Map<string, number>());
  }, [partyAreas]);


  const updateArea = (newId, party) => {
    setPartyAreas((prev) => {
      const newPartyAreas = new Map(prev);
      const code = constituencies.find(({ id }) => id === newId)?.code;


      if (code !== undefined) {
        newPartyAreas.set(code, party);
      }
      return newPartyAreas;
    })};

  return (
    <div className="relative flex  flex-col gap-x-2 gap-y-60 md:gap-y-20 ">
      <MapElement partyAreas={partyAreas} partySeats={partySeats} updateArea={updateArea}/>
      <div className="flex justify-center bottom-0">
        <ParliamentSemicircle partySeats={partySeats} />
      </div>
    </div>
  )
}

export default MapSemicircleContainer;