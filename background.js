'use strict'

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        let result;
        switch (request.type) {
            case "ask_cookie": {
                try {
                    chrome.cookies.get({ url: request.url, name: "z_c0" }, (cookie) => {
                        console.log(cookie);
                        sendResponse({ result: cookie.value });
                    });
                } catch (e) {
                    sendResponse({ result: null });
                }
            }
        }
        return true;
    });