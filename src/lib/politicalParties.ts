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

export const politicalParties: PoliticalParty[] = [
    { name: "PAP", fullname: "People's Action Party", color: {bgColor: "bg-blue-700", BorderLColor: "border-l-blue-700", borderColor: "border-blue-700", hex: "#1D4ED8"}, icon: "/party_logos/papLogo.webp"},
    { name: "WP", fullname: "Workers' Party", color: {bgColor: "bg-red-500", BorderLColor: "border-l-red-500", borderColor: "border-red-500", hex: "#fb2c36"}, icon: "/party_logos/wpLogo.webp"},
    { name: "PSP", fullname: "Progress Singapore Party", color: {bgColor: "bg-red-300", BorderLColor: "border-l-red-300", borderColor: "border-red-300", hex: "#ffa2a2"}, icon: "/party_logos/pspLogo.png"},
    { name: "NSP", fullname: "National Solidarity Party",  color: {bgColor: "bg-red-700", BorderLColor: "border-l-red-700", borderColor: "border-red-700", hex: "#C10007"}, icon: "/party_logos/nspLogo.svg"},
    { name: "PV", fullname: "Peoples Voice",  color: {bgColor: "bg-purple-700", BorderLColor: "border-l-purple-700", borderColor: "border-purple-700", hex: "#7E22CE"}, icon: "/party_logos/pvLogo.png"},
    { name: "RDU", fullname: "Red Dot United",  color: {bgColor: "bg-pink-500", BorderLColor: "border-l-pink-500", borderColor: "border-pink-500", hex: "#EC4899"}, icon: "/party_logos/rduLogo.png"},
    { name: "RP", fullname: "Reform Party",  color: {bgColor: "bg-yellow-500", BorderLColor: "border-l-yellow-500", borderColor: "border-yellow-500", hex: "#EAB308"}, icon: "/party_logos/rpLogo.png"},
    { name: "SDA", fullname: "Singapore Democratic Alliance",  color: {bgColor: "bg-purple-500", BorderLColor: "border-l-purple-500", borderColor: "border-purple-500", hex: "#A855F7"}, icon: "/party_logos/sdaLogo.webp"},
    { name: "SDP", fullname: "Singapore Democratic Party",  color: {bgColor: "bg-red-900", BorderLColor: "border-l-red-900", borderColor: "border-red-900", hex: "#82181a"}, icon: "/party_logos/sdpLogo.png"},
    { name: "SPP", fullname: "Singapore People's Party",  color: {bgColor: "bg-fuchsia-700", BorderLColor: "border-l-fuchsia-700", borderColor: "border-fuchsia-700", hex: "#A21CAF"}, icon: "/party_logos/sppLogo.png"},
];

export const vacantParty: string = "Vacant";
export const maxNCMPs: number = 12;