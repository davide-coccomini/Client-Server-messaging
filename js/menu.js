const PRICE_PIZZA = 20;
const PRICE_HAMBURGER = 10;
const PRICE_SANDWICH = 5;

let tunningComponents = [];
let blackMarketItemArray = [];
let tattooZones = [];
let clothesTypes = [];
let selectedOptions = [];
let fastfoodOrders = [];
let purchasedAmount = 1;
let multiplier = 0.0;
let selected = undefined;
let drawable = undefined;
let police = false;
let crime = [];
let crimesArray = [];
let faceOptions = [];


function populateBusinessItems(businessItemsJson, businessName, multiplier) {
    // Initialize the values
    purchasedAmount = 1;
    selected = undefined;

    // Get items to show
    let businessItemsArray = JSON.parse(businessItemsJson);

    // Show business name
    addHeaderText(businessName);

    // Get the main container
    let content = document.getElementById('content');

    for (let i = 0; i < businessItemsArray.length; i++) {
        let item = businessItemsArray[i];

        // Generate the row
        let itemContainer = createContainer(item.description, item.hash, selectBusinessItem(i));

        // Generate the help text
        let itemPrice = '' + i18next.t('general.unit-price') + '' + Math.round(item.products * parseFloat(multiplier)) + '$';
        let itemAmount = '' + i18next.t('general.amount') + '' + purchasedAmount;
        let purchaseContainer = addHelpText(itemPrice, itemAmount, itemContainer);

        // Create the add and substract options
        let container = generateAddSubstractOptions(addItemAmount(), substractItemAmount(), purchaseContainer);

        // Hide the amount and substract button until a row has been selected
        purchaseContainer.childNodes[1].classList.add('hidden');
        container.classList.add('hidden');
        container.childNodes[1].classList.add('hidden');

        // Add the row to the container
        content.appendChild(itemContainer);
    }

    // Add the buttons
    addButtons(i18next.t('general.purchase'), i18next.t('general.exit'), purchaseItem(), destroyBrowser());
}

function populateWeaponsMenu(weaponJSON, weapon, drug) {

    selected = undefined;
	
    let weapArray = JSON.parse(weaponJSON);

    addHeaderText('Costruzione Arma');

    let content = document.getElementById('content');

    for(let i = 0; i < weapArray.length; i++) {
        let weap = weapArray[i];

        if (weap.Type == 1 && drug == 0) continue;
        if (weap.Type == 2 && weapon == 0) continue;

        let weapContainer = createContainer(weap.Name, weap.Hash, markItemSelected(i));

        let weaprice = 'Costo: ' + weap.Cost;
        addHelpText(weaprice, 1, weapContainer);

        content.appendChild(weapContainer);
    }

    addButtons('Costruisci', 'Esci', buildWeapon(), destroyBrowser());
}

function buildWeapon() {
    return function() {
        if(selected !== undefined) {
            mp.trigger('buildWeapon', selected+1);
            destroyBrowser();
        }
    };
}

function showRentableMenu(vehModel, vehCost){

    addHeaderText('Veicolo in affitto');

    let content = document.getElementById('content');

    let nameCont = createContainer(vehModel, undefined, undefined);
    let vehPrice = 'Prezzo: ' + vehCost;
    
    addHelpText(vehPrice, 1, nameCont);

    content.appendChild(nameCont);

    addButtons("Affitta", "Annulla", rentVehicle(), destroyBrowser());
}

function rentVehicle() {
    return function() {
        mp.trigger('rentVehicle');
    }
}

function populateTunningMenu(tunningComponentsJSON) {
    // Add the title to the menu
    addHeaderText(i18next.t('tunning.title'));

    // Get the components list
    tunningComponents = JSON.parse(tunningComponentsJSON);

    // Show the main menu
    populateTunningHome();
}

function populateTunningHome() {
    // Initialize the options
    selected = undefined;
    drawable = undefined;

    let content = document.getElementById('content');

    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    while (options.firstChild) {
        options.removeChild(options.firstChild);
    }

    for (let i = 0; i < tunningComponents.length; i++) {
        let group = tunningComponents[i];

        // Generate the row
        let itemContainer = createContainer(i18next.t(group.desc), undefined, showComponents(i));

        // Add the row
        content.appendChild(itemContainer);
    }

    // Create the exit button
    addButtons(i18next.t('general.exit'), undefined, destroyBrowser(), undefined);
}

function populateTunningComponents() {
    // Get the content
    let content = document.getElementById('content');

    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    while (options.firstChild) {
        options.removeChild(options.firstChild);
    }

    // Add the default component option
    let itemContainer = createContainer(i18next.t('tunning.default'), undefined, removeVehicleComponent(0));

    // Generate the help text
    let itemPrice = i18next.t('general.unit-price') + tunningComponents[selected].products + '$';
    addHelpText(itemPrice, undefined, itemContainer);

    // Add the child to the main content
    content.appendChild(itemContainer);

    for (let i = 1; i < tunningComponents[selected].components.length; i++) {
        let component = tunningComponents[selected].components[i];

        // Create the main container
        let itemContainer = createContainer(component.desc, undefined, addVehicleComponent(i));

        // Generate the help text
        let itemPrice = i18next.t('general.unit-price') + tunningComponents[selected].products + '$';
        addHelpText(itemPrice, undefined, itemContainer);

        // Add the child to the main content
        content.appendChild(itemContainer);
    }

    // Create the buttons
    addButtons(i18next.t('general.purchase'), i18next.t('general.back'), confirmVehicleModification(), cancelVehicleModification());
}

