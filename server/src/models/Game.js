"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var CoverSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    url: { type: String, required: true }
});
var GameModeSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true }
});
var GenreSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true }
});
var PlatformSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true }
});
var SimilarGameSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    cover: { type: CoverSchema, required: false },
    name: { type: String, required: true }
});
var CompanySchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true }
});
var InvolvedCompanySchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    company: { type: CompanySchema, required: true }
});
var GameSchema = new mongoose_1.Schema({
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
    storyline: { type: String, required: false },
    summary: { type: String, required: false },
    averageRating: { type: Number, required: false, "default": 0 }
});
var Game = mongoose_1["default"].model('Game', GameSchema);
exports["default"] = Game;
