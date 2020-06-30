
var piemenu = null;
var optionJSON = [];


function addOption(displayText, command){
    $("#piemenu").append("<div data-wheelnav-navitemtext='" + displayText + "'></div>");
}

function showMenu(options) {

    optionJSON = JSON.parse(options);
    for (let i = 0; i < optionJSON.length; i++) {
        let option = optionJSON[i];
        addOption(option.Name, option.Command);
    }
    piemenu = new wheelnav('piemenu');

    for (let i = 0; i < optionJSON.length; i++) {
        let option = optionJSON[i];
        piemenu.navItems[i].navigateFunction = function () { executeCommand(option.Command); };
    }
    piemenu.selectedNavItemIndex = null;
    piemenu.clockwise = false;
    piemenu.wheelRadius = piemenu.wheelRadius * 0.83;
    piemenu.createWheel();
}

function destroyBrowser() {
    return function() {
        // Close the purchase window
        mp.trigger('destroyBrowser');
    };
}

function hideMenu() {
    piemenu.removeWheel();
    mp.trigger('destroyBrowser');
}

function executeCommand(command){
    hideMenu();
    mp.trigger("consoleLog", "Command: " + command)
    mp.trigger("WheelCommand", command);
}

function executeCustomCommand(command) {
    hideMenu();
    mp.invoke(command, command);
}