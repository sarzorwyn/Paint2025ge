import { Alert, AlertDescription } from "@/components/ui/alert";
import { maxNCMPs } from "@/lib/politicalParties";
import { TriangleAlert } from "lucide-react";
import FadeInMotion from "./ui/fadeInMotion";

const WarningBanner = ({ partySeats, ncmpCount, oppositionSeatsCount }: {partySeats: Map<string, number>, ncmpCount: Map<string, number> | undefined, oppositionSeatsCount: number} ) => {
    const largestParty = Array.from(partySeats.entries())[0][0] === 'Vacant' ? Array.from(partySeats.entries())[1][0] : Array.from(partySeats.entries())[0][0];
    let alertDesc = 'Invalid NCMPs combination';
    const ncmpTotal = ncmpCount ? Array.from(ncmpCount.values()).reduce((a, b) => a + b, 0) : 0;

    if (ncmpTotal > maxNCMPs) {
        alertDesc = `Total NCMPs should not exceed ${maxNCMPs}`;
    } else if (ncmpCount !== undefined && ncmpCount.get(largestParty)! > 0) {
        alertDesc = 'The majority party should not have any NCMPs';
    } else if (ncmpTotal > 0 && oppositionSeatsCount > maxNCMPs) { 
        alertDesc = `NCMPs should not increase the opposition seat total past ${maxNCMPs}`;
    } else {
        return null;
    }

    return (
        <FadeInMotion>
        <Alert className="bg-yellow-100 border-yellow-400 text-yellow-800">
            <TriangleAlert className="h-5 w-5 text-yellow-800" />
            <AlertDescription className="text-yellow-900">{alertDesc}</AlertDescription>
        </Alert></FadeInMotion>
    );
};

export default WarningBanner;