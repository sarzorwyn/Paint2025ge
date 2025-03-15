'use client'
import MapElement from "./mapElement";
import { constituencies } from "@/lib/constituencies";
import { politicalParties } from "@/lib/politicalParties";
import { useEffect, useMemo, useRef, useState } from "react";

const MapSemicircleContainer = () => {
  const [partyAreas, setPartyAreas] = useState(new Map(constituencies.map(({ code }) => [code, null])));
  const partySeats = useMemo(() => {
    return [...partyAreas].reduce((acc, [areaCode, party]) => {

      if (party) {
        acc.set(party, (constituencies.find(({code}) => code === areaCode)?.seats || 0) + (acc.get(party) || 0));
      }
      return acc;
    }, new Map());
  }, [partyAreas]);
  const chartRef = useRef(null);


  const updateArea = (newId, party) => {
    setPartyAreas((prev) => {
      const newPartyAreas = new Map(prev);
      const code = constituencies.find(({ id }) => id === newId)?.code;


      if (code !== undefined) {
        newPartyAreas.set(code, party);
      }
      return newPartyAreas;
    })};

  // useEffect(() => {
  //   chartRef.current = d3.select('g').call(d3.parliamentChart([
  //     { color: 'blue' }, { color: 'blue' }, { color: 'green' }, { color: 'red' }
  //   ]))}, []);

  return (
    <MapElement partyAreas={partyAreas} partySeats={partySeats} updateArea={updateArea}/>
  )
}

export default MapSemicircleContainer;