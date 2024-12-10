import {useContext, useEffect, useState} from 'react';
import Cookies from "js-cookie";
import {Tracker, WebSdkContext} from "../WebSdkContext";

export const InteractionModal = (props) => {
    const alloy = useContext(WebSdkContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const borrowGame = async () => {
        await fetch(`${process.env.REACT_APP_API_ENDPOINT}/games/borrow`, {
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
        .then(response => response.json())
        .then(json => {
            console.log(json);
            console.log(json['borrowed']);
            console.log(json['borrowed']['name']);
            props.game['borrowed'] = json['borrowed'];
            props.onClose();
            if (json['borrowed']['name'] === name) {
                Tracker.trackBorrowed(alloy, props.game.name, name, email);
            }
        }).catch(error => {
            props.onClose();
            console.error('Could not borrow game', error);
        });
    };

    const returnGame = async () => {
        await fetch(`${process.env.REACT_APP_API_ENDPOINT}/games/return`, {
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
            Tracker.trackReturned(alloy, props.game.name, props.game.borrowed.name, props.game.borrowed.email);
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

    useEffect(() => {
        if (!props.game.borrowed) {
            Tracker.trackViewed(alloy, props.game.name);
        }
    }, [props, alloy]);

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
                            <div><input type="text" id="nameId" placeholder="Full Name" autofocus="autofocus" onInput={e => setName(e.target.value)}/></div>
                        </div>
                        <div className="modal-form-input">
                            <div><label htmlFor="emailId">Email: </label></div>
                            <div><input type="email" id="emailId" placeholder="meeple@adobe.com" onInput={e => setEmail(e.target.value)}/></div>
                        </div>
                    </div>
                )}
                <div className="modal-form-input modal-buttons">
                    <button className="modal-button" type="submit" onClick={makeExchange}>
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
