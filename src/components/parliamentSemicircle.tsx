import parliamentSVG from "parliament-svg";
import { toHtml } from "hast-util-to-html";
import { getPartyColor } from "@/handler/partyColorHandlers";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import AccordionMotion from "./ui/accordionMotion";



const Semicircle = ({
  partySeatsColors
}: {
  partySeatsColors: { [key: string]: { seats: number; colour: string } };
}) => {
  const svg = toHtml(parliamentSVG(partySeatsColors, true));

  return (
    <Accordion type="single" collapsible>
      <AccordionItem className=" sm:w-[40rem]" value="item-1">
        <AccordionTrigger>Parliament Diagram</AccordionTrigger>
        <AccordionContent asChild>
          <AccordionMotion>
            <div dangerouslySetInnerHTML={{ __html: svg }} />
          </AccordionMotion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const ParliamentSemicircle = ({
  partySeats,
}: {
  partySeats: Map<string, number>;
}) => {
  const partySeatsColors: { [key: string]: { seats: number; colour: string } } =
    {};

  partySeats.forEach((seats, partyName) => {
    const partyColor =
      getPartyColor(partyName)?.hex || "#d1d5dc ";
    partySeatsColors[partyName] = { seats: Number(seats), colour: partyColor };
  });

  return (
    partySeatsColors != null &&
    Object.keys(partySeatsColors).length > 0 && (
      <Semicircle partySeatsColors={partySeatsColors} />
    )
  );
};

export default ParliamentSemicircle;
