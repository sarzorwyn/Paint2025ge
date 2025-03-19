"use client"

import { getTablePartyColor } from "@/handler/partyColorHandlers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table";
import { Button } from "./ui/button";
import { SquarePlus, SquareMinus } from "lucide-react";

const hasNoSeats = (partySeats: Map<string, number>, party: string) => (party === 'Vacant' || !partySeats?.has(party) || partySeats?.get(party) === 0)

const PartySeatTableBody = ({partySeats, ncmpCount, handleIncrement, handleDecrement} : {partySeats: Map<string, number>, ncmpCount: Map<string, number>, handleIncrement: (party: string) => void, handleDecrement: (party: string) => void}) => {
    return (Array.from(partySeats).map(([party, seats]) => (
        <TableRow className={`${hasNoSeats(partySeats, party) && 'text-gray-400'}`} key={party}>
            <TableCell className={`font-semibold border-l-6 ${getTablePartyColor(party)}`}>{party}</TableCell>
            <TableCell className="font-semibold ">
                <div className="relative flex justify-end items-center gap-2">
                    <Button variant="ghost" className={`text-black rounded ${party === 'Vacant' && 'invisible'}`} onClick={() => handleIncrement(party)}> <SquarePlus/> </Button>
                        <span className=" sm:w-2 inline-block pb-0.5">
                            {ncmpCount?.get(party) || 0}
                        </span>
                    <Button variant="ghost" className={`text-black rounded ${(hasNoSeats(ncmpCount, party)) && 'invisible'}`} onClick={() => handleDecrement(party)}> <SquareMinus/> </Button>
                </div>
            </TableCell>
            <TableCell className="font-semibold text-right">{seats}</TableCell>
        </TableRow>
    )))
}

const PartySeatTable = ({partySeats, ncmpCount, handleIncrement, handleDecrement} : {partySeats: Map<string, number>}) => {
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
                {PartySeatTableBody({partySeats, ncmpCount, handleIncrement, handleDecrement})}
            </TableBody>
        </Table>
    );
};

export default PartySeatTable;
