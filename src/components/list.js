import '../App.css';
import React, { useEffect, useState } from 'react';
import { InteractionModal } from "./modal";
import Cookies from 'js-cookie';

export const Game = (game, onShow) => {
    return (
        <tr>
            <td><img src={game.cover} className="cover" onClick={onShow}/></td>
            <td>
                <div onClick={onShow}><span className={`title ${game.borrowed ? 'borrowed' : ''}`}>{game.name}</span>{game.borrowed ? <span className="borrowed-date"> ({new Date(Date.parse(game.borrowed.date)).toLocaleDateString('en-us', { day:"numeric", month:"short"}) })</span> : ''}</div>
            </td>
        </tr>
    );
};

export const List = () => {
    const [games, setGames] = useState([]);
    const [activeGame, setActiveGame] = useState(null);
    console.log(process.env.REACT_APP_API_ENDPOINT)
    useEffect(() => {
        const getGames = async () => {
            const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/games/list`,
                {
                    credentials: 'include',
                    headers: {'x-cfp': Cookies.get('CFP-Auth-Key')}
                });
            const gamesResp = await resp.json();
            gamesResp.sort((a, b) => a.name.localeCompare(b.name));
            setGames(gamesResp);
        };
        if (games.length === 0) {
            getGames();
        }
    }, []);

    return (
        <div>
            {activeGame && <InteractionModal game={activeGame} onClose={() => setActiveGame(null)}/>}
            <table className="game"><tbody>
            {games.map(game => Game(game,
                () => setActiveGame(game)))}
            </tbody></table>
        </div>
    );
};