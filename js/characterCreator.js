function validate(evt, n) {
    var theEvent = evt || window.event;

    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (n == 1) {
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    } else {
        if (regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }
}

var Bar = 0, anmStatus = 0, openedBar = null;

function showAnimation(anm, id){
    var tCl = document.getElementById(id).classList;
    
    if(anmStatus == 1){Event.preventDefault;return;}
    Array.prototype.forEach.call((document.getElementById('optionsbar').children), element=>element.style.color = "white");
    Array.prototype.forEach.call((document.getElementById('optionsbar').children), e=>e.style.opacity = "0.7");


    if(Bar == 1){
        Array.prototype.forEach.call((document.getElementById('optionsbar').children), element=>element.style.color = "white");
        Array.prototype.forEach.call((document.getElementById('bars').children), e =>e.classList.add('no-display'));
        Bar = 0;
        
        if(event.target == openedBar){
            return;
        }
    }
    
    openedBar = event.target;
    anmStatus = 1;
    tCl.add('animate__animated');
    tCl.add('animate__' + anm);
    tCl.remove('no-display');      
    Bar = 1;
    
    event.target.style.color = "#1a72b9";
    event.target.style.opacity = 1;    

    setTimeout(function(){
        tCl.remove('animate__animated');
        tCl.remove('animate__' + anm);
        anmStatus = 0;
    }, 1000);
}

var SubMenuSelected = document.createElement('div');
var MenuSelected = document.createElement('div');
var AnimationStatus = 0;
var IconSelected = document.createElement('div');
var currentMenuName = null;

function showMenu(menuname) {
    currentMenuName = menuname;
    if (AnimationStatus == 1) {
        event.preventDefault();
    } else {
        var Menu = document.getElementById(menuname);
        var MenuButton = document.getElementById(menuname + 'button');
        var MenuIcon = document.getElementById(menuname + "icon");

        if (MenuSelected != MenuButton) {
            MenuSelected.style.backgroundColor = "#161616";
            IconSelected.classList.remove("icon-active")
        }
        if (menuname == "facemenu" || menuname == "eyesmenu" || menuname == "hairmenu" || menuname == "makeupmenuicon") {
            cameraPointTo(1);
        } else {
            cameraPointTo(0);
        }
        MenuSelected = MenuButton;
        IconSelected = MenuIcon;
        MenuSelected.style.backgroundColor = "rgb(59, 59, 59)";
        MenuIcon.classList.add("icon-active")


        if (SubMenuSelected != Menu) {
            SubMenuSelected.classList.add('horizAnimOff');

            setTimeout(function() {
                SubMenuSelected.classList.add('no-display');
                SubMenuSelected.classList.remove('horizAnimOff');
                SubMenuSelected.classList.remove('block-event');
            }, 900);
        }

        setTimeout(function() {
            SubMenuSelected = Menu;
        }, 1000);

        Menu.classList.remove('no-display');
        AnimationStatus = 1;
        Menu.classList.add('horizAnimOn');
        setTimeout(function() {
            Menu.classList.remove('horizAnimOn');
            AnimationStatus = 0;
        }, 1000);

    }
}

var fathers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];

var mothers = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45];

var fatherNames = ["Benjamin", "Daniel", "Joshua", "Noah", "Andrew", "Juan", "Alex", "Isaac", "Evan", "Ethan", "Vincent", "Angel", "Diego", "Adrian", "Gabriel", "Michael", "Santiago", "Kevin", "Louis", "Samuel", "Anthony", "Claude", "Niko", "John"];

var motherNames = ["Hannah", "Aubrey", "Jasmine", "Gisele", "Amelia", "Isabella", "Zoe", "Ava", "Camila", "Violet", "Sophia", "Evelyn", "Nicole", "Ashley", "Gracie", "Brianna", "Natalie", "Olivia", "Elizabeth", "Charlotte", "Emma", "Misty"];

