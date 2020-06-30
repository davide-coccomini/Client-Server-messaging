function showMDC(faction) {
    const iframe = document.getElementById("iframe");
    iframe.height = "100%";
    iframe.src = "https://ucp.svrp.it/game/mdc/login.php?faction="+faction;
}

function destroyBrowser() {
    // Close the purchase window
    mp.trigger("closeMDC");
}