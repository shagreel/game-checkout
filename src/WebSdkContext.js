import React from 'react';

export const WebSdkContext = React.createContext(undefined);

export class Tracker {
    static trackPageView(alloy, name) {
        alloy("sendEvent", {
            "xdm": {
                "web": {
                    "webPageDetails": {
                        "pageViews": {
                            "value": 1
                        },
                        "name": name,
                        "URL": window.location.href,
                        "server": window.location.hostname
                    }
                }
            }
        });
    }
    static trackViewed(alloy, game) {
        alloy("sendEvent", {
            "xdm": {
                "_mobiledx": {
                    "viewed": 1,
                    "gameName": game
                }
            }
        });
    }
    static trackBorrowed(alloy, game, name, email) {
        alloy("sendEvent", {
            "xdm": {
                "_mobiledx": {
                    "borrowed": 1,
                    "gameName": game,
                    "borrowerName": name,
                    "borrowerEmail": email
                }
            }
        });
    }
    static trackReturned(alloy, game, name, email) {
        alloy("sendEvent", {
            "xdm": {
                "_mobiledx": {
                    "returned": 1,
                    "gameName": game,
                    "borrowerName": name,
                    "borrowerEmail": email
                }
            }
        });
    }
}