var Colors = [
    ["Colore1", "Colore2", "Colore3", "Colore4", "Colore5", "Colore6", "Colore7", "Colore8", "Colore9", "Colore10", "Colore11", "Colore12", "Colore13", "Colore14", "Colore15", "Colore16", "Colore17", "Colore18", "Colore19", "Colore20", "Colore21", "Colore22", "Colore23", "Colore24", "Colore25", "Colore26", "Colore27", "Colore28", "Colore29", "Colore30", "Colore31", "Colore32", "Colore33", "Colore34", "Colore35", "Colore36", "Colore37", "Colore38", "Colore39", "Colore40", "Colore41", "Colore42", "Colore43", "Colore44", "Colore45", "Colore46"],

    ["db4536", "fb5259", "fb7074", "f46a84", "ce4555", "e74a39", "a13a2b", "fdaf81", "da6850", "ffd2a9", "eaa88e", "e3825c", "ff7b52", "ed5a30", "ff8f8d", "fea0b2", "fd79cd", "feb6db", "ff4d8e", "dc4053", "a23731", "582521", "ff7455", "ed3f2d", "ff5a40", "fc7883", "fd25e8", "ee1ee3", "c404ef", "7e0a91", "5c265a", "882186", "6300e4", "0000fc", "0b0782", "0839ff", "0adbef", "0cc0f3", "33ffda", "64da52", "52f587", "439d2b", "feff5c", "9cff54", "fefe5e", "fffd00"]
];

var eyeColors = ["Green", "Emerald", "Light Blue", "Ocean Blue", "Light Brown", "Dark Brown", "Hazel", "Dark Gray", "Light Gray", "Pink", "Yellow", "Purple", "Blackout", "Shades of Gray", "Tequila Sunrise", "Atomic", "Warp", "ECola", "Space Ranger", "Ying Yang", "Bullseye", "Lizard", "Dragon", "Extra Terrestrial", "Goat", "Smiley", "Possessed", "Demon", "Infected", "Alien", "Undead", "Zombie"];

var appearanceItemNames = [
    // blemishes
    ["None", "Measles", "Pimples", "Spots", "Break Out", "Blackheads", "Build Up", "Pustules", "Zits", "Full Acne", "Acne", "Cheek Rash", "Face Rash", "Picker", "Puberty", "Eyesore", "Chin Rash", "Two Face", "T Zone", "Greasy", "Marked", "Acne Scarring", "Full Acne Scarring", "Cold Sores", "Impetigo"],
    // facial hair
    ["None", "Light Stubble", "Balbo", "Circle Beard", "Goatee", "Chin", "Chin Fuzz", "Pencil Chin Strap", "Scruffy", "Musketeer", "Mustache", "Trimmed Beard", "Stubble", "Thin Circle Beard", "Horseshoe", "Pencil and 'Chops", "Chin Strap Beard", "Balbo and Sideburns", "Mutton Chops", "Scruffy Beard", "Curly", "Curly & Deep Stranger", "Handlebar", "Faustic", "Otto & Patch", "Otto & Full Stranger", "Light Franz", "The Hampstead", "The Ambrose", "Lincoln Curtain"],
    // eyebrows
    ["None", "Balanced", "Fashion", "Cleopatra", "Quizzical", "Femme", "Seductive", "Pinched", "Chola", "Triomphe", "Carefree", "Curvaceous", "Rodent", "Double Tram", "Thin", "Penciled", "Mother Plucker", "Straight and Narrow", "Natural", "Fuzzy", "Unkempt", "Caterpillar", "Regular", "Mediterranean", "Groomed", "Bushels", "Feathered", "Prickly", "Monobrow", "Winged", "Triple Tram", "Arched Tram", "Cutouts", "Fade Away", "Solo Tram"],
    // ageing
    ["None", "Crow's Feet", "First Signs", "Middle Aged", "Worry Lines", "Depression", "Distinguished", "Aged", "Weathered", "Wrinkled", "Sagging", "Tough Life", "Vintage", "Retired", "Junkie", "Geriatric"],
    // makeup
    ["None", "Smoky Black", "Bronze", "Soft Gray", "Retro Glam", "Natural Look", "Cat Eyes", "Chola", "Vamp", "Vinewood Glamour", "Bubblegum", "Aqua Dream", "Pin Up", "Purple Passion", "Smoky Cat Eye", "Smoldering Ruby", "Pop Princess"],
    // blush
    ["None", "Full", "Angled", "Round", "Horizontal", "High", "Sweetheart", "Eighties"],
    // complexion
    ["None", "Rosy Cheeks", "Stubble Rash", "Hot Flush", "Sunburn", "Bruised", "Alchoholic", "Patchy", "Totem", "Blood Vessels", "Damaged", "Pale", "Ghostly"],
    // sun damage
    ["None", "Uneven", "Sandpaper", "Patchy", "Rough", "Leathery", "Textured", "Coarse", "Rugged", "Creased", "Cracked", "Gritty"],
    // lipstick
    ["None", "Color Matte", "Color Gloss", "Lined Matte", "Lined Gloss", "Heavy Lined Matte", "Heavy Lined Gloss", "Lined Nude Matte", "Liner Nude Gloss", "Smudged", "Geisha"],
    // freckles
    ["None", "Cherub", "All Over", "Irregular", "Dot Dash", "Over the Bridge", "Baby Doll", "Pixie", "Sun Kissed", "Beauty Marks", "Line Up", "Modelesque", "Occasional", "Speckled", "Rain Drops", "Double Dip", "One Sided", "Pairs", "Growth"],
    // chest hair
    ["None", "Natural", "The Strip", "The Tree", "Hairy", "Grisly", "Ape", "Groomed Ape", "Bikini", "Lightning Bolt", "Reverse Lightning", "Love Heart", "Chestache", "Happy Face", "Skull", "Snail Trail", "Slug and Nips", "Hairy Arms"]
];

