background =  {
    one: 'exported/featured-offer-1.png'
}
let state =  {
    position: 1
}
setNavigator()
const carouselContainer = document.querySelectorAll('.slide')
carouselContainer.forEach(slide => {
    slide.style.backgroundImage = `url('${background.one}')`
})
async function setNavigator() {
    if (state.position > 3) {
        state.position = 3
    }
    let widthCoefficient = (state.position === Math.floor(state.position)) ? state.position - state.position + 1 : state.position - Math.floor(state.position)
    if(state.position === Math.floor(state.position)) {
        if (state.position === 2) {
            document.querySelector(`.navigator:nth-child(1)`).style.width = `5px`
        } else if (state.position === 3) {
            document.querySelector(`.navigator:nth-child(1)`).style.width = `5px`
            document.querySelector(`.navigator:nth-child(2)`).style.width = `5px`
        }
    }
    document.querySelector(`.navigator:nth-child(${Math.ceil(state.position)})`).style.width = `${5 + 15 * widthCoefficient}px`
}
function setCarouselPosition(width, scrollLeft) {
    position = scrollLeft/width + 1
    state.position = position
    console.log(position)
}

document.querySelector('.carousel-frame').addEventListener('scroll', (e) => {
    //console.log(window.getComputedStyle(document.querySelector('.slide:nth-child(1)')).marginLeft)
    let leftScroll = document.querySelector('.carousel-frame').scrollLeft
    console.log(leftScroll)
    let width = parseInt(window.getComputedStyle(document.querySelector('.slide:nth-child(1)')).width, 10)
    console.log(width)
    setCarouselPosition(width, leftScroll)
    setNavigator()
})