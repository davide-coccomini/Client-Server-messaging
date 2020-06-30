const days = ['days.sunday', 'days.monday', 'days.tuesday', 'days.wednesday', 'days.thursday', 'days.friday', 'days.saturday'];
const months = ['months.january', 'months.february', 'months.march', 'months.april', 'months.may', 'months.june', 'months.july', 
                'months.august', 'months.september', 'months.october', 'months.november', 'months.december'];

let previousScreens = [];
let currentScreen = 'home';

function updateTimeDate(time, date) {
    // Parse de date to a readable format
    let currentDate = new Date(date);
    let dateString = i18next.t('general.date', { weekday: i18next.t(days[currentDate.getDay()]), day: currentDate.getDate(), month: i18next.t(months[currentDate.getMonth() + 1])});
    
    // Update the time and date nodes
    document.getElementById('time').textContent = time;
    document.getElementById('date').textContent = dateString;
}

function goBack() {
    // Check if the screen is not the homepage
    if (previousScreens.length === 0) return;

    // Hide the previous screen
    document.getElementById(currentScreen).classList.add('no-display');
    
    if (previousScreens.length === 1) {
        // Show the homepage
        toggleHomeScreen(false);
    } else {
        // Show the previous screen
        document.getElementById(previousScreens[previousScreens.length - 1]).classList.remove('no-display');
    }

    // Remove the previous screen from the buffer
    currentScreen = previousScreens[previousScreens.length - 1];
    previousScreens.pop();
}

function showHomeScreen() {
    // Check if the screen is not the homepage
    if (previousScreens.length === 0) return;

    // Add the classes needed
    toggleHomeScreen(false);

    // Hide the current screen
    document.getElementById(currentScreen).classList.add('no-display');

    // Remove all the screens and set home as the new one
    currentScreen = 'home';
    previousScreens = [];
}

function showNewScreen(screen) {
    // Switch the screen variable
    previousScreens.push(currentScreen);
    currentScreen = screen;

    if (previousScreens.length === 1) {
        // Hide the homepage
        toggleHomeScreen(true);
    }

    // Swap the screens
    document.getElementById(currentScreen).classList.remove('no-display');
    document.getElementById(previousScreens[previousScreens.length - 1]).classList.add('no-display');
}

function toggleHomeScreen(hide) {
    // Change the background
    let container = document.getElementById('container');

    if (hide) {
        container.classList.add('regular');
        container.classList.remove('home');
    } else {
        container.classList.add('home');
        container.classList.remove('regular');
    }

    if (hide) {
        // Hide the buttons
        document.getElementById('home').classList.add('no-display');
    } else {
        // Show the buttons
        document.getElementById('home').classList.remove('no-display');
    }

    // Change the top icons
    let content = document.getElementById('content').childNodes;

    for (let i = 0; i < content.length; i++) {
        // Search the NAV tag
        if (content[i].tagName !== 'NAV') continue;

        // Get the children nodes
        if (hide) {
            content[i].classList.add('regular');
            content[i].classList.remove('home');
        } else {
            content[i].classList.add('home');
            content[i].classList.remove('regular');
        }

        break;
    }
}

document.getElementsByClassName('calls-options')[0].addEventListener('click', function() {
    // Get the current element and its parent
    let target = event.target || event.srcElement;

    // Check if the element is already active
    if (target.classList.contains('option-active')) return;

    let elementParent = target.parentNode;

    // Get the position of the child
    let index = Array.prototype.indexOf.call(elementParent.children, target);

    // Add the active class to the other element
    document.getElementsByClassName('option-wrapper')[index].classList.add('option-active');

    if (index === 0) {
        // Remove the current active class
        document.getElementsByClassName('option-wrapper')[1].classList.remove('option-active');

        // Change the view
        document.getElementById('contact-list').classList.add('no-display');
        document.getElementById('latest-calls').classList.remove('no-display');
    } else {
        // Remove the current active class
        document.getElementsByClassName('option-wrapper')[0].classList.remove('option-active');

        // Change the view
        document.getElementById('latest-calls').classList.add('no-display');
        document.getElementById('contact-list').classList.remove('no-display');
    }
});

document.getElementById('dial-button').addEventListener('click', function() {
    // Switch the screen variable
    showNewScreen('dial-pad');
});

document.getElementsByClassName('number-container')[0].addEventListener('click', function() {
    // Get the display
    let display = document.getElementById('display');
    
    // Check the display length
    if (display.textContent !== undefined && display.textContent.length === 6) return;
    
    // Get the current element and its parent
    let target = event.target || event.srcElement;

    // Check if clicked on a number
    if (target.textContent.length > 1) return;
    
    // Get the clicked number and set it on the span
    display.textContent += target.textContent;
});

document.getElementById('backspace').addEventListener('click', function() {
    // Get the display
    let display = document.getElementById('display');
    
    // Check the display length
    if (display.textContent !== undefined && display.textContent.length === 0) return;
    
    // Remove the last digit from the phone
    display.textContent = display.textContent.slice(0, -1);
});

document.getElementById('call-icon').addEventListener('click', function() {
    // Get the display
    let display = document.getElementById('display');
    
    // Check the display length
    if (display.textContent !== undefined && display.textContent.length === 0) return;
    
    // Call the number
    mp.trigger('CallPhoneNumber', display.textContent);
});

document.getElementById('message-send').addEventListener('keyup', function(event) {
    // Check if the user pressed the ENTER key
    if (event.keyCode !== 13) return;
    
    // Check if the number is valid
    let text = event.srcElement.value;

    if (text === undefined || text.length === 0 || isNaN(text)) return;
    
    // Open the conversation with the number
    mp.trigger('LoadConversation', text);
});