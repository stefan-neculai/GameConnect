import React, { useState } from 'react';
import { Game } from '../types/Game';

const GameUtils : any = () => {

    const getImageUrlBig = (game : Game) => {
        const imageID = game.cover.url.split('/')[7];
        return `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageID}`
    }

    const getImageUrlSmall = (game : Game) => {
        const imageID = game.cover.url.split('/')[7];
        return `https://images.igdb.com/igdb/image/upload/t_cover_small/${imageID}`
    }


    const getReleaseYear = (game : Game) => {
        return new Date(game.first_release_date * 1000).getFullYear();
    }


    return {
        getImageUrlBig,
        getImageUrlSmall,
        getReleaseYear,
    }
};

export default GameUtils;
