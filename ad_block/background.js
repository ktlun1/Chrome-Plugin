const YOUTUBE_REGEX = /^https?:\/\/(\w*.)?youtube.com/i;
const YOUTUBE_AD_REGEX = /(doubleclick\.net)|(adservice\.google\.)|(youtube\.com\/api\/stats\/ads)|(&ad_type=)|(&adurl=)|(-pagead-id.)|(doubleclick\.com)|(\/ad_status.)|(\/api\/ads\/)|(\/googleads)|(\/pagead\/gen_)|(\/pagead\/lvz?)|(\/pubads.)|(\/pubads_)|(\/securepubads)|(=adunit&)|(googlesyndication\.com)|(innovid\.com)|(youtube\.com\/pagead\/)|(google\.com\/pagead\/)|(flashtalking\.com)|(googleadservices\.com)|(s0\.2mdn\.net\/ads)|(www\.youtube\.com\/ptracking)|(www\.youtube\.com\/pagead)|(www\.youtube\.com\/get_midroll_)/;


chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
    if (YOUTUBE_AD_REGEX.test(details.url)) {
        //console.log(details.url + "%c is ads", "color: red;");
        return {
            cancel: true
        };
    } else {
        //console.log(details.url + "%c is not ads", "color: blue;");
    }
	
}, {
    types: ["script", "image", "xmlhttprequest", "sub_frame"],
    urls: ["<all_urls>"]
},
    ["blocking"]
);



