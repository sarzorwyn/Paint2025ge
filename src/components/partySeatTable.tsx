"use client";

import { getTablePartyColor } from "@/handler/partyColorHandlers";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { SquarePlus, SquareMinus } from "lucide-react";
import { cn } from "@/lib/utils";
import WarningBanner from "./ncmpWarningBanner";
import {
  maxNCMPs,
  politicalParties,
  vacantParty,
} from "@/lib/politicalParties";
import TableMotion from "./ui/tableMotion";
import { motion } from "framer-motion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import PartyIcon from "./partyIcon";

const hasNoSeats = (
  partySeats: Map<string, number> | undefined,
  party: string
) =>
  party === vacantParty ||
  !partySeats?.has(party) ||
  partySeats?.get(party) === 0;
const canAddNcmp = (
  oppositionSeatsCount: number,
  party: string,
  largestParty: string,
  ncmpCount: Map<string, number> | undefined
) =>
  oppositionSeatsCount < 12 &&
  party !== largestParty &&
  (ncmpCount ? Array.from(ncmpCount.values()).reduce((a, b) => a + b, 0) : 0) <
    maxNCMPs;

const PartyDetailsHover = ({ partyShortName }: { partyShortName: string }) => {
  const partyDetails = politicalParties.find(
    ({ name }) => name === partyShortName
  );
  if (!partyDetails) {
    return <>{partyShortName}</>;
  }

  return (
    <HoverCard>
      <HoverCardTrigger>{partyShortName}</HoverCardTrigger>
      <HoverCardContent side="right" align="center" asChild>
        <div className="w-auto p-2 ">
          <span className="text-sm flex flex-col items-center space-x-2">
            <PartyIcon iconUrl={partyDetails.icon} />
            {partyDetails.fullname}
          </span>{" "}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const PartySeatTableBody = ({
  partySeats,
  ncmpCount,
  oppositionSeatsCount,
  handleIncrement,
  handleDecrement,
}: {
  partySeats: Map<string, number>;
  ncmpCount: Map<string, number> | undefined;
  oppositionSeatsCount: number;
  handleIncrement: (party: string) => void;
  handleDecrement: (party: string) => void;
}) => {
  const largestParty =
    Array.from(partySeats.entries())[0][0] === vacantParty
      ? Array.from(partySeats.entries())[1][0]
      : Array.from(partySeats.entries())[0][0];
  return Array.from(partySeats).map(([party, seats]) => (
    <TableMotion key={party}>
      <TableCell
        className={`font-semibold border-l-6 ${getTablePartyColor(party)} ${
          hasNoSeats(partySeats, party) && "text-gray-400"
        }`}
      >
        <PartyDetailsHover partyShortName={party} />
      </TableCell>
      <TableCell className="font-semibold ">
        <div className="relative flex flex-row justify-end items-center gap-2">
          <Button
            disabled={
              !canAddNcmp(oppositionSeatsCount, party, largestParty, ncmpCount)
            }
            variant="ghost"
            className={`  rounded ${party === vacantParty && "invisible"}`}
            onClick={() => handleIncrement(party)}
          >
            <SquarePlus
              color={`${
                !canAddNcmp(
                  oppositionSeatsCount,
                  party,
                  largestParty,
                  ncmpCount
                )
                  ? "#777777"
                  : "#000000"
              }`}
            />
          </Button>
          <span
            className={`sm:w-2 inline-block pb-0.5 ${
              hasNoSeats(partySeats, party) && "text-gray-400"
            }`}
          >
            {ncmpCount?.get(party) || 0}
          </span>
          <Button
            variant="ghost"
            className={`text-black rounded ${
              hasNoSeats(ncmpCount, party) && "invisible"
            }`}
            onClick={() => handleDecrement(party)}
          >
            <SquareMinus />
          </Button>
        </div>
      </TableCell>
      <TableCell
        className={`font-semibold text-right ${
          hasNoSeats(partySeats, party) && "text-gray-400"
        }`}
      >
        {seats}
      </TableCell>
    </TableMotion>
  ));
};

const PartySeatTable = ({
  partySeats,
  ncmpCount,
  oppositionSeatsCount,
  handleIncrement,
  handleDecrement,
}: {
  partySeats: Map<string, number>;
  ncmpCount: Map<string, number> | undefined;
  oppositionSeatsCount: number;
  handleIncrement: (party: string) => void;
  handleDecrement: (party: string) => void;
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-fit">Party</TableHead>
          <TableHead>
            <div className="relative flex justify-end items-center gap-2 pr-7">
              <HoverCard>
                <HoverCardTrigger>NCMPs</HoverCardTrigger>

                <HoverCardContent>
                  <div className="text-sm">
                  Opposition candidates who lost in a general election but enter Parliament as the best-performing losers, 
                  <span className="font-bold"> ensuring at least 12 opposition MPs in total.</span></div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </TableHead>
          <TableHead className="max-w-0.5 text-right">Seats</TableHead>
        </TableRow>
      </TableHeader>
      <motion.tbody className={cn("[&_tr:last-child]:border-0")}>
        {PartySeatTableBody({
          partySeats,
          ncmpCount,
          oppositionSeatsCount,
          handleIncrement,
          handleDecrement,
        })}
      </motion.tbody>
    </Table>
  );
};

const PartySeatTableContainer = ({
  partySeats,
  ncmpCount,
  oppositionSeatsCount,
  handleIncrement,
  handleDecrement,
}: {
  partySeats: Map<string, number>;
  ncmpCount: Map<string, number> | undefined;
  oppositionSeatsCount: number;
  handleIncrement: (party: string) => void;
  handleDecrement: (party: string) => void;
}) => {
  return (
    <>
      <WarningBanner
        partySeats={partySeats}
        ncmpCount={ncmpCount}
        oppositionSeatsCount={oppositionSeatsCount}
      />
      <PartySeatTable
        partySeats={partySeats}
        ncmpCount={ncmpCount}
        oppositionSeatsCount={oppositionSeatsCount}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
      />
    </>
  );
};

export default PartySeatTableContainer;
