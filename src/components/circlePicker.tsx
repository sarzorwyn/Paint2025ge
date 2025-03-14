"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Home, User, Settings } from "lucide-react"; 

export default function CirclePicker() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
          <Menu className="w-6 h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuItem className="flex items-center gap-2">
          <Home className="w-5 h-5" />
          Home
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
