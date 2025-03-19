"use client"

import { getTablePartyColor } from "@/handler/partyColorHandlers";
import { Table, TableCell, TableHead, TableHeader, TableRow} from "./ui/table";
import { Button } from "./ui/button";
import { SquarePlus, SquareMinus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const hasNoSeats = (partySeats: Map<string, number>, party: string) => (party === 'Vacant' || !partySeats?.has(party) || partySeats?.get(party) === 0)
const canAddNcmp = (oppositionSeatsCount: number, party: string, largestParty: string) => (oppositionSeatsCount < 12 && party !== largestParty);


const PartySeatTableBody = ({partySeats, ncmpCount, oppositionSeatsCount, handleIncrement, handleDecrement} : {partySeats: Map<string, number>, ncmpCount: Map<string, number>, oppositionSeatsCount: number, handleIncrement: (party: string) => void, handleDecrement: (party: string) => void}) => {
    const largestParty = Array.from(partySeats.entries())[0][0] === 'Vacant' ? Array.from(partySeats.entries())[1][0] : Array.from(partySeats.entries())[0][0];
    return (Array.from(partySeats).map(([party, seats]) => (
        <motion.tr
        key={party}
        layout 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 50 }}
        className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
      >
            <TableCell className={`font-semibold border-l-6 ${getTablePartyColor(party)} ${hasNoSeats(partySeats, party) && 'text-gray-400'}`}>{party}</TableCell>
            <TableCell className="font-semibold ">
                <div className="relative flex justify-end items-center gap-2">
                    <Button disabled={!canAddNcmp(oppositionSeatsCount, party, largestParty)}  variant="ghost" className={`  rounded ${party === 'Vacant' && 'invisible'}`} onClick={() => handleIncrement(party)}> <SquarePlus color={`${!canAddNcmp(oppositionSeatsCount, party, largestParty) ? '#777777' : '#000000'}`}/> </Button>
                    <span className={`sm:w-2 inline-block pb-0.5 ${hasNoSeats(partySeats, party) && 'text-gray-400'}`}>
                        {ncmpCount?.get(party) || 0}
                    </span>
                    <Button variant="ghost" className={`text-black rounded ${(hasNoSeats(ncmpCount, party)) && 'invisible'}`} onClick={() => handleDecrement(party)}> <SquareMinus/> </Button>
                </div>
            </TableCell>
            <TableCell className={`font-semibold text-right ${hasNoSeats(partySeats, party) && 'text-gray-400'}`}>{seats}</TableCell>
        </motion.tr>
    )))
}

const PartySeatTable = ({partySeats, ncmpCount, oppositionSeatsCount, handleIncrement, handleDecrement} : {partySeats: Map<string, number>}) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-fit">Party</TableHead>
                    <TableHead><div className="relative flex justify-end items-center gap-2 pr-7">NCMPs</div></TableHead>
                    <TableHead className="max-w-0.5 text-right">Seats</TableHead>
                </TableRow>
            </TableHeader>
            <motion.tbody className={cn("[&_tr:last-child]:border-0")}>
                {PartySeatTableBody({partySeats, ncmpCount, oppositionSeatsCount, handleIncrement, handleDecrement})}
            </motion.tbody >
        </Table>
    );
};

export default PartySeatTable;
