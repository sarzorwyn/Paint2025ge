"use client";

import { getTablePartyColor } from "@/handler/partyColorHandlers";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { SquarePlus, SquareMinus } from "lucide-react";
import { cn } from "@/lib/utils";
import WarningBanner from "./ncmpWarningBanner";
import {
  maxNCMPs,
  politicalParties,
  vacantParty,
} from "@/lib/politicalParties";
import TableRowMotion from "../ui/tableMotion";
import { motion } from "framer-motion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import PartyIcon from "../partyIcon";
import "./partySeatTable.css";

const calcNcmpTotal = (ncmpCount: Map<string, number> | undefined) =>
  ncmpCount ? Array.from(ncmpCount.values()).reduce((a, b) => a + b, 0) : 0;

const calcSeatsTotal = (partySeats: Map<string, number> | undefined) =>
  partySeats ? Array.from(partySeats.values()).reduce((a, b) => a + b, 0) : 0;

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
  calcNcmpTotal(ncmpCount) < maxNCMPs;

const PartyDetailsHover = ({
  children,
  partyShortName,
}: {
  children?: React.ReactNode;
  partyShortName: string;
}) => {
  const partyDetails = politicalParties.find(
    ({ name }) => name === partyShortName
  );
  if (!partyDetails) {
    return <>{partyShortName}</>;
  }

  return (
    <HoverCard openDelay={100}>
      <HoverCardTrigger tabIndex={0} className="relative">
        {partyShortName}
        {children}
      </HoverCardTrigger>
      <HoverCardContent side="right" align="center" asChild>
        <div className="w-auto p-2 ">
          <span className="text-sm flex flex-col items-center space-x-2">
            <PartyIcon iconUrl={partyDetails.icon} />
            {partyDetails.fullname}
          </span>
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
  const totalSeats = partySeats
    ? Array.from(partySeats.values()).reduce((a, b) => a + b, 0)
    : 0;

  return Array.from(partySeats).map(([party, seats]) => (
    <TableRowMotion key={party}>
      <TableHead
        className={`partySeatHeader border-l-6 relative  ${getTablePartyColor(
          party
        )} ${hasNoSeats(partySeats, party) && "text-gray-400"}`}
      >
        <PartyDetailsHover partyShortName={party}></PartyDetailsHover>
        <motion.div
          className="absolute left-0 top-1/4 h-1/2 bg-black opacity-10 pointer-events-none"
          initial={{ width: 0 }}
          animate={{
            width: `${
              ((partySeats.has(party) ? partySeats.get(party)! : 0) /
                totalSeats) *
              100
            }%`,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </TableHead>
      <TableCell className="partyNcmpHeader">
        <div className="partyNcmpItemsBox">
          <Button
            variant="ghost"
            className={`rounded ${hasNoSeats(ncmpCount, party) && "opacity-0"}`}
            onClick={() => handleDecrement(party)}
          >
            <SquareMinus />
          </Button>
          <span
            className={`partyNcmpNumber ${
              hasNoSeats(partySeats, party) && "text-gray-400"
            }`}
          >
            {ncmpCount?.get(party) || 0}
          </span>
          <Button
            disabled={
              !canAddNcmp(oppositionSeatsCount, party, largestParty, ncmpCount)
            }
            variant="ghost"
            className={`  rounded ${party === vacantParty && "opacity-0"}`}
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
        </div>
      </TableCell>
      <TableCell
        className={`partySeats  ${
          hasNoSeats(partySeats, party) && "text-gray-400"
        }`}
      >
        {seats}
      </TableCell>
    </TableRowMotion>
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
          <TableHead className="partySeatHeader">Party</TableHead>
          <TableHead>
            <div className="partyNcmpHeader">
              <HoverCard openDelay={200}>
                <HoverCardTrigger tabIndex={0}>
                  <div className="pl-7 sm:pl-10">NCMPs</div>
                </HoverCardTrigger>

                <HoverCardContent>
                  <div className="text-sm">
                    Opposition candidates who lost in a general election but
                    enter Parliament as the best-performing losers,
                    <span className="font-bold">
                      ensuring at least 12 opposition MPs in total.
                    </span>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </TableHead>
          <TableHead className="partySeats">Seats</TableHead>
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
      <tfoot>
        <TableRow key="totalsRow" className="border-t-2 border-t-black">
          <TableHead className={`partySeatHeader `}>Total</TableHead>
          <TableCell className="partyNcmpHeader">
            <div className="partyNcmpItemsBox">
              <div className="px-4" />
              <span className="partyNcmpNumber">
                {calcNcmpTotal(ncmpCount)}
              </span>
              <div className="px-4" />
            </div>
          </TableCell>
          <TableCell className="partySeats">
            {calcSeatsTotal(partySeats)}
          </TableCell>
        </TableRow>
      </tfoot>
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