var hairIDList = [
    // male
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 72, 73],
    // female
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 76, 77]
];

var hairNameList = [
    // male
    ["Close Shave", "Buzzcut", "Faux Hawk", "Hipster", "Side Parting", "Shorter Cut", "Biker", "Ponytail", "Cornrows", "Slicked", "Short Brushed", "Spikey", "Caesar", "Chopped", "Dreads", "Long Hair", "Shaggy Curls", "Surfer Dude", "Short Side Part", "High Slicked Sides", "Long Slicked", "Hipster Youth", "Mullet", "Classic Cornrows", "Palm Cornrows", "Lightning Cornrows", "Whipped Cornrows", "Zig Zag Cornrows", "Snail Cornrows", "Hightop", "Loose Swept Back", "Undercut Swept Back", "Undercut Swept Side", "Spiked Mohawk", "Mod", "Layered Mod", "Flattop", "Military Buzzcut"],
    // female
    ["Close Shave", "Short", "Layered Bob", "Pigtails", "Ponytail", "Braided Mohawk", "Braids", "Bob", "Faux Hawk", "French Twist", "Long Bob", "Loose Tied", "Pixie", "Shaved Bangs", "Top Knot", "Wavy Bob", "Messy Bun", "Pin Up Girl", "Tight Bun", "Twisted Bob", "Flapper Bob", "Big Bangs", "Braided Top Knot", "Mullet", "Pinched Cornrows", "Leaf Cornrows", "Zig Zag Cornrows", "Pigtail Bangs", "Wave Braids", "Coil Braids", "Rolled Quiff", "Loose Swept Back", "Undercut Swept Back", "Undercut Swept Side", "Spiked Mohawk", "Bandana and Braid", "Layered Mod", "Skinbyrd", "Neat Bun", "Short Bob"]
];

var fatherFaceSelected = fathers[0],
    motherFaceSelected = mothers[0],
    fatherSkinSelected = fathers[0],
    motherSkinSelected = mothers[0];
var fatherFaceN = 0,
    motherFaceN = 0,
    fatherSkinN = 0,
    motherSkinN = 0;

var eyeColorSelected = 0,
    eyeBrowStyleSelected = 0,
    eyeBrowColorSelected = 0;
var eyeBrowColorSelected = 0;
var SexSelected = 0; //Maschio = 0, Femmina = 1
var hairStyleSelected = 0,
    hairStyleID = 0,
    hairColorOneSelected = 0,
    hairColorTwoSelected = 0,
    beardStyleSelected = 0,
    beardColorSelected = 0,
    hairChestSelected = 0,
    hairChestColorSelected = 0,
    imperfSelected = 0,
    ageingSelected = 0,
    complexionSelected = 0,
    sundamageSelected = 0,
    freckleSelected = 0,
    makeupSelected = 0,
    facepowderstyleSelected = 0,
    facepowdercolorSelected = 0,
    lipstickstyleSelected = 0,
    lipstickcolorSelected = 0;