function populateBlackMarketList(items) {

    addHeaderText('Mercato Nero');

    blackMarketItemArray = JSON.parse(items);

    purchasedAmount = 1;

    let content = document.getElementById('content');

    for (let i = 0; i < blackMarketItemArray.length; i++) {
        let item = blackMarketItemArray[i];

        let itemContainer = createContainer(item.Name, undefined, selectBusinessItem(i));

        let itemPrice = 'Prezzo ' + item.Price + '$';
        let itemAmount = 'Quantità ' + purchasedAmount;
        let purchaseContainer = addHelpText(itemPrice, itemAmount, itemContainer);

        let container = generateAddSubstractOptions(addBItemAmount((item.Name == "Trapano" || item.Name == "Esplosivo") ? 1 : 50), substractBItemAmount((item.Name == "Trapano" || item.Name == "Esplosivo") ? 1 : 50), purchaseContainer);
        purchaseContainer.childNodes[1].classList.add('hidden');
        container.classList.add('hidden');
        container.childNodes[1].classList.add('hidden');

        content.appendChild(itemContainer);
    }
    addButtons('Conferma', 'Esci', BuyBlackmarket(), destroyBrowser());
}

function populateFastfoodOrders(ordersJson, distancesJson) {
    // Get the orders and distances
    let distances = JSON.parse(distancesJson);
    fastfoodOrders = JSON.parse(ordersJson);
    // Get the content node
    let content = document.getElementById('content');

    // Add the title to the menu
    addHeaderText(i18next.t('fastfood.title'));

    for (let i = 0; i < fastfoodOrders.length; i++) {
        let order = fastfoodOrders[i];

        // Calculate order's price
        let amount = order.pizzas * PRICE_PIZZA + order.hamburgers * PRICE_HAMBURGER + order.sandwitches * PRICE_SANDWICH;

        // Create the main container
        let description = i18next.t('fastfood.order-number', { value: order.id });
        let itemContainer = createContainer(description, undefined, markItemSelected(i));

        // Generate the help text
        let itemPrice = i18next.t('fastfood.order') + amount + '$';
        let itemAmount = i18next.t('fastfood.distance') + parseFloat(distances[i] / 1000).toFixed(2) + 'km';
        addHelpText(itemPrice, itemAmount, itemContainer);

        // Add the child to the main content
        content.appendChild(itemContainer);
    }

    // Create the buttons
    addButtons(i18next.t('fastfood.deliver'), i18next.t('general.exit'), deliverFastfoodOrder(), destroyBrowser());
}


function populateCrimesMenu(crimesJson, selectedCrimes) {
    // Get the crime list
    crimesArray = JSON.parse(crimesJson);

    // Get the content node
    let content = document.getElementById('content');

    // Add the title to the menu
    addHeaderText(i18next.t('crimes.title'));

    // Initialize the data
    selectedOptions = [];

    if (selectedCrimes.length > 0) {
        let crimes = JSON.parse(selectedCrimes);

        for (let i = 0; i < crimes.length; i++) {
            selectedOptions.push(crimes[i]);
        }
    }

    for (let i = 0; i < crimesArray.length; i++) {
        // Get the crime
        crime = crimesArray[i]; //CrimesArray è un array

        // Create the main container
        let itemContainer = createContainer(crime.crime, undefined, markSelectedCrime(i));

        // Enable the clicked items
        for (let c = 0; c < selectedOptions.length; c++) {
            if (JSON.stringify(crime) === JSON.stringify(selectedOptions[c])) {
                // Mark the crime as applied
                itemContainer.classList.add('active-item');
                selectedOptions.splice(c, 1);
                selectedOptions.push(crime);
            }
        }

        // Generate the help text
        let itemPrice = '<b>' + i18next.t('crimes.fine') + '</b>' + crime.fine + '$';
        let itemAmount = '<b>' + i18next.t('crimes.jail') + '</b>' + crime.jail + 'min.';
        addHelpText(itemPrice, itemAmount, itemContainer);

        // Add the child to the main content
        content.appendChild(itemContainer);
    }

    // Create the buttons
    addButtons(i18next.t('crimes.incriminate'), i18next.t('general.exit'), applyCrimes(), destroyBrowser());
}

function populateCharacterList(charactersJson) {
    // Get the player list
    let characters = JSON.parse(charactersJson);

    // Get the content node
    let content = document.getElementById('content');

    // Add the title to the menu
    addHeaderText(i18next.t('character.title'));

    for (let i = 0; i < characters.length; i++) {
        // Get the current character
        let character = characters[i];

        // Create the main container
        let itemContainer = createContainer(character, undefined, loadCharacter(character));

        // Add the child to the main content
        content.appendChild(itemContainer);
    }

    // Create the buttons
    addButtons(i18next.t('character.create'), i18next.t('general.exit'), showCharacterCreationMenu(), destroyBrowser());
}


function populateClothesShopMenu(clothesTypeArray, businessName, priceMultiplier, isPolice) {
    // Add the title to the menu
    addHeaderText(businessName);

    // Load the clothes list
    clothesTypes = JSON.parse(clothesTypeArray);
    multiplier = priceMultiplier;
    police = (isPolice.toLowerCase() === 'true');

    // Show the main menu
    populateClothesShopHome();
}

function populateClothesShopHome() {
    // Get the container node
    let content = document.getElementById('content');

    // Initialization
    selected = undefined;
    drawable = undefined;

    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    while (options.firstChild) {
        options.removeChild(options.firstChild);
    }

    for (let i = 0; i < clothesTypes.length; i++) {
        // Get the current zone
        let type = clothesTypes[i];

        // Check if police and slot
        if (type.slot === 9 && !police) continue;

        // Create the main container
        let itemContainer = createContainer(i18next.t(type.description), undefined, getClothesByType(i));

        // Add the child to the main content
        content.appendChild(itemContainer);
    }

    // Create the buttons
    addButtons(i18next.t('general.exit'), undefined, closeClothesMenu(), undefined);
}

