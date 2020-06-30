let menuClosed = true;

function toggleMenu() {
    // Get the menu element and make the transition
    document.getElementById('menu').style.width = menuClosed ? '250px' : '0px';

    // Change the variable value
    menuClosed = !menuClosed;
}

function toggleSubmenu(element) {
    // Get the element submenu
    let subMenu = element.getElementsByClassName('side-submenu')[0];

    // Make the transition
    subMenu.style.height = subMenu.classList.contains('expanded') ? '0px' : (subMenu.children.length * 30) + 'px';
    element.getElementsByTagName('img')[0].style.transform = 'rotate(' + (subMenu.classList.contains('expanded') ? 0 : 180) + 'deg)';

    // Toggle the class
    subMenu.classList.toggle('expanded');
} 