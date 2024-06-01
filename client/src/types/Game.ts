  
interface Company {
    id: number;
    name: string;
    _id: string;
  }
  
  interface InvolvedCompany {
    id: number;
    company: Company;
    _id: string;
  }
  
  interface Genre {
    id: number;
    name: string;
    _id: string;
  }
  
  interface GameMode {
    id: number;
    name: string;
    _id: string;
  }
  
  interface Platform {
    id: number;
    name: string;
    _id: string;
  }
  
  interface Cover {
    id: number;
    url: string;
    _id: string;
  }
  
  interface SimilarGame {
    id: number;
    cover: Cover;
    name: string;
    _id: string;
  }
  
export interface Game {
    _id: string;
    id: number;
    category: number;
    cover: Cover;
    first_release_date: number;
    game_modes: GameMode[];
    genres: Genre[];
    involved_companies: InvolvedCompany[];
    name: string;
    platforms: Platform[];
    similar_games: SimilarGame[];
    storyline: string;
    summary: string;
    averageRating: number;
    __v: number;
  }