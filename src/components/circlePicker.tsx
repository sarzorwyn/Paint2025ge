"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { politicalParties } from "@/lib/politicalParties";
import { Menu } from "lucide-react"; 
import Image from "next/image";

export default function CirclePicker({onSelect}) {
  return (

    
<div className="absolute top-4 right-4 z-50">
<DropdownMenu>
      <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-gray-300 bg-white"
          >            
            <Menu className="w-6 h-6 text-gray-700" />
          </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent  align="end" className="w-12">
        <DropdownMenuLabel>Choose party</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-none gap-2">
        {politicalParties
            .map((item) => (
              <DropdownMenuItem id={item.label} key={item.label} className="p-0 flex justify-center" onClick={onSelect}>
                <Image src={item.icon} alt={item.label} width={17} height={17} />
                <div className="hidden sm:block">{item.label}</div>
              </DropdownMenuItem>
            ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>

      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>


        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-4 bg-white border border-gray-200 shadow-md rounded-lg p-1"
        >
          {politicalParties
            .map((item) => (
              <DropdownMenuItem key={item.label} className="p-2 flex justify-center">
                <img src={item.icon} alt={item.label} className="w-5 h-5 sm:w-6 sm:h-6 bg-cover bg-center rounded-full" />
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
}
