"use client";
import MapElement from "./map/mapElement";
import { constituencies } from "@/lib/constituencies";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import ParliamentSemicircle from "./parliamentSemicircle";
import {
  maxNCMPs,
  politicalParties,
  vacantParty,
} from "@/lib/politicalParties";
import { useRouter, useSearchParams } from "next/navigation";
import { getStateQuery, parseStateFromUrl } from "@/handler/parseStateFromUrl";
import MapButtons from "./mapButtons";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import MapLegend from "./map/mapLegend";
import WarningBanner from "./table/ncmpWarningBanner";
import PartySeatTable from "./table/partySeatTable";
import CirclePicker from "./map/circlePicker";
import { getDefaultAreaResult, getDefaultNCMPResult } from "@/lib/defaultResult";

const MapSemicircleElement = () => {
  const searchParams = useSearchParams();
  const [hashLoaded, setHashLoaded] = useState(false);
  const [partyAreas, setPartyAreas] = useState<Map<string, string | null>>(
    getDefaultAreaResult()
  );
  const [ncmpCount, setNcmpCount] = useState<Map<string, number>>(getDefaultNCMPResult());
  const [selectedParty, setSelectedParty] = useState<string | null>(null);

  const router = useRouter();

  // Replace url if invalid on load
  useEffect(() => {
    let hash = "";
    if (typeof window !== "undefined" && window.location.hash) {
      hash = window.location.hash;
    }
    const hashParams = new URLSearchParams(hash.replace("#", ""));

    const getUrlPartyAreas =
      parseStateFromUrl(searchParams.get("partyAreas")) ||
      parseStateFromUrl(hashParams.get("partyAreas"));
    if (getUrlPartyAreas) {
      setPartyAreas(getUrlPartyAreas as Map<string, string | null>);
    }

    const getUrlNcmpCount =
      parseStateFromUrl(searchParams.get("ncmpCount")) ||
      parseStateFromUrl(hashParams.get("ncmpCount"));
    if (getUrlNcmpCount) {
      setNcmpCount(getUrlNcmpCount as Map<string, number>);
    }
    const query = getStateQuery(
      getUrlPartyAreas as Map<string, string | null>,
      getUrlNcmpCount as Map<string, number>
    );

    router.replace(`?#${query.toString()}`, { scroll: false });
    setHashLoaded(true);
  }, [router, searchParams]);

  useEffect(() => {
    if (hashLoaded) {
      const query = getStateQuery(partyAreas, ncmpCount);
      router.replace(`?#${query.toString()}`, { scroll: false });
    }
  }, [partyAreas, ncmpCount, router, hashLoaded]);

  const partySeats: Map<string, number> = useMemo(() => {
    const partyToSeats = new Map<string, number>(
      politicalParties.map(({ name }) => [name, 0])
    );

    partyAreas.forEach((party, areaCode) => {
      if (party != null) {
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

  const handleFullReset = () => {
    setPartyAreas(getDefaultAreaResult());
    setNcmpCount(getDefaultNCMPResult());
  };

  const handleShareMap = useCallback(async () => {
    const query = getStateQuery(partyAreas, ncmpCount);
    const generatedUrl =
      window.location.origin + window.location.pathname + "?" + query;

    try {
      await navigator.clipboard.writeText(generatedUrl);
      toast.success("Link Copied!", {
        description: `The URL has been copied to your clipboard. Share this link to let others see your map!`,
      });
    } catch (err) {
      toast.error("Failed to copy: ", {
        description: `Please copy the url manually if you would like to share. ${generatedUrl}`,
      });
      console.error("Failed to copy: ", err);
    }
  }, [partyAreas, ncmpCount]);

  const handleFillMap = (fillParty: string) => {
    if (fillParty) {
      setPartyAreas(
        new Map(constituencies.map(({ code }) => [code, fillParty]))
      );

      setNcmpCount(new Map());
    }
  };

  const updateSelectedParty = useCallback(
    (party: string | null) => {
      setSelectedParty(party);
    },
    []
  );

  return (
    <div className="relative flex  max-w-5xl w-full mx-auto flex-col gap-x-2">
      <div className=" max-md:min-h-[26rem]  xl:flex-row">

        <MapButtons
          handleFullReset={handleFullReset}
          handleShareMap={handleShareMap}
          handleFillMap={handleFillMap}
        />
        <MapElement partyAreas={partyAreas} updateArea={updateArea} selectedParty={selectedParty} updateSelectedParty={updateSelectedParty}>
          <MapLegend partySeats={partySeats} />
          <CirclePicker
            selectedParty={selectedParty}
            updateSelectedParty={updateSelectedParty}
          />
        </MapElement>
      </div>

      <div className="flex justify-center mt-5  flex-col">
        <WarningBanner
          partySeats={partySeats}
          ncmpCount={ncmpCount}
          oppositionSeatsCount={oppositionSeatsCount}
        />
        <PartySeatTable
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

const MapSemicircleContainer = () => (
  <Suspense
    fallback={
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" /> {/* Skeleton for MapButtons */}
        <Skeleton className="h-[26rem] w-full" />
        {/* Skeleton for MapElement */}
        <Skeleton className="h-10 w-1/3" />
        {/* Skeleton for PartySeatTableContainer */}
        <Skeleton className="h-10 w-1/3" />
        {/* Skeleton for ParliamentSemicircle */}
      </div>
    }
  >
    <MapSemicircleElement />
  </Suspense>
);

export default MapSemicircleContainer;
