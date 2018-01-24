(async function () {

    'use strict';
    let avatar = document.querySelector("button.Button.AppHeader-profileEntry.Button--plain");
    avatar.click();
    let homeElm = document.querySelector("a.Button.Menu-item.AppHeaderProfileMenu-item.Button--plain");
    console.log(homeElm);
    let homeLink = homeElm.href;
    console.log(homeLink);
    let userId = homeLink.match(/(?<=people\/).*/).toString();
    console.log("user id:", userId);
    avatar.click();

    let GET = (url, headers) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        headers && Object.keys(headers).forEach((key) => { xhr.setRequestHeader(key, headers[key]) });
        xhr.send();
        return xhr.response;
    };

    let followees = [];
    let offset = 0;
    let batch = null;
    do {
        let followeesAPI = `https://www.zhihu.com/api/v4/members/${userId}/followees?offset=${offset}&limit=20`;
        batch = JSON.parse(GET(followeesAPI));
        console.log(`batch ${offset}`, batch);
        followees = followees.concat(batch.data);
        offset += batch.data.length;
    } while (!batch.paging.is_end);
    console.log("followees: ", followees);

    let authPromise = new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "ask_cookie", url: document.URL }, (response) => {
            console.log("cookie:", response.result);
            resolve(response.result);
        });
    });

    let authorization = await authPromise;

    if (authorization == null) {
        console.log("authorization is null");
        return;
    }
    authorization = "Bearer " + authorization;

    let activitiesAPI = `https://www.zhihu.com/api/v4/members/${followees[0].url_token}/activities`;
    let activities = [];
    while (activities.length < 50) {

        console.log(JSON.parse(GET(activitiesAPI, { authorization })));
    }

})();