import { politicalParties } from "@/lib/politicalParties";

export const MapLegend = ({partySeats}) => (          
<div id="legend" className='bg-white rounded-md  bottom-4 absolute left-auto sm:bottom-8 right-2.5 sm:shadow-md text-xs font-sans p-2 z-10' >
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {/* .sort(({value}) => value) */}
      {politicalParties.filter(({name}) => (partySeats.get(name) > 0)).map((item) => (
        <div key={item.name} className="flex items-center space-x-1">
          <span className={`w-4 h-4 sm:w-5 sm:h-5rounded-full ${item.color}`} />
          <div 
            className={`w-5 h-5 sm:w-6 sm:h-6 bg-cover bg-center rounded-full`} 
            style={{ backgroundImage: `url(${item.icon})`, objectFit: 'contain', objectPosition: 'center'}} 
          />
          <span className="font-medium">{item.name}</span>
        </div>
      ))}
    </div>
</div>)