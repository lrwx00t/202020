var status = 0;
console.log("20/20/20 background process started..")
chrome.alarms.create({ periodInMinutes: 1 });
chrome.action.setBadgeText({ text: "ON" });
chrome.action.setBadgeBackgroundColor({ color: "blue" })

chrome.action.onClicked.addListener(function (tab) {
    console.log("20/20/20 button clicked..")
    status += 1;
    console.log("status: ", status)
    badge_text = status % 2 != 0 ? "OFF" : "ON"
    badge_color = status % 2 != 0 ? "yellow" : "blue"
    chrome.action.setBadgeText({ text: badge_text });
    chrome.action.setBadgeBackgroundColor({ color: badge_color })
    if (status % 2 != 0) {
        console.log("clearing alarms and notifications..");
        chrome.alarms.clearAll();
        chrome.notifications.getAll((items) => {
            if (items) {
                for (let key in items) {
                    chrome.notifications.clear(key);
                }
            }
        });
    } else {
        chrome.alarms.create({ periodInMinutes: 1 });
    }
});


chrome.alarms.onAlarm.addListener(() => {
    chrome.notifications.create({
        type: 'basic',
        title: '20/20/20',
        iconUrl: 'images/202020.jpg',
        message: " Take a 20-second break and focus your eyes on something at least 20 feet away.",
        priority: 0
    },
        function () {
            console.log("notification running, playing sound..");
            chrome.offscreen.hasDocument().then(function (has) {
                if (!has) {
                    try {
                        chrome.offscreen.createDocument({
                            url: chrome.runtime.getURL('notification.html'),
                            reasons: ['AUDIO_PLAYBACK'],
                            justification: 'Play 202020 notification sound',
                        });
                    } catch (e) { }
                }
            });
        });
});