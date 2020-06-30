
function setHungerValue(value){
    value = (((value + 100)/(200))*100)
    $("#hunger").css("width",value+"%");
}
function setHealthValue(value) {
    $("#health").css("width", value + "%");
}
function setArmorValue(value) {
    $("#armor").css("width", value + "%");
}
function setBankValue(value) {
    $("#progress-bank").text("$"+value);
}
function setMoneyValue(value) {
    $("#progress-money").text("$"+value);
}
function showHelp(status) {
	if (status) {
		$("#help").show();
	} else $("#help").hide();
}
function showHUD(status) {
    if (status) {
        $("#hud").show();
    } else $("#hud").hide();
}
