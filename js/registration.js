function showReg(socialName) {
    const iframe = document.getElementById("iframe");
    iframe.height = "100%";
    iframe.src = "https://ucp.svrp.it/registration.php?socialName=" + socialName;
}

function destroyBrowser() {
	// Close the purchase window
    mp.trigger("sendToLogin");
}