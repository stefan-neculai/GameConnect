import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';
import Game from './src/models/Game'; // Adjust this path as needed to match your Game model file location

dotenv.config();

const fetchGames = async (offset = 0): Promise<void> => {
  try {
    const response = await axios({
      url: 'https://api.igdb.com/v4/games',
      method: 'POST',
      headers: {
        'Client-ID': process.env.IGDB_CLIENT_ID as string,
        'Authorization': `Bearer ${process.env.IGDB_ACCESS_TOKEN}`,
        'Accept': 'application/json'
      },
      data: `fields name, category, game_modes.name, involved_companies.company.name, summary, storyline, cover.url, first_release_date, genres.name, platforms.name, similar_games.name, similar_games.cover.url; where category = 0 & genres != null & cover != null & cover.url != null & first_release_date != null; limit 500; offset ${offset};`
    });

    if (response.data.length) {
      await Game.insertMany(response.data.map((item: any) => ({
        id: item.id,
        category: item.category,
        cover: item.cover,
        first_release_date: item.first_release_date,
        game_modes: item.game_modes,
        genres: item.genres,
        name: item.name,
        platforms: item.platforms,
        similar_games: item.similar_games,
        storyline: item.storyline,
        summary: item.summary,
        involved_companies: item.involved_companies?.map((comp: any) => ({
          id: comp.id,
          company: comp.company
        }))
      })));

      //console.log(`Successfully inserted ${response.data.length} games. Continuing with next batch...`);
      fetchGames(offset + 500);  // Recursive call to fetch next page
    } else {
      console.log('No more games to fetch.');
      mongoose.disconnect();
    }
  } catch (error) {
    console.error('Error fetching games:', error.message);
    mongoose.disconnect();
  }
};

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
    fetchGames();  // Initial call to start the process
  })
  .catch(err => {
    console.error('Could not connect to MongoDB:', err.message);
  });
