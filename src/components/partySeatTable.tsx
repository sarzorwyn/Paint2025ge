"use client"

import { getTablePartyColor } from "@/handler/partyColorHandlers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

const PartySeatTable = ({partySeats} : {partySeats: Map<string, number>}) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-fit">Party</TableHead>
                <TableHead className="text-right">Seats</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from(partySeats).map(([party, seats]) => (
                    <TableRow key={party}>
                        <TableCell className={`font-semibold border-l-6 ${getTablePartyColor(party)}`}>{party}</TableCell>
                        <TableCell className="font-semibold text-right">{seats}</TableCell>
                    </TableRow>
                ))}
            </TableBody>

        </Table>
    )
};

export default PartySeatTable;
