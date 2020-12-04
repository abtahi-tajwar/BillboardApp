const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");
const links = document.querySelectorAll(".menu li");


hamburger.addEventListener("click", () => {
    menu.classList.toggle("open");
    links.forEach(link => {
        link.classList.toggle("fade");
    })
});


const hamburgerMenuButton = document.querySelector('.menuButton')
const state = {
    hamburgerMenu: false
}
hamburgerMenuButton.addEventListener('click', toggleMenu)
addStaggerToLists(1)
function toggleMenu() {
    console.log('tapped')
    const hamburgerMenu = document.querySelector('.menuItems')
    
    if(state.hamburgerMenu === true) {
        state.hamburgerMenu = false
        changeListItemVisual(state.hamburgerMenu)
        hamburgerMenu.style.height = '0px'        
    } else {        
        hamburgerMenu.style.height = '500px' 
        state.hamburgerMenu = true
        changeListItemVisual(state.hamburgerMenu)
    }
}

function changeListItemVisual(view) {
    const listItem = document.querySelectorAll('.menuItems ul li')
    if (view) {
        listItem.forEach(item => {
            item.style.display = `block`
        })
    } else {
        listItem.forEach(item => {
            item.style.display = `none`
        })
    }
    
}

function addStaggerToLists(time) {
    const listItem = document.querySelectorAll('.menuItems ul li')
    listItem.forEach((item, i) => {
        item.style.animation = `${time}s slideIn ${.1*i + .5}s backwards`
    })
}