const ZARA_HOSTNAME = "zara.com";

chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: ZARA_HOSTNAME + '/es' },
                    }),
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: ZARA_HOSTNAME + '/ru' }
                    }),
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: ZARA_HOSTNAME + '/fr' }
                    }),
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: ZARA_HOSTNAME + '/hr' }
                    }),
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: ZARA_HOSTNAME + '/us' }
                    })
                ],
                actions: [ new chrome.declarativeContent.ShowPageAction() ]
            }
        ]);
    });
});
