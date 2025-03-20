import { politicalParties, PoliticalParty } from "@/lib/politicalParties";

const LegendGrid = ({ parties }: { parties: PoliticalParty[] }) => {
  return parties.map((item) => (
    <div key={item.name} className="flex items-center space-x-1">
      <span
        className={`w-4 h-4 sm:w-5 sm:h-5rounded-full ${item.color.bgColor}`}
      />
      <div className=" rounded-full">
        <div
          className={`w-5 h-5 sm:w-6 sm:h-6 bg-contain bg-center bg-no-repeat`}
          style={{
            backgroundImage: `url(${item.icon})`,
          }}
        />
      </div>
      <span className="font-medium">{item.name}</span>
    </div>
  ));
};

const MapLegend = ({ partySeats }: { partySeats: Map<string, number> }) => {
  const parties = politicalParties.filter(
    ({ name }) => partySeats.get(name)! > 0
  );

  if (parties.length === 0) {
    return null;
  }

  // outermost div prevents the legend from resizing the map
  return (
    <div>
      <div
        id="legend"
        className="bg-white rounded-md bottom-4 sm:bottom-8 absolute left-auto  right-2.5 sm:shadow-md text-xs font-sans p-2 z-10"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <LegendGrid parties={parties} />
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
