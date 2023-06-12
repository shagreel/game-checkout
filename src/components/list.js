import '../App.css';
import React, { useEffect, useState } from 'react';
import { InteractionModal } from "./modal";
import Cookies from 'js-cookie';
import gameData from '../data.json';

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
    useEffect(() => {
        const mergeBorrowed = async (games) => {
            const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/games/borrowed`,
                {
                    credentials: 'include',
                    headers: {'x-cfp': Cookies.get('CFP-Auth-Key')}
                });
            const gamesResp = await resp.json();
            console.log(gamesResp);
            gamesResp.forEach(b => {
                console.log(b);
                const game = games.find(g => g.id == b.id);
                console.log(game);
                game['borrowed'] = {...b.borrowed}
            });
            setGames(games);
        };
        if (games.length === 0) {
            mergeBorrowed(gameData);
        }
    }, [games]);

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