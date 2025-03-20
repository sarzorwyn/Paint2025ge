import MapElement from "@/components/map/mapElement";
import MapSemicircleContainer from "@/components/mapSemicircleContainer";
import { constituencies } from "@/lib/constituencies";
import { AreaContext } from "@/lib/contexts";
import { useState } from "react";

export default function Home() {  

  return (
    <div className="flex w-full flex-col items-center pb-10 md:px-8">
      <div className="w-full max-w-screen-xl">
        <div className="px-4 md:px-8">
          <div className="flex h-full w-full flex-col">

              <MapSemicircleContainer/>
          </div>
        </div>
      </div>
    </div>
  );
}
