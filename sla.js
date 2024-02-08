const slider = document.querySelector('.fundo');
slider.addEventListener('touchstart', onTouchStart);
slider.addEventListener('touchend', onTouchEnd);
var startPoint = 0;
var drag = 0;
var currentImage = 0;

var parentSlider = ''
var divSlider = ''


function onTouchStart(event) {
    slider.classList.remove('transition');
    startPoint = event.touches[0].clientX;
    slider.addEventListener('touchmove', onMouseMove);
}

function onTouchMove(event) {
    let sliderImage = document.querySelector('.sliderImage');
    if (event.touches[0].clientX - startPoint < 0 && currentImage < 3) {
        slider.style.transform = `translateX(${event.touches[0].clientX - startPoint - sliderImage.offsetWidth * currentImage}px)`;
    } else if (event.touches[0].clientX - startPoint > 0 && currentImage > 0) {
        slider.style.transform = `translateX(${event.touches[0].clientX - startPoint - sliderImage.offsetWidth * currentImage}px)`;
    }
    drag = event.touches[0].clientX - startPoint;
}

function onTouchEnd(event) {
    let sliderPosition = document.querySelectorAll('.sliderPositionCount');
    let sliderImage = document.querySelector('.sliderImage');
    slider.removeEventListener('touchmove', onMouseMove);
    if (drag < -120 && currentImage < 3) {
        slider.classList.add('transition');
        slider.style.transform = `translateX(-${sliderImage.offsetWidth * (currentImage + 1)}px)`;
        sliderPosition[currentImage].classList.remove('sliderPositionSelected');
        sliderPosition[currentImage + 1].classList.add('sliderPositionSelected');
        currentImage++;
    } else if (drag > 120 && currentImage > 0) {
        slider.classList.add('transition');
        slider.style.transform = `translateX(-${sliderImage.offsetWidth * (currentImage - 1)}px)`;
        sliderPosition[currentImage].classList.remove('sliderPositionSelected');
        sliderPosition[currentImage - 1].classList.add('sliderPositionSelected');
        currentImage--;
    } else {
        slider.style.transform = `translateX(-${sliderImage.offsetWidth * currentImage}px)`;
    }
}