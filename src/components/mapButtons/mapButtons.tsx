import { toast } from "sonner";
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
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Copy, RotateCcw } from "lucide-react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "../ui/hover-card";

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link Copied!", {
      description: "The URL has been copied to your clipboard. Share this link to let others see your map!",
    });
  } catch (err) {
    toast.error("Failed to copy: ", {
      description: "Failed to copy to your clipboard. Please copy the url manually if you would like to share.",
    });
    console.error("Failed to copy: ", err);
  }
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

const CopyButton = () => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <Button variant="ghost" onClick={copyToClipboard}>
        <Copy className="w-4 h-4" />
      </Button>
    </HoverCardTrigger>
    <HoverCardContent className="text-sm">
      Copies the current url to your clipboard. The url is unique to your map state.
    </HoverCardContent>
  </HoverCard>
);

const MapButtons = ({ handleFullReset }: { handleFullReset: () => void }) => {
  return (
    <div className="absolute right-4 -top-2 grid-flow-row">
      <CopyButton />
      <ResetButton handleFullReset={handleFullReset} />
    </div>
  );
};

export default MapButtons;