mp.events.add('populateTypeClothes', (typeClothesJson) => {
    // Get the container node
    let content = document.getElementById('content');

    // Get the clothes in the JSON object
    let typeClothesArray = JSON.parse(typeClothesJson);

    // Initialize the texture
    purchasedAmount = 0;

    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    while (options.firstChild) {
        options.removeChild(options.firstChild);
    }

    for (let i = 0; i < typeClothesArray.length; i++) {
        let clothes = typeClothesArray[i];

        // Generate the row
        let itemContainer = createContainer(clothes.description, undefined, replacePlayerClothes(i, clothes));

        // Generate the help text
        let itemPrice = '<b>' + i18next.t('general.price') + '</b>' + Math.round(clothes.products * multiplier) + '$';
        let itemAmount = '<b>' + i18next.t('clothes.variation') + '</b>' + purchasedAmount;
        let purchaseContainer = addHelpText(itemPrice, itemAmount, itemContainer);

        // Create the add and substract options
        let container = generateAddSubstractOptions(getNextClothes(clothes), getPreviousClothes(clothes), purchaseContainer);

        // Hide the amount and substract button until a row has been selected
        purchaseContainer.childNodes[1].classList.add('hidden');
        container.classList.add('hidden');
        container.childNodes[1].classList.add('hidden');

        // Add the row to the container
        content.appendChild(itemContainer);
    }

    // Create the buttons
    addButtons(i18next.t('general.purchase'), i18next.t('general.back'), purchaseClothes(), clearClothes());
});

function populateTattooMenu(tattooZoneArray, businessName, priceMultiplier) {
    // Add the title to the menu
    addHeaderText(businessName);

    // Get tattoo zones from back-and
    tattooZones = JSON.parse(tattooZoneArray);
    multiplier = priceMultiplier;

    // Show main menu
    populateTattooHome();
}

function populateTattooHome() {
    // Get the container nodes
    let content = document.getElementById('content');

    // Initialization		
    selected = undefined;
    drawable = undefined;

    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    while (options.firstChild) {
        options.removeChild(options.firstChild);
    }
    //Cicla tutti i tatuaggi ricevuti dal back-and e crea
    for (let i = 0; i < tattooZones.length; i++) {
        // Get the zone
        let zone = tattooZones[i];

        // Generate the row for tattos menu
        let itemContainer = createContainer(i18next.t(zone), undefined, getZoneTattoos(i));

        // Add the row to the container
        content.appendChild(itemContainer); //Aggiunge al menu.
    }

    // Create the buttons
    addButtons(i18next.t('general.exit'), undefined, exitTattooShop(), undefined);
}


