import { useState } from 'react';
import Cookies from "js-cookie";

export const InteractionModal = (props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const borrowGame = async () => {
        await fetch('https://api.chill.ws/games/borrow', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
                'x-cfp': Cookies.get('CFP-Auth-Key')
            },
            body: JSON.stringify({
                "id": props.game.id,
                "borrowed": {
                    "name": name,
                    "email": email,
                    "date": new Date().toJSON().slice(0, 10)
                }
            })
        })
        .then(response => {
            props.game['borrowed'] = {
                "name": name,
                "email": email,
                "date": new Date().toJSON().slice(0, 10)
            };
            props.onClose();
        }).catch(error => {
            console.error('Could not borrow game', error);
        });
    };

    const returnGame = async () => {
        await fetch('https://api.chill.ws/games/return', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'x-cfp': Cookies.get('CFP-Auth-Key'),
            },
            body: JSON.stringify({
                "id": props.game.id
            })
        })
        .then(response => {
            delete props.game.borrowed;
            props.onClose();
        }).catch(error => {
            console.error('Could not borrow game', error);
        });
    };

    const makeExchange = () => {
      if (props.game.borrowed) {
          returnGame();
      } else {
          borrowGame();
      }
    };

    const label = props.game.borrowed ? "Return" : "Borrow";
    return (
        <div className="modal">
            <div onClick={props.onClose} className="overlay"></div>
            <div className="modal-content">
                <h3>{label} {props.game.name}?</h3>
                {!props.game.borrowed && (
                    <div>
                        <div className="modal-form-input">
                            <div><label htmlFor="nameId">Full Name: </label></div>
                            <div><input type="text" id="nameId" onInput={e => setName(e.target.value)}/></div>
                        </div>
                        <div className="modal-form-input">
                            <div><label htmlFor="emailId">Email: </label></div>
                            <div><input type="email" id="emailId" onInput={e => setEmail(e.target.value)}/></div>
                        </div>
                    </div>
                )}
                <div className="modal-form-input modal-buttons">
                    <button className="modal-button" onClick={makeExchange}>
                        {label}
                    </button>
                    <button className="modal-button" onClick={props.onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}