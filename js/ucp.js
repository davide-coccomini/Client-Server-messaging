function showUCP() {
    const iframe = document.getElementById("iframe");
    iframe.height = "100%";
    iframe.src = "https://ucp.svrp.it/";
}

function destroyBrowser() {
    // Close the purchase window
    mp.trigger("closeUCP");
}