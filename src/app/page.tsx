import MapSemicircleContainer from "@/components/mapSemicircleContainer";


export default function Home() {  

  return (
    <div className="flex w-full flex-col items-center md:px-8 bg-gray-100">
      <div className="w-full max-w-screen-xl">
        <div className="px-4 md:px-8 flex-col bg-gray-50 pb-20 md:pt-20">
          <div className="text-center my-7">     
            <h1 className="scroll-m-20 font-bold tracking-tight text-5xl">Paint25ge</h1>
            <p className="text-l text-muted-foreground mt-10">
              Paint the GE 2025 map with all possible combinations of seats.
            </p>
          </div>
            <div className="flex h-full w-full flex-col">
              <MapSemicircleContainer/>
          </div>
        </div>
      </div>
    </div>
  );
}
