import React, { useState } from 'react';
import { Game } from '../types/Game';
import { get } from 'http';

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

    const getReleaseMonth = (game : Game) => {
        // converts the month number to a string
        const month = new Date(game.first_release_date * 1000).getMonth();
        const monthString = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(0, month));
        return monthString;
    }

    const getRealeaseDay = (game : Game) => {   
        return new Date(game.first_release_date * 1000).getDate();
    }

    return {
        getImageUrlBig,
        getImageUrlSmall,
        getReleaseYear,
        getReleaseMonth,
        getRealeaseDay
    }
};

export default GameUtils;
