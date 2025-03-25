import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { PaintBucket, RotateCcw, Share } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card";
import { useState } from "react";
import { politicalParties } from "@/lib/politicalParties";
import PartyIcon from "./partyIcon";

const FillButton = ({ handleFillMap }: { handleFillMap: (party: string) => void }) => {
  const [fillParty, setFillParty] = useState("");

  const updateFillParty = (party: string) => {
    if (party != null) {
      setFillParty(party);
    }
  };

  const handleFillMapClearFillParty = (party: string) => {
    handleFillMap(party);
    setFillParty("");
  }

  return (
    <AlertDialog>
      <HoverCard>
        <AlertDialogTrigger asChild>
          <HoverCardTrigger asChild>
            <Button variant="ghost" className=" text-gray-700">
              <PaintBucket />
            </Button>
          </HoverCardTrigger>
        </AlertDialogTrigger>
        <HoverCardContent className="text-sm">
          Fills the map with a political party.
        </HoverCardContent>
      </HoverCard>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Fill Map</AlertDialogTitle>
          <AlertDialogDescription>
            Fills map with a single party. This will reset your NCMPs. This action cannot be undone.
          </AlertDialogDescription>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {politicalParties.map((party) => (
              <Button
                variant="ghost"
                id={party.name}
                key={party.name}
                onClick={() => updateFillParty(party.name)}
                className={`${
                  party.name === fillParty ? "border-2 border-gray-600" : ""
                } hover:bg-gray-100`}
              >
                <PartyIcon iconUrl={party.icon} /> {party.name}
              </Button>
            ))}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={!fillParty}
            onClick={() => handleFillMapClearFillParty(fillParty)}
            className="bg-green-500"
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ResetButton = ({ handleFullReset }: { handleFullReset: () => void }) => {
  return (
    <AlertDialog>
      <HoverCard>
        <AlertDialogTrigger asChild>
          <HoverCardTrigger asChild>
            <Button variant="ghost" className=" text-gray-700">
              <RotateCcw />
            </Button>
          </HoverCardTrigger>
        </AlertDialogTrigger>
        <HoverCardContent className="text-sm">
          Resets the entire state of the Map and NCMPs.
        </HoverCardContent>
      </HoverCard>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Parties</AlertDialogTitle>
          <AlertDialogDescription>
            This will reset your map selection and NCMPs. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleFullReset} className="bg-red-600">
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ShareButton = ({ handleShareMap }: { handleShareMap: () => void }) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <Button variant="ghost" onClick={handleShareMap}>
        <Share className="w-4 h-4" />
      </Button>
    </HoverCardTrigger>
    <HoverCardContent className="text-sm">
      Copies the current url to your clipboard. The url is unique to your map
      state.
    </HoverCardContent>
  </HoverCard>
);

const MapButtons = ({
  handleFullReset,
  handleShareMap,
  handleFillMap,
}: {
  handleFullReset: () => void;
  handleShareMap: () => void;
  handleFillMap: (party: string) => void;
}) => {
  return (
    <div className="absolute right-4 -top-2 grid-flow-row">
      <FillButton handleFillMap={handleFillMap} />
      <ShareButton handleShareMap={handleShareMap} />
      <ResetButton handleFullReset={handleFullReset} />
    </div>
  );
};

export default MapButtons;
