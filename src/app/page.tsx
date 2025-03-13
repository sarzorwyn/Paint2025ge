import Image from "next/image";
import Polygon from "@/components/polygon";

export default function Home() {    // <div className="absolute top-1/4 left-0 w-full h-3/4 md:top-1/3 md:h-2/3 ml:top-1/4 ml:h-3/4">
  return (
    <div className="flex w-full flex-col items-center pb-10 md:px-8">
      <div className="w-full max-w-screen-xl">
        <div className="px-4 md:px-8">
          <div className="flex h-full w-full flex-col">
            <div className="relative flex h-[37rem] flex-col gap-x-2 gap-y-8 max-md:h-[26rem] max-md:min-h-[26rem] xl:flex-row">
              <Polygon/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
