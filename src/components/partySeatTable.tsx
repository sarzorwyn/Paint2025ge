"use client"

import { getTablePartyColor } from "@/handler/partyColorHandlers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table";
import { Button } from "./ui/button";
import { SquarePlus, SquareMinus } from "lucide-react";

const hasNoSeats = (partySeats: Map<string, number>, party: string) => (party === 'Vacant' || !partySeats?.has(party) || partySeats?.get(party) === 0)
const canAddNcmp = (oppositionSeatsCount: number, party: string, largestParty: string) => (oppositionSeatsCount < 12 && party !== largestParty);


const PartySeatTableBody = ({partySeats, ncmpCount, oppositionSeatsCount, handleIncrement, handleDecrement} : {partySeats: Map<string, number>, ncmpCount: Map<string, number>, oppositionSeatsCount: number, handleIncrement: (party: string) => void, handleDecrement: (party: string) => void}) => {
    const largestParty = Array.from(partySeats.entries())[0][0] === 'Vacant' ? Array.from(partySeats.entries())[1][0] : Array.from(partySeats.entries())[0][0];
    return (Array.from(partySeats).map(([party, seats]) => (
        <TableRow key={party}>
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
        </TableRow>
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
            <TableBody>
                {PartySeatTableBody({partySeats, ncmpCount, oppositionSeatsCount, handleIncrement, handleDecrement})}
            </TableBody>
        </Table>
    );
};

export default PartySeatTable;
