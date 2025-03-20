"use client";
import MapElement from "./map/mapElement";
import { constituencies } from "@/lib/constituencies";
import { useCallback, useEffect, useMemo, useState } from "react";
import ParliamentSemicircle from "./parliamentSemicircle";
import {
  maxNCMPs,
  politicalParties,
  vacantParty,
} from "@/lib/politicalParties";
import PartySeatTableContainer from "./partySeatTable";
import { useRouter, useSearchParams } from "next/navigation";
import { strToU8, compressSync } from "fflate";
import { parseStateFromUrl } from "@/handler/parseStateFromUrl";

const MapSemicircleContainer = () => {
  const searchParams = useSearchParams();
  const [partyAreas, setPartyAreas] = useState<Map<string, string | null>>(
    parseStateFromUrl(
      searchParams.get("partyAreas"),
      constituencies.map(({ code }) => [code, null])
    )
  );
  const [ncmpCount, setNcmpCount] = useState<Map<string, number>>(
    parseStateFromUrl(searchParams.get("ncmpCount"), [])
  );
  const router = useRouter();

  useEffect(() => {
    const encodeState = (state: Map<string, string | null | number>) => {
      const jsonString = JSON.stringify(Object.fromEntries(state));
      const compressed = compressSync(strToU8(jsonString));

      return btoa(String.fromCharCode(...compressed));
    };

    const query = new URLSearchParams();
    if (partyAreas.size > 0) {
      query.set("partyAreas", encodeState(partyAreas));
    }

    if (ncmpCount!.size > 0) {
      query.set("ncmpCount", encodeState(ncmpCount!));
    }

    router.replace(`?${query.toString()}`, { scroll: false });
  }, [partyAreas, ncmpCount, router]);

  const partySeats: Map<string, number> = useMemo(() => {
    const partyToSeats = new Map<string, number>(
      politicalParties.map(({ name }) => [name, 0])
    );
    partyAreas.forEach((party, areaCode) => {
      if (party) {
        partyToSeats.set(
          party,
          (constituencies.find(({ code }) => code === areaCode)?.seats || 0) +
            (partyToSeats.get(party) || 0)
        );
      } else {
        partyToSeats.set(
          vacantParty,
          (constituencies.find(({ code }) => code === areaCode)?.seats || 0) +
            (partyToSeats.get(vacantParty) || 0)
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
    const largestParty =
      partyToSeatsArray[0][0] === vacantParty
        ? partyToSeatsArray[1][0]
        : partyToSeatsArray[0][0];

    const oppositionSeats = partyToSeatsArray
      .filter(([party]) => party !== largestParty && party !== vacantParty)
      .reduce((sum, [, seats]) => sum + seats, 0);
    return oppositionSeats;
  }, [partySeats]);

  const updateArea = useCallback((areaId: string, party: string) => {
    setPartyAreas((prev) => {
      const newPartyAreas = new Map(prev);
      const code = constituencies.find(({ id }) => id === Number(areaId))?.code;

      if (code !== undefined) {
        newPartyAreas.set(code, party);
      }
      return newPartyAreas;
    });
  }, []);

  const handleNcmpIncrement = useCallback(
    (party: string) => {
      setNcmpCount((prev) => {
        if (oppositionSeatsCount >= maxNCMPs) {
          return prev;
        }

        const newNCMPs = new Map(prev);
        newNCMPs.set(party, (newNCMPs.get(party) || 0) + 1);
        return newNCMPs;
      });
    },
    [oppositionSeatsCount]
  );

  const handleNcmpDecrement = useCallback((party: string) => {
    setNcmpCount((prev) => {
      if ((prev?.get(party) || 0) <= 0) {
        return prev;
      }

      const newNCMPs = new Map(prev);
      newNCMPs.set(party, (newNCMPs.get(party) || 0) - 1);
      return newNCMPs;
    });
  }, []);

  return (
    <div className="relative flex  max-w-5xl w-full mx-auto flex-col gap-x-2">
      <div className=" max-md:min-h-[26rem]  xl:flex-row">
        {" "}
        <MapElement
          partyAreas={partyAreas}
          partySeats={partySeats}
          updateArea={updateArea}
        />
      </div>

      <div className="flex justify-center mt-5  flex-col">
        <PartySeatTableContainer
          partySeats={partySeats}
          ncmpCount={ncmpCount}
          oppositionSeatsCount={oppositionSeatsCount}
          handleIncrement={handleNcmpIncrement}
          handleDecrement={handleNcmpDecrement}
        />
      </div>

      <div className="flex justify-center mt-10">
        <ParliamentSemicircle partySeats={partySeats} />
      </div>
    </div>
  );
};

export default MapSemicircleContainer;
