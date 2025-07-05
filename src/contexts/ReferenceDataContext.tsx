import { createContext } from "react";
import { Hero } from "@/types/hero";
import { Game } from "@/types/game";
import { Company } from "@/types/company";
import { Platform } from "@/types/platform";
import { Callsign } from "@/types/callsign";
import { User } from "@/types/user";

export const ReferenceDataContext = createContext<{
  heroes: Hero[];
  games: Game[];
  companies: Company[];
  platforms: Platform[];
  callsigns: Callsign[];
  users: User[];
  
}>({
  heroes: [],
  games: [],
  companies: [],
  platforms: [],
  callsigns: [],
  users: [],
  
});