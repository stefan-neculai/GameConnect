import mongoose, { Schema, Document } from 'mongoose';

interface ICover {
  id: number;
  url: string;
}

interface IGameMode {
  id: number;
  name: string;
}

interface IGenre {
  id: number;
  name: string;
}

interface IPlatform {
  id: number;
  name: string;
}

interface ISimilarGame {
  id: number;
  cover: ICover;
  name: string;
}

interface ICompany {
  id: number;
  name: string;
}

interface IInvolvedCompany {
  id: number;
  company: ICompany;
}

interface IGame extends Document {
    id: number;
    category: number;
    cover: ICover;
    first_release_date: number;
    game_modes: IGameMode[];
    genres: IGenre[];
    involved_companies: IInvolvedCompany[];
    name: string;
    platforms: IPlatform[];
    similar_games: ISimilarGame[];
    storyline?: string;
    summary: string;
    averageRating: number;
  }
  
  const CoverSchema: Schema = new Schema({
    id: { type: Number, required: true },
    url: { type: String, required: true }
  });
  
  const GameModeSchema: Schema = new Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true }
  });
  
  const GenreSchema: Schema = new Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true }
  });
  
  const PlatformSchema: Schema = new Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true }
  });
  
  const SimilarGameSchema: Schema = new Schema({
    id: { type: Number, required: true },
    cover: { type: CoverSchema, required: false },
    name: { type: String, required: true }
  });
  
  const CompanySchema: Schema = new Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true }
  });
  
  const InvolvedCompanySchema: Schema = new Schema({
    id: { type: Number, required: true },
    company: { type: CompanySchema, required: true }
  });
  
  const GameSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    category: { type: Number, required: true },
    cover: { type: CoverSchema, required: true },
    first_release_date: { type: Number, required: true },
    game_modes: [GameModeSchema],
    genres: [GenreSchema],
    involved_companies: [InvolvedCompanySchema],
    name: { type: String, required: true },
    platforms: [PlatformSchema],
    similar_games: [SimilarGameSchema],
    storyline: { type: String, required: false},
    summary: { type: String, required: false },
    averageRating: { type: Number, required: false, default: 0 }
  });
  
const Game = mongoose.model<IGame>('Game', GameSchema);

export default Game;