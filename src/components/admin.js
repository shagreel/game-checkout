import '../App.css';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export const Borrowed = (game) => {
    return (
        <tr>
            <td>{game.name}</td>
            <td>{game.borrowed.name}</td>
            <td>{game.borrowed.email}</td>
            <td>{game.borrowed.date}</td>
        </tr>
    );
};

export const Admin = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const getGames = async () => {
            const resp = await fetch('https://api.chill.ws/games/list',
                {
                    credentials: 'include',
                    headers: {'x-cfp': Cookies.get('CFP-Auth-Key')}
                });
            const gamesResp = await resp.json();
            const borrowed = gamesResp.filter((g) => g.borrowed);
            borrowed.sort((a, b) => a.borrowed.date.localeCompare(b.borrowed.date));
            setGames(borrowed);
        };
        if (games.length === 0) {
            getGames();
        }
    }, [games]);

    return (
        <div>
            <table className="admin"><tbody>
            <tr>
                <th>Game</th>
                <th>Name</th>
                <th>Email</th>
                <th>Date</th>
            </tr>
            {games.map(game => Borrowed(game))}
            </tbody></table>
        </div>
    );
};