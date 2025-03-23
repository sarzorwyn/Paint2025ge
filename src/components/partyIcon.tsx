const PartyIcon = ({ iconUrl }: { iconUrl: string }) => {
  return (
    <div className=" rounded-full">
      <div
        className={`w-5 h-5 sm:w-6 sm:h-6 bg-contain bg-center bg-no-repeat`}
        style={{
          backgroundImage: `url(${iconUrl})`,
        }}
      />
    </div>
  );
};

export default PartyIcon;
