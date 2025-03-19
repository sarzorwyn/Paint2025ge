"use client";
import MapElement from "./mapElement";
import { constituencies } from "@/lib/constituencies";
import { useMemo, useState } from "react";
import ParliamentSemicircle from "./parliamentSemicircle";
import PartySeatTable from "./partySeatTable";
import { politicalParties } from "@/lib/politicalParties";

const MapSemicircleContainer = () => {
  const [partyAreas, setPartyAreas] = useState<Map<string, string | null>>(
    new Map(constituencies.map(({ code }) => [code, null]))
  );
  const [ncmpCount, setNcmpCount] = useState<Map<string, number>>();
  const partySeats: Map<string, number> = useMemo(() => {
    const partyToSeats = new Map<string, number>(politicalParties.map(({ name }) => [name, 0]));
    partyAreas.forEach((party, areaCode) => {
      if (party) {
        partyToSeats.set(
          party,
          (constituencies.find(({ code }) => code === areaCode)?.seats || 0) +
            (partyToSeats.get(party) || 0)
        );
      } else {
        partyToSeats.set(
          "Vacant",
          (constituencies.find(({ code }) => code === areaCode)?.seats || 0) +
            (partyToSeats.get("Vacant") || 0)
        );
      }
    });
    
    ncmpCount?.forEach((value, party) => {
      partyToSeats.set(party, (partyToSeats.get(party) || 0) + value);
    });
    return new Map([...partyToSeats.entries()].sort((a, b) => b[1] - a[1]));
  }, [partyAreas, ncmpCount]);

  const oppositionSeatsCount = useMemo(() => {
    const partyToSeatsArray = [...partySeats.entries()];
    const largestParty = partyToSeatsArray[0][0] === 'Vacant' ? partyToSeatsArray[1][0] : partyToSeatsArray[0][0];

    const oppositionSeats = partyToSeatsArray
      .filter(([party]) => party !== largestParty && party !== 'Vacant')
      .reduce((sum, [, seats]) => sum + seats, 0);
    return oppositionSeats;
  }, [partySeats]);


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

  const handleNcmpIncrement = (party) => {
    setNcmpCount((prev) => {
      if (oppositionSeatsCount >= 12) {
        return prev;
      }

      const newNCMPs = new Map(prev);
      newNCMPs.set(party, (newNCMPs.get(party) || 0) + 1);
      return newNCMPs;
    });
  }

  const handleNcmpDecrement = (party) => {
    setNcmpCount((prev) => {
      if ((prev?.get(party) || 0) <= 0) {
        return prev;
      }
      
      const newNCMPs = new Map(prev);
      newNCMPs.set(party, (newNCMPs.get(party) || 0) - 1);
      return newNCMPs;
    });
  }


  return (
    <div className="relative flex  max-w-5xl w-full mx-auto flex-col gap-x-2 gap-y-25 sm:gap-y-45 md:gap-y-20 ">

      <div className="h-[37rem] max-md:h-[26rem] max-md:min-h-[26rem]  xl:flex-row">      <MapElement
        partyAreas={partyAreas}
        partySeats={partySeats}
        updateArea={updateArea}
      /></div>

      <div className="flex justify-center pt-40 md:pt-10">
        <ParliamentSemicircle partySeats={partySeats} />
      </div>
      <div className="flex justify-center pt-[5%] md:my-8 md:pt-30 md:pr-10 md:pl-10">
        <PartySeatTable partySeats={partySeats} ncmpCount={ncmpCount} oppositionSeatsCount={oppositionSeatsCount} handleIncrement={handleNcmpIncrement} handleDecrement={handleNcmpDecrement}/>
      </div>
    </div>
  );
};

export default MapSemicircleContainer;