function SlideArrowMenu(idname, Contatore, Opzioni) {
    var Selected = document.getElementById(idname);
    if (event.target.id.includes('right')) {
        Contatore++;
        if (Contatore == Opzioni.length) {
            Contatore = 0;
        }
    } else {
        if (Contatore == 0) {
            Contatore = Opzioni.length;
        }
        Contatore--;
    }
    if (idname != "firstHairColor" && idname != "secondHairColor" && idname != "beardColor" && idname != "chestColor")
    Selected.textContent = Opzioni[Contatore];
    return Contatore;
}

function updateArrowMenu(idname, next = false, prev = false) {
    var Selected = document.getElementById(idname);
    let dataObject = {};

    switch (idname) {
        // case 'skinMix':
        //     var currentVal = $("#" + idname).val();
        //     console.log("Valore corrente: " + currentVal);
        //     var nextVal = parseFloat(currentVal);
        //     if (next == true) {
        //         nextVal = nextVal + 0.1;
        //     } else if (prev == true) {
        //         nextVal = nextVal - 0.1;
        //     }

        //     if (nextVal < 0) {
        //         nextVal = 0;
        //     }
        //     console.log("Prossimo valore: " + nextVal);
        //     $("#" + idname).val(nextVal);
        //     $("#" + idname).trigger('input');
        //     break;
        // case 'headMix':
        //     var currentVal = $("#" + idname).val();
        //     console.log("Valore corrente: " + currentVal);
        //     var nextVal = parseFloat(currentVal);
        //     if (next == true) {
        //         nextVal = nextVal + 0.1;
        //     } else if (prev == true) {
        //         nextVal = nextVal - 0.1;
        //     }

        //     if (nextVal < 0) {
        //         nextVal = 0;
        //     }
        //     console.log("Prossimo valore: " + nextVal);
        //     $("#" + idname).val(nextVal);
        //     $("#" + idname).trigger('input');
        //     break;
        // case 'noseWidth':
        //     var currentVal = $("#" + idname).val();
        //     console.log("Valore corrente: " + currentVal);
        //     var nextVal = parseFloat(currentVal);
        //     if (next == true) {
        //         nextVal = nextVal + 0.1;
        //     } else if (prev == true) {
        //         nextVal = nextVal - 0.1;
        //     }

        //     if (nextVal < 0) {
        //         nextVal = 0;
        //     }
        //     console.log("Prossimo valore: " + nextVal);
        //     $("#" + idname).val(nextVal);
        //     $("#" + idname).trigger('input');
        //     break;
        // case 'noseHeight':
        //     var currentVal = $("#" + idname).val();
        //     console.log("Valore corrente: " + currentVal);
        //     var nextVal = parseFloat(currentVal);
        //     if (next == true) {
        //         nextVal = nextVal + 0.1;
        //     } else if (prev == true) {
        //         nextVal = nextVal - 0.1;
        //     }

        //     if (nextVal < 0) {
        //         nextVal = 0;
        //     }
        //     console.log("Prossimo valore: " + nextVal);
        //     $("#" + idname).val(nextVal);
        //     $("#" + idname).trigger('input');
        //     break;
        // case 'noseBridge':
        //     var currentVal = $("#" + idname).val();
        //     console.log("Valore corrente: " + currentVal);
        //     var nextVal = parseFloat(currentVal);
        //     if (next == true) {
        //         nextVal = nextVal + 0.1;
        //     } else if (prev == true) {
        //         nextVal = nextVal - 0.1;
        //     }

        //     if (nextVal < 0) {
        //         nextVal = 0;
        //     }
        //     console.log("Prossimo valore: " + nextVal);
        //     $("#" + idname).val(nextVal);
        //     $("#" + idname).trigger('input');
        //     break;

        // case 'lunghezzaNaso':
        //     var currentVal = $("#" + idname).val();
        //     console.log("Valore corrente: " + currentVal);
        //     var nextVal = parseFloat(currentVal);
        //     if (next == true) {
        //         nextVal = nextVal + 0.1;
        //     } else if (prev == true) {
        //         nextVal = nextVal - 0.1;
        //     }

        //     if (nextVal < 0) {
        //         nextVal = 0;
        //     }
        //     console.log("Prossimo valore: " + nextVal);
        //     $("#" + idname).val(nextVal);
        //     $("#" + idname).trigger('input');
        //     break;
        case 'eyesColor':
            eyeColorSelected = SlideArrowMenu(idname, eyeColorSelected, eyeColors);
            dataObject[Selected.id] = eyeColorSelected;
            break;

        case 'eyebrowsModel':
            eyeBrowStyleSelected = SlideArrowMenu(idname, eyeBrowStyleSelected, appearanceItemNames[2]);
            dataObject[Selected.id] = eyeBrowStyleSelected;
            break;

        case 'eyebrowsColor':
            eyeBrowColorSelected = SlideArrowMenu(idname, eyeBrowColorSelected, Colors[0]);
            document.getElementById('eyebrowcolorprev').style.backgroundColor = '#' + Colors[1][eyeBrowColorSelected];

            dataObject[Selected.id] = eyeBrowColorSelected;
            break;

        case 'firstHeadShape':
            fatherFaceN = SlideArrowMenu(idname, fatherFaceN, fatherNames);
            fatherSkinN = fatherFaceN;
            $("#firstHeadShapeImage").attr("src", "../img/parents/male_" + fatherFaceN + ".png");
            fatherFaceSelected = fathers[fatherFaceN];
            fatherSkinSelected = fathers[fatherSkinN];
            dataObject[Selected.id] = fatherFaceSelected;
            break;

        case 'firstSkinTone':
            fatherSkinN = SlideArrowMenu(idname, fatherSkinN, fatherNames);
            fatherFaceSelected = fathers[fatherSkinN];
            fatherSkinSelected = fatherFaceSelected;
            dataObject[Selected.id] = fatherFaceSelected;
            dataObject["firstSkinTone"] = fatherSkinSelected;
            break;

        case 'secondHeadShape':
            motherFaceN = SlideArrowMenu(idname, motherFaceN, motherNames);
            $("#secondHeadShapeImage").attr("src", "../img/parents/female_" + motherFaceN + ".png");
            motherFaceSelected = mothers[motherFaceN];
            motherSkinSelected = motherFaceSelected;
            dataObject[Selected.id] = motherFaceSelected;
            dataObject["secondSkinTone"] = motherSkinSelected;
            break;

        case 'secondSkinTone':
            motherSkinN = SlideArrowMenu(idname, motherSkinN, motherNames);
            motherSkinSelected = mothers[motherSkinN];
            dataObject[Selected.id] = motherSkinSelected;
            break;

        case 'hairModel':
            hairStyleID = SlideArrowMenu(idname, hairStyleID, hairNameList[SexSelected]);
            hairStyleSelected = hairIDList[SexSelected][hairStyleID];
            dataObject[Selected.id] = hairStyleSelected;
            break;

        case 'firstHairColor':
            hairColorOneSelected = SlideArrowMenu(idname, hairColorOneSelected, Colors[0]);
            document.getElementById('haironecolorprev').style.backgroundColor = '#' + Colors[1][hairColorOneSelected];
            dataObject[Selected.id] = hairColorOneSelected;
            break;

        case 'secondHairColor':
            hairColorTwoSelected = SlideArrowMenu(idname, hairColorTwoSelected, Colors[0]);
            document.getElementById('hairtwocolorprev').style.backgroundColor = '#' + Colors[1][hairColorTwoSelected];
            dataObject[Selected.id] = hairColorTwoSelected;
            break;

        case 'beardModel':
            beardStyleSelected = SlideArrowMenu(idname, beardStyleSelected, appearanceItemNames[1]);
            dataObject[Selected.id] = beardStyleSelected;
            break;

        case 'beardColor':
            beardColorSelected = SlideArrowMenu(idname, beardColorSelected, Colors[0]);
            document.getElementById('beardcolorprev').style.backgroundColor = '#' + Colors[1][beardColorSelected];
            dataObject[Selected.id] = beardColorSelected;
            break;

        case 'chestModel':
            hairChestSelected = SlideArrowMenu(idname, hairChestSelected, appearanceItemNames[10]);
            dataObject[Selected.id] = hairChestSelected;
            break;

        case 'chestColor':
            hairChestColorSelected = SlideArrowMenu(idname, hairChestColorSelected, Colors[0]);
            document.getElementById('chesthaircolorprev').style.backgroundColor = '#' + Colors[1][hairChestColorSelected];
            dataObject[Selected.id] = hairChestColorSelected;
            break;

        case 'blemishesModel':
            imperfSelected = SlideArrowMenu(idname, imperfSelected, appearanceItemNames[0]);
            dataObject[Selected.id] = imperfSelected;
            break;

        case 'ageingModel':
            ageingSelected = SlideArrowMenu(idname, ageingSelected, appearanceItemNames[3]);
            dataObject[Selected.id] = ageingSelected;
            break;

        case 'complexionModel':
            complexionSelected = SlideArrowMenu(idname, complexionSelected, appearanceItemNames[6]);
            dataObject[Selected.id] = complexionSelected;
            break;

        case 'sundamageModel':
            sundamageSelected = SlideArrowMenu(idname, sundamageSelected, appearanceItemNames[7]);
            dataObject[Selected.id] = sundamageSelected;
            break;

        case 'frecklesModel':
            freckleSelected = SlideArrowMenu(idname, freckleSelected, appearanceItemNames[9]);
            dataObject[Selected.id] = freckleSelected;
            break;

        case 'makeupModel':
            makeupSelected = SlideArrowMenu(idname, makeupSelected, appearanceItemNames[4]);
            dataObject[Selected.id] = makeupSelected;
            break;

        case 'blushModel':
            facepowderstyleSelected = SlideArrowMenu(idname, facepowderstyleSelected, appearanceItemNames[5]);
            dataObject[Selected.id] = facepowderstyleSelected;
            break;

        case 'blushColor':
            facepowdercolorSelected = SlideArrowMenu(idname, facepowdercolorSelected, Colors[0]);
            document.getElementById('facepowdercolorprev').style.backgroundColor = '#' + Colors[1][facepowdercolorSelected];
            dataObject[Selected.id] = facepowdercolorSelected;
            break;

        case 'lipstickModel':
            lipstickstyleSelected = SlideArrowMenu(idname, lipstickstyleSelected, appearanceItemNames[8]);
            dataObject[Selected.id] = lipstickstyleSelected;
            break;

        case 'lipstickColor':
            lipstickcolorSelected = SlideArrowMenu(idname, lipstickcolorSelected, Colors[0]);
            document.getElementById('lipcolorprev').style.backgroundColor = '#' + Colors[1][lipstickcolorSelected];
            dataObject[Selected.id] = lipstickcolorSelected;
            break;
        default:
            var currentVal = $("#" + idname).val();
            var nextVal = parseFloat(currentVal);
            if (next == true) {
                nextVal = nextVal + 0.1;
            } else if (prev == true) {
                nextVal = nextVal - 0.1;
            }

            if (nextVal < 0) {
                nextVal = 0;
            }
            $("#" + idname).val(nextVal);
            //$("#" + idname).trigger('input');
            dataObject = updateMixRange(idname, nextVal)
            break;
    }

    mp.events.call('storePlayerData', JSON.stringify(dataObject));

}
$(document).ready(function() {
    var months = ["Gennaio", "Febbraio", "Marzo  ", "Aprile  ", "Maggio   ", "Giugno   ", "Luglio  ", "Agosto    ", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    $('.date-picker').each(function() {
        var $datepicker = $(this),
            cur_date = ($datepicker.data('date') ? moment($datepicker.data('date'), "YYYY/MM/dd") : moment());

        function updateDisplay(cur_date) {
            $('#dateinput').val(cur_date.format("YYYY/MM/DD"));
            $datepicker.find('.date-container > .date > .text').text(('0' + cur_date.format('Do').replace(/\D/g, '')).slice(-2));
            $datepicker.find('.date-container > .month > .text').text(('0' + cur_date.format("M")).slice(-2));
            $datepicker.find('.date-container > .year > .text').text(cur_date.format('YYYY'));
            $datepicker.data('date', cur_date.format('YYYY/MM/DD HH:mm'));
        }
        updateDisplay(moment(new Date("1980/12/01")));

        $datepicker.on('click', '[data-toggle="datepicker"]', function(event) {
            event.preventDefault();

            var cur_date = moment($(this).closest('.date-picker').data('date'), "YYYY/MM/DD HH:mm"),
                type = ($(this).data('type') ? $(this).data('type') : "date"),
                method = ($(this).data('method') ? $(this).data('method') : "add"),
                amt = ($(this).data('amt') ? $(this).data('amt') : 1);

            if (method == "add") {
                var duration = moment.duration(1, type);
                cur_date = cur_date.add(duration);
            } else if (method == "subtract") {
                cur_date = cur_date.subtract(1, type);
            } else if (method == "add-speed" && type == "y"){
                var duration = moment.duration(10, type);
                cur_date = cur_date.add(duration);
            } else if (method == "add-speed" && type == "M"){
                var duration = moment.duration(2, type);
                cur_date = cur_date.add(duration);
            } else if (method == "add-speed" && type == "d"){
                var duration = moment.duration(5, type);
                cur_date = cur_date.add(duration);
            } else if (method == "subtract-speed" && type == "y") {
                cur_date = cur_date.subtract(10, type);
            } else if (method == "subtract-speed" && type == "M") {
                cur_date = cur_date.subtract(2, type);
            } else if (method == "subtract-speed" && type == "d") {
                cur_date = cur_date.subtract(5, type);
            }

            updateDisplay(cur_date);
        });

    });

});

function updateTxt() {
    var field1 = document.getElementById('dateinput').value;

    alert(field1);

}

function updateSex() {

    document.getElementById('femmina').style.color = "white";
    document.getElementById('maschio').style.color = "white";
    document.getElementById(event.target.id).style.color = "#1a72b9";

    SexSelected = (event.target.id == "maschio") ? 0 : 1;
    mp.events.call('updatePlayerSex', SexSelected);
    mp.events.call('changePlayerSex', SexSelected);
}

function updateMix() {
    console.log("Triggerato mix");
    let dataObject = {};
    let rangebarvalue = event.currentTarget.value;
    let rangebarid = event.currentTarget.id;
    dataObject[rangebarid] = parseFloat(rangebarvalue);
    mp.events.call('storePlayerData', JSON.stringify(dataObject));
}
function updateMixRange(id, value) {
    console.log("Triggerato mixRange")
    let dataObject = {};
    dataObject[id] = parseFloat(value);
    return dataObject;
}
function checkName(name) {
    return name[0] == name[0].toUpperCase() && name[1] != name[1].toUpperCase() && name[name.length - 1] != name[name.length - 1].toUpperCase() && name != name.toUpperCase();
}


function createCharacter() {
    var nome = document.getElementById('nome');
    var cognome = document.getElementById('cognome');
    var date = document.getElementById('dateinput');
    var flag = 0;

    if (nome.value.length == 0 || !checkName(nome.value)) {
        nome.classList.add('shake-error');
        flag = 1;
    }
    if (cognome.value.length == 0 || !checkName(cognome.value)) {
        cognome.classList.add('shake-error');
        flag = 1;
    }

    splittedDate = date.value.split("/");
    if (parseInt(splittedDate[2]) > 31 || parseInt(splittedDate[2]) <= 0 || parseInt(splittedDate[1]) > 12 || parseInt(splittedDate[1]) <= 0 || parseInt(splittedDate[0]) <= 1930 || parseInt(splittedDate[0]) >= 2005) {
        date.classList.add('shake-error');
        flag = 1;
    }

    if (flag == 1) {
        if (currentMenuName != "baseinfomenu")
            showMenu("baseinfomenu");
        setTimeout(function() {
            nome.classList.remove('shake-error');
            cognome.classList.remove('shake-error');
            date.classList.remove('shake-error');
        }, 2000);
        return;
    }

    mp.events.call('acceptCharacterCreation', nome.value + " " + cognome.value, date.value);

}

function cameraPointTo(part) {
	mp.events.call('cameraPointTo', part);
}

function rotateCharacter() {
    var rotation = parseFloat(event.currentTarget.value);
    mp.events.call('rotateCharacter', rotation);
}

function exitCharacter(){
	mp.events.call('cancelCharacterCreation');
	let browser = mp.browsers.at(0);
	if(browser){
    	browser.destroy();
	}	
}

mp.events.call('changePlayerModel', 1);
