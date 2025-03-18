"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPartyColor } from "@/handler/partyColorHandlers";
import { politicalParties } from "@/lib/politicalParties";
import { Menu } from "lucide-react";
import Image from "next/image";

const getButtonColor = (party) => {
  return (getPartyColor(party)?.borderColor || "border-gray-300");
}

export default function CirclePicker({ onSelect, selectedParty }) {
  return (
    <div className="absolute top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-3 bg-white ${getButtonColor(selectedParty)} hover:bg-gray-100`}
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-12">
          <DropdownMenuLabel>Choose party</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-none gap-2">
            {politicalParties.map((item) => (
              <DropdownMenuItem
                id={item.name}
                key={item.name}
                className="p-0 flex justify-center"
                onClick={onSelect}
              >
                <Image src={item.icon} alt={item.name} width={17} height={17} />
                <div className="hidden sm:block">{item.name}</div>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}


