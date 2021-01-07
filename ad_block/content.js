if (location.host.includes(".youtube.com")) {
    var myVar = self.setInterval(getButton, 1000/4);
    function getButton() {
        var buttonSkip = document.querySelector(".ytp-ad-skip-button");
        //console.log(buttonSkip);
        if (buttonSkip) {
            buttonSkip.click();
            //clearInterval(myVar);
        }
    }
}
