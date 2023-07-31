import '../App.css';
import React, {useEffect, useState} from 'react';
import { InteractionModal } from "./modal";
import Cookies from 'js-cookie';
import Fuse from "fuse.js";
import {Tracker, WebSdkContext} from "../WebSdkContext";

const gameData = await fetch("/games.json")
    .then((response) => response.json());

export const Game = (game, onShow) => {
    if (game.borrowed) {
        const date = new Date(Date.parse(game.borrowed.date) + new Date().getTimezoneOffset() * 60_000)
            .toLocaleDateString('en-us', { day:"numeric", month:"short"});
        return (
            <tr>
                <td><img src={game.cover} className="cover" alt="cover" onClick={onShow}/></td>
                <td>
                    <div className="title borrowed" onClick={onShow}>{game.name}</div>
                    <div>
                        <span className="borrowed-date">{game.borrowed.name} </span>
                        <span className="borrowed-date">{game.borrowed.email} </span>
                        <span className="borrowed-date">{date}</span>
                    </div>
                </td>
            </tr>
        );
    }
    return (
        <tr>
            <td><img src={game.cover} className="cover" alt="cover" onClick={onShow}/></td>
            <td>
                <div className="title" onClick={onShow}>{game.name}</div>
            </td>
        </tr>
    );

};

export const List = () => {
    const [games, setGames] = useState([]);
    const [activeGame, setActiveGame] = useState(null);
    const fuse = new Fuse(gameData, {
        keys: [{name: 'name', weight: 3}, 'borrowed.name', 'borrowed.email']
    });
    useEffect(() => {
        const mergeBorrowed = async (games) => {
            const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/games/borrowed`,
                {
                    credentials: 'include',
                    headers: {'x-cfp': Cookies.get('CFP-Auth-Key')}
                });
            const gamesResp = await resp.json();
            gamesResp.forEach(b => {
                const game = games.find(g => g.id === b.id);
                game['borrowed'] = {...b.borrowed}
            });
            setGames(games);
        };
        if (games.length === 0) {
            mergeBorrowed(gameData);
        }
    }, [games]);

    const filterGames = (filter) => {
        const fuseResult = filter.length === 0
            ? gameData
            : fuse.search(filter).map(g => g.item);
        setGames(fuseResult);
    };

    const alloy = React.useContext(WebSdkContext);
    useEffect(() => {
        Tracker.trackPageView(alloy, "Game List");
    }, [alloy]);

    return (
        <div>
            {activeGame && <InteractionModal game={activeGame} onClose={() => setActiveGame(null)}/>}
            <table className="game">
                <tbody>
                <tr>
                    <td colSpan="2" className="search-container">
                        <div className="search-form">
                            <input type="search" id="search" placeholder="Search"
                                   onInput={e => filterGames(e.target.value)}></input>
                        </div>
                    </td>
                </tr>
                {games.map(game => Game(game,
                    () => setActiveGame(game)))}
                </tbody>
            </table>
        </div>
    );
};