mp.events.add('populateZoneTattoos',
    (zoneTattooJson) => {
        // Get the container nodes
        let content = document.getElementById('content');

        // Get the tattoos from the zone
        let zoneTattooArray = JSON.parse(zoneTattooJson.replace(/\\"/g, '"'));

        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }

        while (options.firstChild) {
            options.removeChild(options.firstChild);
        }

        console.log("Ciclo tatuaggi");
        for (let i = 0; i < zoneTattooArray.length; i++) {
            // Get the tattoo
            let tattoo = zoneTattooArray[i];

            // Generate the row
            let itemContainer = createContainer(tattoo.name, undefined, addPlayerTattoo(i));

            // Generate the help text
            let itemPrice = '<b>' + i18next.t('general.price') + '</b>' + Math.round(tattoo.price * multiplier) + '$';
            let purchaseContainer = addHelpText(itemPrice, undefined, itemContainer);

            // Add the row to the container
            content.appendChild(itemContainer);
        }

        // Create the buttons
        addButtons(i18next.t('general.purchase'), i18next.t('general.back'), purchaseTattoo(), clearTattoos());
    });

function populateHairdresserMenu(faceOptionsJson, selectedFaceJson, businessName) {
    // Get the container nodes
    let content = document.getElementById('content');

    // Get the data
    selectedOptions = JSON.parse(selectedFaceJson);
    faceOptions = JSON.parse(faceOptionsJson);

    // Add the title to the menu
    addHeaderText(businessName);

    for (let i = 0; i < faceOptions.length; i++) {
        let face = faceOptions[i];

        // Generate the row
        let itemContainer = createContainer(i18next.t(face.desc), undefined, undefined);

        // Generate the help text
        let itemAmount = '<b>' + i18next.t('character.type') + '</b>' + selectedOptions[i];
        let purchaseContainer = addHelpText(undefined, itemAmount, itemContainer);

        // Create the add and substract options
        generateAddSubstractOptions(getNextFacialHair(i, face.maxValue), getPreviousFacialHair(i, face.minValue), purchaseContainer);

        setTimeout(function() {
            if (selectedOptions[i] == face.minValue) {
                document.getElementsByClassName('item-substract')[i].classList.add('hidden');
            } else if (selectedOptions[i] == face.maxValue) {
                document.getElementsByClassName('item-add')[i].classList.add('hidden');
            }
        }, 250);

        // Add the row to the container
        content.appendChild(itemContainer);
    }

    // Create the buttons
    addButtons(i18next.t('general.accept'), i18next.t('general.exit'), applyHairdresserChanges(), cancelHairdresserChanges());
}

function populateTownHallMenu(townHallOptionsJson) {
    // Get the container nodes
    let content = document.getElementById('content');

    // Get the data
    let townHallOptions = JSON.parse(townHallOptionsJson);
    selected = undefined;

    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    while (options.firstChild) {
        options.removeChild(options.firstChild);
    }

    // Add the title to the menu
    addHeaderText(i18next.t('townhall.title'));

    for (let i = 0; i < townHallOptions.length; i++) {
        let townHall = townHallOptions[i];

        // Generate the row
        let itemContainer = createContainer(i18next.t(townHall.desc), undefined, townHallClick(i));

        if (townHall.price > 0) {
            // If there's any price, show it
            let itemAmount = '<b>' + i18next.t('general.price') + '</b>' + townHall.price + '$';
            addHelpText(undefined, itemAmount, itemContainer);
        }

        // Add the row to the container
        content.appendChild(itemContainer);
    }

    // Create the buttons
    addButtons(i18next.t('townhall.pay'), i18next.t('general.exit'), executeTownHallOperation(), destroyBrowser());
}

function populateFinesMenu(finesJson) {
    // Get the container nodes
    let content = document.getElementById('content');

    // Get the data
    let finesList = JSON.parse(finesJson);
    selected = undefined;

    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    while (options.firstChild) {
        options.removeChild(options.firstChild);
    }

    for (let i = 0; i < finesList.length; i++) {
        let fine = finesList[i];

        // Generate the row
        let itemContainer = createContainer(fine.reason, undefined, markSelectedFine(fine));

        // Generate the help text
        let itemPrice = '<b>' + i18next.t('general.amount') + '</b>' + fine.amount + '$';
        let itemAmount = '<b>' + i18next.t('townhall.date') + '</b>' + fine.date.split('T')[0];
        addHelpText(itemPrice, itemAmount, itemContainer);

        // Add the child to the main content
        content.appendChild(itemContainer);
    }

    // Create the buttons
    addButtons(i18next.t('townhall.pay'), i18next.t('general.back'), payPlayerFines(), backTownHallIndex());
}

function populatePoliceControlsMenu(policeControlJson) {
    // Get the container nodes
    let content = document.getElementById('content');

    // Get the data
    let policeControls = JSON.parse(policeControlJson);

    // Add the title to the menu
    addHeaderText(i18next.t('police.title'));

    for (let i = 0; i < policeControls.length; i++) {
        let control = policeControls[i];

        // Generate the row
        let itemContainer = createContainer(control, undefined, markItemSelected(i));

        // Add the child to the main content
        content.appendChild(itemContainer);
    }

    // Create the buttons
    addButtons(i18next.t('police.load'), i18next.t('general.exit'), proccessPoliceControlAction(), destroyBrowser());
}

function populateWardrobeMenu(clothesTypeArray, isPolice) {
    // Add the title to the menu
    addHeaderText(i18next.t('house.title'));

    // Get the data
    clothesTypes = JSON.parse(clothesTypeArray);
    police = (isPolice.toLowerCase() === 'true');

    populateWardrobeHome();
}

function populateWardrobeHome() {
    // Get the container nodes
    let content = document.getElementById('content');

    // Initialization		
    selected = undefined;
    drawable = undefined;

    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    while (options.firstChild) {
        options.removeChild(options.firstChild);
    }

    for (let i = 0; i < clothesTypes.length; i++) {
        let type = clothesTypes[i];

        if (type.slot === 9 && !police) continue;

        // Generate the row
        let itemContainer = createContainer(i18next.t(type.description), undefined, getPlayerPurchasedClothes(type));

        // Add the child to the main content
        content.appendChild(itemContainer);
    }

    // Create the buttons
    addButtons(i18next.t('general.exit'), undefined, closeWardrobeMenu(), undefined);
}

function populateWardrobeClothes(typeClothesJson) {
    // Get the container nodes
    let content = document.getElementById('content');

    // Initialization
    let typeClothesArray = JSON.parse(typeClothesJson);

    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    while (options.firstChild) {
        options.removeChild(options.firstChild);
    }

    // Remove the selected option
    drawable = undefined;

    // Add the remove option
    let defaultContainer = createContainer(i18next.t('clothes.none'), undefined, previewPlayerClothes(0));
    content.appendChild(defaultContainer);

    for (let i = 0; i < typeClothesArray.length; i++) {
        let clothes = typeClothesArray[i];

        // Generate the row
        let itemContainer = createContainer(clothes.description, undefined, previewPlayerClothes(i + 1));

        // Generate the help text
        let itemPrice = i18next.t('clothes.variation') + clothes.texture;
        addHelpText(itemPrice, undefined, itemContainer);

        // Add the child to the main content
        content.appendChild(itemContainer);
    }

    // Create the buttons
    addButtons(i18next.t('clothes.dress'), i18next.t('general.back'), changePlayerClothes(), clearWardrobeClothes());
}

function populateHouseMenu(houseJson, Caption) {
    let content = document.getElementById('content');

    addHeaderText(Caption);

    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    let hItem = JSON.parse(houseJson);

    let captionContainer = createContainer('Indirizzo: ' + Caption, undefined, selectHouseItem(0));
    content.appendChild(captionContainer);

    let ownerContainer = createContainer('Proprietario: ' + hItem.Owner, undefined, selectHouseItem(1));
    content.appendChild(ownerContainer);

    let isSellable = '';

    switch (hItem.State) {
        case 0:
            isSellable = 'Di proprietà';
            break;
        case 1:
            isSellable = 'In affitto';
            break;
        case 2:
            isSellable = 'In Vendita';
            break;
    }

    let stateCaption = createContainer('Stato: ' + isSellable, undefined, selectHouseItem(2));
    content.appendChild(stateCaption);

    let tenantsContainer = createContainer('Affittuari: ' + hItem.Tenants, undefined, selectHouseItem(3));
    content.appendChild(tenantsContainer);

    let state = hItem.Locked ? "Aperto" : "Chiuso";

    let lockedContainer = createContainer('Porta: ' + state, undefined, selectHouseItem(4));
    content.appendChild(lockedContainer);

    // Add only the exit button
    addButtons(i18next.t('general.exit'), undefined, destroyBrowser(), undefined);
}

function populateTenantsMenu(tenantsJSON, Caption) {
    let content = document.getElementById('content');

    addHeaderText(Caption);

    let tItemArray = JSON.parse(tenantsJSON);

    for (let i = 0;
        let < tItem.length; i++) {
        let tItem = tItemArray[i];

        let tenContainer = createContainer(tItem, undefined, destroyBrowser());
        content.appendChild(tenContainer);
    }
}

function selectHouseItem(item) {
    return function() {
        switch (item) {
            case 0:
                destroyBrowser();
                break;
            case 1:
                destroyBrowser();
                break;
            case 2:
                {
                    mp.trigger("changeHouseSellable");
                }
                break;
            case 3:
                {
                    destroyBrowser();
                    mp.trigger("listHouseTenants");
                }
                break;
            case 4:
                {
                    destroyBrowser();
                    mp.trigger("changeDoorState");
                }
                break;
        }
    }
}

function populateContactsMenu(contactsJson, action) {
    // Get the container nodes
    let content = document.getElementById('content');

    // Initialize the values
    purchasedAmount = 1;
    selected = undefined;
    let contactsArray = JSON.parse(contactsJson);

    // Add the title to the menu
    addHeaderText(i18next.t('telephone.contact-list'));

    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    while (options.firstChild) {
        options.removeChild(options.firstChild);
    }

    for (let i = 0; i < contactsArray.length; i++) {
        let item = contactsArray[i];

        // Generate the row
        let itemContainer = createContainer(item.contactName, undefined, markItemSelected(i));

        // Generate the help text
        let itemPrice = item.contactNumber;
        addHelpText(itemPrice, undefined, itemContainer);

        // Add the child to the main content
        content.appendChild(itemContainer);
    }

    // Create the buttons
    if (parseInt(action) > 0) {
        // Add both buttons
        addButtons(getContactActionText(action), i18next.t('general.exit'), executePhoneAction(), destroyBrowser());
    } else {
        // Add only the exit button
        addButtons(i18next.t('general.exit'), undefined, destroyBrowser(), undefined);
    }
}

function loadAnimationCategories(categoriesJSON) {
    // Get the container nodes
    let content = document.getElementById('content');

    // Add the title to the menu
    addHeaderText(i18next.t('general.animations'));

    // Get the different categories
    let categories = JSON.parse(categoriesJSON);

    // Initialization		
    selected = undefined;
    drawable = undefined;

    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    while (options.firstChild) {
        options.removeChild(options.firstChild);
    }

    for (let i = 0; i < categories.length; i++) {
        // Generate the row
        let itemContainer = createContainer(categories[i], undefined, getCategoryAnimations(i));

        // Add the child to the main content
        content.appendChild(itemContainer);
    }
    addButtons(i18next.t('general.exit'), undefined, destroyBrowser(), undefined);
}

mp.events.add('loadAnimationCategories', (categories) => {
    // Load the animation categories
    loadAnimationCategories(categories);
});

mp.events.add('showAnimations', (animationJSON) => {
    // Get the container nodes
    let content = document.getElementById('content');

    // Get the different animations
    let animations = JSON.parse(animationJSON);

    // Initialization		
    selected = undefined;
    drawable = undefined;

    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    while (options.firstChild) {
        options.removeChild(options.firstChild);
    }

    for (let i = 0; i < animations.length; i++) {
        // Generate the row
        let itemContainer = createContainer(animations[i].Description, undefined, playAnimation(i));

        // Add the child to the main content
        content.appendChild(itemContainer);
    }

    // Add only the exit button
    addButtons(i18next.t('general.back'), undefined, function() { mp.trigger('ShowAnimationCategories') }, undefined);
});

function findFirstChildByClass(element, className) {
    let foundElement = undefined,
        found;

    function recurse(element, className, found) {
        for (let i = 0; i < element.childNodes.length && !found; i++) {
            let el = element.childNodes[i];
            let classes = el.className != undefined ? el.className.split(" ") : [];
            for (let j = 0, jl = classes.length; j < jl; j++) {
                if (classes[j] == className) {
                    found = true;
                    foundElement = element.childNodes[i];
                    break;
                }
            }
            if (found)
                break;
            recurse(element.childNodes[i], className, found);
        }
    }
    recurse(element, className, false);
    return foundElement;
}

function getContactActionText(action) {
    let text = undefined;

    switch (parseInt(action)) {
        case 2:
            text = i18next.t('telephone.action-modify');
            break;
        case 3:
            text = i18next.t('telephone.action-delete');
            break;
        case 5:
            text = i18next.t('telephone.action-sms');
            break;
    }

    return text;
}

function markItemSelected(row) {
    return function() {
        if (selected !== row) {
            // Check if there was any item selected
            if (selected != undefined) {
                let previousSelected = document.getElementsByClassName('item-row')[selected];
                previousSelected.classList.remove('active-item');
            }

            // Select the clicked element
            let currentSelected = document.getElementsByClassName('item-row')[row];
            currentSelected.classList.add('active-item');
            selected = row;
        }
    };
}

function destroyBrowser() {
    return function() {
        // Close the purchase window
        mp.trigger('destroyBrowser');
    };
}

function BuyBlackmarket() {
    return function() {
        // Check if the user purchased anything
        if (selected != undefined) {
            mp.trigger('purchaseBlackMarketItem', selected, purchasedAmount);
        }
    };
}

function selectBusinessItem(row) {
    return function() {
        // Check if the item is not selected
        if (selected !== row) {
            // Check if there was any item selected
            if (selected !== undefined) {
                let previousSelected = document.getElementsByClassName('item-row')[selected];
                let previousAmountNode = findFirstChildByClass(previousSelected, 'item-amount-container');
                document.getElementsByClassName('item-add-substract-container')[selected].classList.add('hidden');
                previousSelected.classList.remove('active-item');
                previousAmountNode.classList.add('hidden');
            }

            // Select the item
            let currentSelected = document.getElementsByClassName('item-row')[row];
            let currentAmountNode = findFirstChildByClass(currentSelected, 'item-amount-container');
            document.getElementsByClassName('item-add-substract-container')[row].classList.remove('hidden');
            currentSelected.classList.add('active-item');
            currentAmountNode.classList.remove('hidden');

            // Store the item and initialize the amount
            purchasedAmount = 1;
            selected = row;

            // Update the element's text
            document.getElementsByClassName('item-amount')[selected].innerHTML = '<b>' + i18next.t('general.amount') + '</b>' + purchasedAmount;
            document.getElementsByClassName('item-adder')[selected].classList.remove('hidden');
            document.getElementsByClassName('item-substract')[selected].classList.add('hidden');
        }
    };
}

function addBItemAmount(amount) {
    return function() {
        // Add one unit
        purchasedAmount += amount;

        let adderButton = document.getElementsByClassName('item-adder')[selected];
        let substractButton = document.getElementsByClassName('item-substract')[selected];

        if (purchasedAmount == 1000) {
            // Maximum amount reached
            adderButton.classList.add('hidden');
        } else if (substractButton.classList.contains('hidden')) {
            // Show the button
            substractButton.classList.remove('hidden');
        }
        if (purchasedAmount<0){
            purchasedAmount = 1;
        }
        // Update the amount
        let amountSpan = document.getElementsByClassName('item-amount')[selected];
        amountSpan.innerHTML = '<b>' + i18next.t('general.amount') + '</b>' + purchasedAmount;
    };
}

function substractBItemAmount(amount) {
    return function() {
        // Add one unit
        purchasedAmount -= amount;

        let adderButton = document.getElementsByClassName('item-adder')[selected];
        let substractButton = document.getElementsByClassName('item-substract')[selected];

        if (purchasedAmount == 1000) {
            // Maximum amount reached
            adderButton.classList.add('hidden');
        } else if (substractButton.classList.contains('hidden')) {
            // Show the button
            substractButton.classList.remove('hidden');
        }
        if (purchasedAmount < 0) {
            purchasedAmount = 1;
        }
        // Update the amount
        let amountSpan = document.getElementsByClassName('item-amount')[selected];
        amountSpan.innerHTML = '<b>' + i18next.t('general.amount') + '</b>' + purchasedAmount;
    };
}

function addItemAmount() {
    return function() {
        // Add one unit
        purchasedAmount++;

        let adderButton = document.getElementsByClassName('item-adder')[selected];
        let substractButton = document.getElementsByClassName('item-substract')[selected];

        if (purchasedAmount == 10) {
            // Maximum amount reached
            adderButton.classList.add('hidden');
        } else if (substractButton.classList.contains('hidden')) {
            // Show the button
            substractButton.classList.remove('hidden');
        }

        // Update the amount
        let amountSpan = document.getElementsByClassName('item-amount')[selected];
        amountSpan.innerHTML = '<b>' + i18next.t('general.amount') + '</b>' + purchasedAmount;
    };
}

function substractItemAmount() {
    return function() {
        // Add one unit
        purchasedAmount--;

        let adderButton = document.getElementsByClassName('item-adder')[selected];
        let substractButton = document.getElementsByClassName('item-substract')[selected];

        if (purchasedAmount == 10) {
            // Maximum amount reached
            adderButton.classList.add('hidden');
        } else if (substractButton.classList.contains('hidden')) {
            // Show the button
            substractButton.classList.remove('hidden');
        }
        if (purchasedAmount < 0) {
            purchasedAmount = 1;
        }
        // Update the amount
        let amountSpan = document.getElementsByClassName('item-amount')[selected];
        amountSpan.innerHTML = '<b>' + i18next.t('general.amount') + '</b>' + purchasedAmount;
    };
}

function purchaseItem() {
    return function() {
        // Check if the user purchased anything
        if (selected != undefined) {
            mp.trigger('purchaseItem', selected, purchasedAmount);
        }
    };
}

function showComponents(row) {
    return function() {
        selected = row;

        // Show components from this type
        populateTunningComponents();
    };
}

function removeVehicleComponent(row) {
    return function() {
        if (drawable !== row) {
            // Check if there was any item selected
            if (drawable != undefined) {
                let previousSelected = document.getElementsByClassName('item-row')[drawable];
                previousSelected.classList.remove('active-item');
            }

            let currentSelected = document.getElementsByClassName('item-row')[row];
            currentSelected.classList.add('active-item');

            drawable = row;

            // Update the vehicle's tunning
            mp.trigger('removeVehicleComponent', tunningComponents[selected].slot);
        }
    }
}

function addVehicleComponent(row) {
    return function() {
        if (drawable !== row) {
            // Check if there was any item selected
            if (drawable != undefined) {
                let previousSelected = document.getElementsByClassName('item-row')[drawable];
                previousSelected.classList.remove('active-item');
            }

            let currentSelected = document.getElementsByClassName('item-row')[row];
            currentSelected.classList.add('active-item');

            drawable = row;

            // Update the vehicle's tunning
            mp.trigger('addVehicleComponent', tunningComponents[selected].slot, drawable);
        }
    };
}

function confirmVehicleModification() {
    return function() {
        if (drawable !== undefined) {
            mp.trigger('confirmVehicleModification', tunningComponents[selected].slot, drawable);
        }
    };
}

function cancelVehicleModification() {
    return function() {
        // Remove the modified part
        mp.trigger('cancelVehicleModification');

        // Back to the home menu
        populateTunningHome();
    };
}

function deliverFastfoodOrder() {
    return function() {
        // Deliver the selected order
        if (selected != undefined) {
            mp.trigger('deliverFastfoodOrder', fastfoodOrders[selected].id);
        }
    };
}

function markSelectedCrime(row) {
    return function() {
        let crimeCurrent = crimesArray[row];
        if (selectedOptions.indexOf(crimeCurrent) === -1) {
            // Select the clicked element

            let currentSelected = document.getElementsByClassName('item-row')[row];
            currentSelected.classList.add('active-item');

            // Save the selected index
            selectedOptions.push(crimeCurrent);
        } else {
            // Delete the selection
            let currentSelected = document.getElementsByClassName('item-row')[row];
            currentSelected.classList.remove('active-item');

            // Remove the element from the array
            selectedOptions.splice(selectedOptions.indexOf(crimeCurrent), 1);
        }
    };
}

function applyCrimes() {
    return function() {
        // Apply the selected crimes
        if (selectedOptions.length > 0) {
            mp.trigger('applyCrimes', JSON.stringify(selectedOptions));
        }
    };
}

function loadCharacter(character) {
    return function() {
        // Load the selected character
        mp.trigger('loadCharacter', character);
    };
}

function showCharacterCreationMenu() {
    return function() {
        // Show the character creation menu
        mp.trigger('showCharacterCreationMenu');
    };
}

function getClothesByType(row) {
    return function() {
        selected = row;

        // Load the clothes from the zone
        mp.trigger('getClothesByType', row);
    };
}

function closeClothesMenu() {
    return function() {
        // Exit the menu
        mp.trigger('closeClothesMenu');
    };
}

function replacePlayerClothes(row, clothes) {
    return function() {
        if (drawable !== row) {
            if (drawable !== undefined) {
                let previousSelected = document.getElementsByClassName('item-row')[drawable];
                let previousAmountNode = findFirstChildByClass(previousSelected, 'item-amount-container');
                document.getElementsByClassName('item-add-substract-container')[drawable].classList.add('hidden');
                previousSelected.classList.remove('active-item');
                previousAmountNode.classList.add('hidden');
            }

            let currentSelected = document.getElementsByClassName('item-row')[row];
            let currentAmountNode = findFirstChildByClass(currentSelected, 'item-amount-container');
            document.getElementsByClassName('item-add-substract-container')[row].classList.remove('hidden');
            currentSelected.classList.add('active-item');
            currentAmountNode.classList.remove('hidden');

            purchasedAmount = 0;
            drawable = row;

            if (purchasedAmount < clothes.textures - 1) {
                // Show add button
                document.getElementsByClassName('item-adder')[drawable].classList.remove('hidden');
            } else {
                // Hide add button
                document.getElementsByClassName('item-adder')[drawable].classList.add('hidden');
            }

            document.getElementsByClassName('item-amount')[drawable].innerHTML = '<b>' + i18next.t('clothes.variation') + '</b>' + purchasedAmount;
            document.getElementsByClassName('item-substract')[drawable].classList.add('hidden');

            // Replace the clothes on the character
            mp.trigger('replacePlayerClothes', drawable, purchasedAmount);
        }
    };
}

function getNextClothes(clothes) {
    return function() {
        // Get next variation
        purchasedAmount++;

        let adderButton = document.getElementsByClassName('item-adder')[drawable];
        let substractButton = document.getElementsByClassName('item-substract')[drawable];

        if (purchasedAmount == clothes.textures - 1) {
            // Maximum reached
            adderButton.classList.add('hidden');
        } else if (substractButton.classList.contains('hidden') === true) {
            // Show the button
            substractButton.classList.remove('hidden');
        }

        let amountSpan = document.getElementsByClassName('item-amount')[drawable];
        amountSpan.innerHTML = '<b>' + i18next.t('clothes.variation') + '</b>' + purchasedAmount;

        // Replace the clothes on the character
        mp.trigger('replacePlayerClothes', drawable, purchasedAmount);
    };
}

function getPreviousClothes(clothes) {
    return function() {
        // Get previous variation
        purchasedAmount--;

        let adderButton = document.getElementsByClassName('item-adder')[drawable];
        let substractButton = document.getElementsByClassName('item-substract')[drawable];

        if (purchasedAmount == 0) {
            // Minimum reached
            substractButton.classList.add('hidden');
        } else if (adderButton.classList.contains('hidden') === true) {
            // Show the button
            adderButton.classList.remove('hidden');
        }
        if (purchasedAmount < 0) {
            purchasedAmount = 1;
        }
        let amountSpan = document.getElementsByClassName('item-amount')[drawable];
        amountSpan.innerHTML = '<b>' + i18next.t('clothes.variation') + '</b>' + purchasedAmount;

        // Replace the clothes on the character
        mp.trigger('replacePlayerClothes', drawable, purchasedAmount);
    };
}

function purchaseClothes() {
    return function() {
        if (selected != undefined) {
            mp.trigger('purchaseClothes', drawable, purchasedAmount);
        }
    };
}

function clearClothes() {
    return function() {
        // Back to the home menu
        populateClothesShopHome();

        // Clear player's clothes
        mp.trigger('clearClothes', drawable);
    };
}

function getZoneTattoos(row) {
    return function() {
        selected = row;

        // Load the tattoos for the zone
        mp.trigger('getZoneTattoos', row);
        mp.trigger('destroyBrowser');
    };
}

function exitTattooShop() {
    return function() {
        // Exit the menu
        mp.events.call('exitTattooShop');
    };
}

function addPlayerTattoo(row) {
    return function() {
        if (drawable !== row) {
            console.log("I am here");
            if (drawable != undefined) {
                console.log("drawable not undefined");
                let previousSelected = document.getElementsByClassName('item-row')[drawable];
                previousSelected.classList.remove('active-item');
            } else {
                console.log("drawable undefined");
                let currentSelected = document.getElementsByClassName('item-row')[row];
                currentSelected.classList.add('active-item');
                drawable = row;
            }
            // Update the tattoos
            console.log("Triggero");
            mp.trigger('addPlayerTattoo', drawable);
        }
    };
}

function purchaseTattoo() {
    return function() {
        if (selected != undefined) {
            mp.trigger('purchaseTattoo', selected, drawable);
        }
    };
}

function clearTattoos() {
    return function() {
        //  Back to the main menu
        populateTattooHome();

        // Clear the tattoos on the player
        mp.trigger('clearTattoos');
    };
}

function getNextFacialHair(row, maxValue) {
    return function() {
        selectedOptions[row]++;
        //go here
        let face = faceOptions[row];
        let adderButton = document.getElementsByClassName('item-adder')[row];
        let substractButton = document.getElementsByClassName('item-substract')[row];

        if (selectedOptions[row] == maxValue) {
            // Maximum reached
            adderButton.classList.add('hidden');
        } else if (substractButton.classList.contains('hidden')) {
            // Show the button
            substractButton.classList.remove('hidden');
        }

        let amountSpan = document.getElementsByClassName('item-amount')[row];
        amountSpan.innerHTML = '<b>' + i18next.t('character.type') + '</b>' + selectedOptions[row];

        // Update the hair
        mp.trigger('updateFacialHair', row, selectedOptions[row]);
    };
}

function getPreviousFacialHair(row, minValue) {
    return function() {
        selectedOptions[row]--;
        face = faceOptions[row];
        let adderButton = document.getElementsByClassName('item-adder')[row];
        let substractButton = document.getElementsByClassName('item-substract')[row];

        if (selectedOptions[row] == minValue) {
            // Minimum reached
            substractButton.classList.add('hidden');
        } else if (adderButton.classList.contains('hidden')) {
            // Show the button
            adderButton.classList.remove('hidden');
        }

        let amountSpan = document.getElementsByClassName('item-amount')[row];
        amountSpan.innerHTML = '<b>' + i18next.t('character.type') + '</b>' + selectedOptions[row];

        // Update the hair
        mp.trigger('updateFacialHair', row, selectedOptions[row]);
    };
}

function applyHairdresserChanges() {
    return function() {
        // Save the changes
        mp.trigger('applyHairdresserChanges');
    };
}

function cancelHairdresserChanges() {
    return function() {
        // Cancel the changes
        mp.trigger('cancelHairdresserChanges');
        mp.trigger('destroyBrowser');
    };
}

function townHallClick(row) {
    return function() {
        if (selected !== row) {

            if (selected != undefined) {
                let previousSelected = document.getElementsByClassName('item-row')[selected];
                previousSelected.classList.remove('active-item');
            }

            let currentSelected = document.getElementsByClassName('item-row')[row];
            currentSelected.classList.add('active-item');

            selected = row;

            // Change the text in the button
            let leftButton = document.getElementsByClassName('accept-button')[0];
            leftButton.textContent = (townHall != undefined && townHall.price > 0) ? i18next.t('townhall.pay') : i18next.t('townhall.check');
        }
    };
}

function executeTownHallOperation() {
    return function() {
        if (selected != undefined) {
            // Execute the selected operation
            mp.trigger('executeTownHallOperation', selected);
        }
    };
}

function markSelectedFine(row) {
    return function() {
        if (selectedOptions.indexOf(fine) === -1) {
            // Mark the selected item
            let currentSelected = document.getElementsByClassName('item-row')[row];
            currentSelected.classList.add('active-item');

            // Save the index
            selectedOptions.push(fine);
        } else {
            // Unmark the selected item
            let currentSelected = document.getElementsByClassName('item-row')[row];
            currentSelected.classList.remove('active-item');

            // Remove the index
            selectedOptions.splice(selectedOptions.indexOf(fine), 1);
        }
    };
}

function getCategoryAnimations(row) {
    return function() {
        // Load the animations from the category
        mp.trigger('AnimationCategorySelected', row);
    }
}

function playAnimation(row) {
    return function() {

        // Play the selected animation
        mp.trigger('RunAnimation', row);
    }
}

function payPlayerFines() {
    return function() {
        if (selectedOptions.length > 0) {
            // Pay the selected fines
            mp.trigger('payPlayerFines', JSON.stringify(selectedOptions));
        }
    };
}

function backTownHallIndex() {
    return function() {
        // Back to the main menu
        mp.trigger('backTownHallIndex');
    };
}

function proccessPoliceControlAction() {
    return function() {
        // Process the option and close the menu
        mp.trigger('proccessPoliceControlAction');
        mp.trigger('destroyBrowser');
    };
}

function getPlayerPurchasedClothes(type) {
    return function() {
        selected = type.slot;

        // Load the purchased clothes
        mp.trigger('getPlayerPurchasedClothes', selected);
    };
}

function closeWardrobeMenu() {
    return function() {
        // Exit the menu
        mp.trigger('closeWardrobeMenu');
    };
}

function previewPlayerClothes(row) {
    return function() {
        if (drawable !== row) {

            if (drawable != undefined) {
                let previousSelected = document.getElementsByClassName('item-row')[drawable];
                previousSelected.classList.remove('active-item');
            }

            let currentSelected = document.getElementsByClassName('item-row')[row];
            currentSelected.classList.add('active-item');

            drawable = row;

            // Update the player's clothes
            mp.trigger('previewPlayerClothes', drawable);
        }
    };
}

function changePlayerClothes() {
    return function() {
        if (selected != undefined) {
            mp.trigger('changePlayerClothes', selected, drawable);
        }
    };
}

function clearWardrobeClothes() {
    return function() {
        // Back to the main menu
        populateWardrobeHome();

        // Clear not dressed clothes
        mp.trigger('clearWardrobeClothes', selected);
    };
}

function executePhoneAction() {
    return function() {
        // Check if the user purchased anything
        if (selected != undefined) {
            mp.trigger('executePhoneAction', selected);
        }
    };
}