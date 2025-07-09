import HeroCard from "@/components/cards/HeroCard";
import { Hero } from "@/types/hero";
import GameCard from "@/components/cards/GameCard";
import { Game } from "@/types/game";
import PlatformCard from "@/components/cards/PlatformCard";
import { Platform } from "@/types/platform";
import CompanyCard from "@/components/cards/CompanyCard";
import { Company } from "@/types/company";
import CallsignCard from "@/components/cards/CallsignCard";
import { Callsign } from "@/types/callsign";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { baseURL } from "@/utils/constants";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useContext } from "react";
import { ReferenceDataContext } from "@/contexts/ReferenceDataContext";
import HeroSearch from "@/components/form/HeroSearch";
import GameSearch from "@/components/form/GameSearch";
import UserSearch from "@/components/form/UserSearch";
import UserView from "@/components/views/UserView";
import { cardPerPage } from "@/utils/constants";
import { getAxiosHeaders } from "@/utils/axiosHeaders";
import { getFetchHeaders } from "@/utils/fetchHeaders";

interface ViewProps {
  subject: string;
  onModalOpen: (type: string, data?: any) => void;
  refreshStats: () => void;
  onRegisterRefresh?: (fn: () => void) => void;
}

export default function View({ subject, onModalOpen, refreshStats, onRegisterRefresh }: ViewProps) {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [callsigns, setCallsigns] = useState<Callsign[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const perPage = cardPerPage;
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  const { games: allGames } = useContext(ReferenceDataContext);
  const { heroes: allHeroes } = useContext(ReferenceDataContext);
  const { callsigns: allCallsigns } = useContext(ReferenceDataContext);
  const { companies: allCompanies } = useContext(ReferenceDataContext);
  const { platforms: allPlatforms } = useContext(ReferenceDataContext);
  const { users: allUsers } = useContext(ReferenceDataContext);

  function renderCards() {
    let cards = null;
    switch (subject) {
        case "Hero":
          cards = heroes.map((hero) => (
            <HeroCard
              key={hero.id}
              hero={hero}
              onDetail={() => handleDetail(hero)}
              onEdit={() => handleEdit(hero)}
              onDelete={() => handleDelete(hero)}
            />
          ));
          break;
        case "Game":
          cards = games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onDetail={() => handleDetail(game)}
              onEdit={() => handleEdit(game)}
              onDelete={() => handleDelete(game)}
            />
          ));
          break;
        case "Platform":
          cards = platforms.map((platform) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              onDetail={() => handleDetail(platform)}
              onEdit={() => handleEdit(platform)}
              onDelete={() => handleDelete(platform)}
            />
          ));
          break;
        case "Company":
          cards = companies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onDetail={() => handleDetail(company)}
              onEdit={() => handleEdit(company)}
              onDelete={() => handleDelete(company)}
            />
          ));
          break;
        case "Callsign":
          cards = callsigns.map((callsign) => (
            <CallsignCard
              key={callsign.id}
              callsign={callsign}
              onDetail={() => handleDetail(callsign)}
              onEdit={() => handleEdit(callsign)}
              onDelete={() => handleDelete(callsign)}
            />
          ));
          break;
      }
    return cards; // Add other subjects as needed
  }

  function renderTable(){
    return <UserView 
    users={users}
    onDetail={(user) => handleDetail(user)}
    onEdit={(user) => handleEdit(user)}
    onDelete={(user) => handleDelete(user)}
    />;
  }
    
  

  useEffect(() => {
    setPage(0);
  }, [subject]);

  // 1. Define fetchData outside of useEffect
    const fetchData = async () => {
    try {
      let url = `${baseURL}/`+subject.toLowerCase()+`/`;
      if (subject === "Hero" || subject === "Game" || subject === "User") {
        url += `search?page=${page}&size=${perPage}`;
      } else if (subject === "Platform" || subject === "Company" || subject === "Callsign") {
        url += `getAll`;
      }

      if (!url) return;

      const res = await fetch(url, {headers: getFetchHeaders()});
      const json = await res.json();
      console.log(`Response for ${subject} fetch:`, json);
      let result = json.data.content;

      if (subject === "Hero" || subject === "Game" || subject === "User") {
        if (subject === "Hero") {
          setHeroes(result);
        } else if (subject === "Game") {
          setGames(result);
        }
        else if (subject === "User") {
          setUsers(result);
        }
        setHasMore(result.length === perPage);
        setTotalPages(json.data.totalPages);
      } else if (subject === "Platform" || subject === "Company" || subject === "Callsign"  ) {
        result = json.data;
        if (subject === "Company") {
          setCompanies(result);
        } else if (subject === "Platform") {
          setPlatforms(result);
        } else if (subject === "Callsign") {
          setCallsigns(result);
        }
        setHasMore(false);
        setTotalPages(1);
      }

      
      
    } catch (err) {
      console.error(`Failed to fetch ${subject}`, err);
    }
  };

  // 2. Reuse inside useEffect
  useEffect(() => {
    fetchData();
  }, [subject, page]);

  // 3. Register refresh function to MainPage
  useEffect(() => {
    onRegisterRefresh?.(fetchData);
  }, [onRegisterRefresh, subject, page]);

  

   

   const closeModal = () => {
    setModalContent(null);
    setModalData(null);
  };

  const refreshView = async () => {
    try {
      let res = null
      let json = null;
      let result = null;
      if (subject === "Hero" || subject === "Game" || subject === "User") {
        res = await fetch(`${baseURL}/${subject.toLowerCase()}/search?page=${page}&size=${perPage}`, {headers: getFetchHeaders()});
        json = await res.json();
        result = json.data.content;
        if (result.length === 0 && page > 0) {
          setPage(page - 1);
          return;
        } 
        if (subject === "Hero") {
          setHeroes(result);
        } else if (subject === "Game") {
          setGames(result);
        } else if (subject === "User") {
          setUsers(result);
        }
        setHasMore(result.length === perPage);
        setTotalPages(json.data.totalPages);

      } else if (subject === "Platform" || subject === "Company" || subject === "Callsign") {
        res = await fetch(`${baseURL}/${subject.toLowerCase()}/getAll`, {headers: getFetchHeaders()});
        json = await res.json();
        result = json.data;
        if (subject === "Company") {
          setCompanies(result);
        } else if (subject === "Platform") {
          setPlatforms(result);
        } else if (subject === "Callsign") {
          setCallsigns(result);
        }
        setHasMore(false);
        setTotalPages(1);
      }

    } catch (err){
      console.error("Failed to refresh view:", err);
    }
    
  }

  type HeroFilter = {
    name: string;
    title: string;
    gender: string;
    gameId: string;
  };

  type GameFilter = {
    name: string;
    companyId: string;
    platformId: string;
    callsignId: string;
  };

  type UserFilter = {
    name: string;
    role: string;
  };

  type FilterMap = {
    Hero: HeroFilter;
    Game: GameFilter;
    User: UserFilter;
    // Add more subjects and their filters here
  };

  const doFilter = async <T extends keyof FilterMap>(
    subject: T,
    filters: FilterMap[T],
    setItems: (data: any[]) => void
  ) => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    try {
      
      const res = await fetch(
        `${baseURL}/${subject.toLowerCase()}/search?${queryParams}&page=${page}&size=${perPage}`, {headers: getFetchHeaders()}
      );
      const json = await res.json();
      const result = json.data.content;

      setPage(0); // always go back to first page
      setItems(result);
      setHasMore(result.length === perPage);
      setTotalPages(json.data.totalPages);
    } catch (err) {
      console.error(`Failed to filter ${subject.toLowerCase()}:`, err);
    }
  };


  const filterHeroes = (filters: HeroFilter) => {
    
    doFilter(
      "Hero",
      filters,
      setHeroes
      
    );
  };

  const filterGames = (filters: GameFilter) => {
    
    doFilter(
      "Game",
      filters,
      setGames
    );

  };

  const filterUsers = (filters: UserFilter) => {
    
    doFilter(
      "User",
      filters,
      setUsers
    );

  };

  type acceptableItems = Hero | Game | Platform | Company | Callsign | User;
  

  const handleDetail = (item: acceptableItems) => {
    if (subject === "Hero") {
      onModalOpen("hero-detail", { hero: item });
    } else if (subject === "Game") {
      onModalOpen("game-detail", { game: item });
    } else if (subject === "Platform") {
      onModalOpen("platform-detail", { platform: item });
    } else if (subject === "Company") {
      onModalOpen("company-detail", { company: item });
    } else if (subject === "Callsign") {
      onModalOpen("callsign-detail", { callsign: item });
    } else if (subject === "User") {
      onModalOpen("user-detail", { user: item });
    }
    
  };

  const handleEdit = (item: acceptableItems) => {
    console.log("Handling edit for item: " + JSON.stringify(item));
    console.log("The subject is: " + subject);
    if (subject === "Hero") {
      onModalOpen("hero-edit", {
        hero: item as Hero,
        games: allGames,
        onSubmit: executeUpdate,
        onSuccess: refreshView,
      });
    } 
    
    if (subject === "Game") {
      onModalOpen("game-edit", {
        game: item as Game,
        platforms: allPlatforms,
        callsigns: allCallsigns,
        companies: allCompanies,
        onSubmit: executeUpdate,
        onSuccess: refreshView,
      });
    }

    if (subject === "Platform") {
      onModalOpen("platform-edit", {
        platform: item as Platform,
        onSubmit: executeUpdate,
        onSuccess: refreshView,
      });
    }

    if (subject === "Company") {
      onModalOpen("company-edit", {
        company: item as Company,
        onSubmit: executeUpdate,
        onSuccess: refreshView,
      });
    }

    if (subject === "Callsign") {
      onModalOpen("callsign-edit", {
        callsign: item as Callsign,
        onSubmit: executeUpdate,
        onSuccess: refreshView,
      });
    }

    if (subject === "User") {
      onModalOpen("user-edit", {
        user: item as User,
        onSubmit: executeUpdate,
        onSuccess: refreshView,
      });
    }
  };

  const executeUpdate = async (formData: FormData) => {
    await axios.patch(`${baseURL}/`+ subject.toLowerCase() +`/update`, formData, {headers: getAxiosHeaders()});
    toast.success(subject + " updated!");
  };

  const handleDelete = (item: acceptableItems) => {
    let itemName = "";
    if (subject === "Hero"){
      itemName = (item as Hero).heroName;
      if ((item as Hero).displayByTitle === 'Y') {
        itemName = (item as Hero).heroTitle;
      } 
    } else if (subject === "Game") {
      itemName = (item as Game).gameName;
      const isUsedByHero = allHeroes.some(hero => hero.game?.id === item.id);
      if (isUsedByHero) {
        toast.error("This game cannot be deleted because it is used by one or more heroes.");
        return;
      }
    } else if (subject === "Platform") {
      itemName = (item as Platform).platformName;
      const isUsedByGame = allGames.some(game => game.platform?.id === item.id);
      if (isUsedByGame) {
        toast.error("This platform cannot be deleted because it is used by one or more games.");
        return;
      }
    } else if (subject === "Company") {
      itemName = (item as Company).companyName;
      const isUsedByGame = allGames.some(game => game.company?.id === item.id);
      if (isUsedByGame) {
        toast.error("This company cannot be deleted because it is used by one or more games.");
        return;
      } 
    } else if (subject === "Callsign") {
      itemName = (item as Callsign).callsign;
      const isUsedByGame = allGames.some(game => game.callsign?.id === item.id);
      if (isUsedByGame) {
        toast.error("This callsign cannot be deleted because it is used by one or more games.");
        return;
      }
    } else if (subject === "User") {
      itemName = (item as User).userName;
    }
    
    
    
    

    onModalOpen("confirm-delete", {
      type: subject,
      id: item.id,
      name: itemName,
      onDelete: executeDelete,
      onClose: closeModal,
      onSuccess: refreshView,
    });
  };

  const executeDelete = async (formData: FormData) => {
    await axios.delete(`${baseURL}/`+ subject.toLowerCase() +`/delete/${formData}`, {headers: getAxiosHeaders()});
    toast.success(subject + " deleted!");
  };

  return (
    <div className="min-h-screen p-4">
      {/* Sticky search section */}
      <div className="sticky top-0 bg-white z-10 p-4 shadow">
      <h1 className="text-2xl font-semibold mb-2">Filter {subject}</h1>
  
      {subject === "Hero" ? (
        <HeroSearch games={allGames} onFilter={filterHeroes} />
      ) : subject === "Game" ? (
        <GameSearch companies={allCompanies} platforms={allPlatforms} callsigns={allCallsigns} onFilter={filterGames} />
      ) : subject === "User" ? (
        <UserSearch users={allUsers} onFilter={filterUsers} />
      ) : (
        <div className="text-gray-600 italic">
          Filter feature not available for {subject}
        </div>
      )}
      
   </div>

      {/* Scrollable content */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {subject === 'User' ? (
          renderTable()
        ) : (
          renderCards()
          )}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          className="btn-base btn-gray"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>
        <span className="text-gray-600 mt-2">
          Page {page + 1} of {totalPages}
        </span>
        <button
          className="btn-base btn-blue"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}