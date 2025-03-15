import { createContext } from "react";
import { constituencies } from "./constituencies";

export const AreaContext = createContext(constituencies.map(({ code }) => [code, null]));