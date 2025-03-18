import { politicalParties } from '@/lib/politicalParties';
import parliamentSVG from 'parliament-svg'
import { toHtml } from 'hast-util-to-html'
import Image from 'next/image';

const Semicircle = ({partySeatsColors} : { [key: string]: { seats: number, colour: string } }) => {
    const svg = toHtml(parliamentSVG(partySeatsColors, true));


    return (
        <div className='h-[10rem] w-[40rem] '>
            <div dangerouslySetInnerHTML={{__html: svg}}/>
        </div>
    );
}

const ParliamentSemicircle = ({partySeats} : {partySeats: Map<string, number>}) => {

    const partySeatsColors: { [key: string]: { seats: number, colour: string } } = {};

    partySeats.forEach((seats, partyName) => {
        const partyColor = politicalParties.find(({ name }) => name === partyName)?.hex || "#333333";
        partySeatsColors[partyName] = { seats: Number(seats), colour: partyColor };
    });

    return (
        (partySeatsColors != null) && Object.keys(partySeatsColors).length > 0 && <Semicircle partySeatsColors={partySeatsColors}/>
    );
}

export default ParliamentSemicircle;