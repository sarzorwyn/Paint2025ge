export type PoliticalParty = {
    name: string;
    fullname: string;
    color: {
        bgColor: string;
        BorderLColor: string;
        borderColor: string;
        hex: string;
    };
    icon: string;
};

// Tailwind doesnt allow dynamic generation of classes, need to hardcode
export const politicalParties: PoliticalParty[] = [
    { name: "PAP", fullname: "People's Action Party", color: {bgColor: "bg-red-500", BorderLColor: "border-l-red-500", borderColor: "border-red-500", hex: "#fb2c36"} , icon: "/party_logos/papLogo.webp"},
    { name: "WP", fullname: "Workers' Party", color: {bgColor: "bg-[#93B3D4]", BorderLColor: "border-l-[#93B3D4]", borderColor: "border-[#93B3D4]", hex: "#93B3D4"}, icon: "/party_logos/wpLogo.webp"},
    { name: "PSP", fullname: "Progress Singapore Party", color: {bgColor: "bg-red-300", BorderLColor: "border-l-red-300", borderColor: "border-red-300", hex: "#ffa2a2"}, icon: "/party_logos/pspLogo.webp"},
    { name: "NSP", fullname: "National Solidarity Party",  color: {bgColor: "bg-[#FF924F]", BorderLColor: "border-l-[#FF924F]", borderColor: "border-[#FF924F]", hex: "#FF924F"}, icon: "/party_logos/nspLogo.svg"},
    { name: "RDU", fullname: "Red Dot United",  color: {bgColor: "bg-[#000080]", BorderLColor: "border-l-[#000080]", borderColor: "border-[#000080]", hex: "#000080"}, icon: "/party_logos/rduLogo.webp"},
    { name: "SDA", fullname: "Singapore Democratic Alliance",  color: {bgColor: "bg-[#66ff00]", BorderLColor: "border-l-[#66ff00]", borderColor: "border-[#66ff00]", hex: "#66ff00"}, icon: "/party_logos/sdaLogo.webp"},
    { name: "SDP", fullname: "Singapore Democratic Party",  color: {bgColor: "bg-red-900", BorderLColor: "border-l-red-900", borderColor: "border-red-900", hex: "#82181a"}, icon: "/party_logos/sdpLogo.webp"},
    { name: "SPP", fullname: "Singapore People's Party",  color: {bgColor: "bg-[#800080]", BorderLColor: "border-l-[#800080]", borderColor: "border-[#800080]", hex: "#800080"}, icon: "/party_logos/sppLogo.webp"},
    { name: "PPP", fullname: "People's Power Party",  color: {bgColor: "bg-[#9A77BB]", BorderLColor: "border-l-[#9A77BB]", borderColor: "border-[#9A77BB]", hex: "#9A77BB"}, icon: "/party_logos/pppLogo.png"},
    { name: "SUP", fullname: "Singapore United Party",  color: {bgColor: "bg-[#A57F4E]", BorderLColor: "border-l-[#A57F4E]", borderColor: "border-[#A57F4E]", hex: "#A57F4E"}, icon: "/party_logos/supLogo.webp"},
    { name: "PAR", fullname: "People's Alliance for Reform",  color: {bgColor: "bg-[#000000]", BorderLColor: "border-l-[#000000]", borderColor: "border-[#000000]", hex: "#000000"}, icon: "/party_logos/parLogo.webp"},
    // { name: "PV", fullname: "Peoples Voice",  color: {bgColor: "bg-purple-700", BorderLColor: "border-l-purple-700", borderColor: "border-purple-700", hex: "#7E22CE"}, icon: "/party_logos/pvLogo.webp"},
    // { name: "RP", fullname: "Reform Party",  color: {bgColor: "bg-yellow-500", BorderLColor: "border-l-yellow-500", borderColor: "border-yellow-500", hex: "#EAB308"}, icon: "/party_logos/rpLogo.webp"},

];
export const vacantParty: string = "Vacant";
export const maxNCMPs: number = 12;