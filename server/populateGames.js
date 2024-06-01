"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var mongoose_1 = require("mongoose");
var axios_1 = require("axios");
var Game_1 = require("./src/models/Game"); // Adjust this path as needed to match your Game model file location
dotenv.config();
var fetchGames = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (offset) {
        var response, error_1;
        if (offset === void 0) { offset = 0; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: 'https://api.igdb.com/v4/games',
                            method: 'POST',
                            headers: {
                                'Client-ID': process.env.IGDB_CLIENT_ID,
                                'Authorization': "Bearer ".concat(process.env.IGDB_ACCESS_TOKEN),
                                'Accept': 'application/json'
                            },
                            data: "fields name, category, game_modes.name, involved_companies.company.name, summary, storyline, cover.url, first_release_date, genres.name, platforms.name, similar_games.name, similar_games.cover.url; where category = 0 & genres != null & cover != null & cover.url != null & first_release_date != null; limit 500; offset ".concat(offset, ";")
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.data.length) return [3 /*break*/, 3];
                    return [4 /*yield*/, Game_1.default.insertMany(response.data.map(function (item) {
                            var _a;
                            return ({
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
                                involved_companies: (_a = item.involved_companies) === null || _a === void 0 ? void 0 : _a.map(function (comp) { return ({
                                    id: comp.id,
                                    company: comp.company
                                }); })
                            });
                        }))];
                case 2:
                    _a.sent();
                    console.log("Successfully inserted ".concat(response.data.length, " games. Continuing with next batch..."));
                    fetchGames(offset + 500); // Recursive call to fetch next page
                    return [3 /*break*/, 4];
                case 3:
                    console.log('No more games to fetch.');
                    mongoose_1.default.disconnect();
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error fetching games:', error_1.message);
                    mongoose_1.default.disconnect();
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
};
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(function () {
    console.log('Connected to MongoDB');
    fetchGames(); // Initial call to start the process
})
    .catch(function (err) {
    console.error('Could not connect to MongoDB:', err.message);
});
