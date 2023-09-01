const wrapper = document.querySelector('.wrapper');
const carouseljs = document.querySelector('.carouseljs');
const firstCardWidth = carouseljs.querySelector('.cardjs').offsetWidth;
const arrowBtns = document.querySelectorAll('.wrapper i');
const carouselChildrens = [...carouseljs.children];

let isDragging = false,
  isAutoPlay = true,
  startX,
  startScrollLeft,
  timeoutId;

let cardPerView = Math.round(carouseljs.offsetWidth / firstCardWidth);

carouselChildrens
  .slice(-cardPerView)
  .reverse()
  .forEach((card) => {
    carouseljs.insertAdjacentHTML('afterbegin', card.outerHTML);
  });

carouselChildrens.slice(0, cardPerView).forEach((card) => {
  carouseljs.insertAdjacentHTML('beforeend', card.outerHTML);
});

carouseljs.classList.add('no-transition');
carouseljs.scrollLeft = carouseljs.offsetWidth;
carouseljs.classList.remove('no-transition');

arrowBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    carouseljs.scrollLeft +=
      btn.id == 'left' ? -firstCardWidth : firstCardWidth;
  });
});

const dragStart = (e) => {
  isDragging = true;
  carouseljs.classList.add('dragging');
  startX = e.pageX;
  startScrollLeft = carouseljs.scrollLeft;
};

const dragging = (e) => {
  if (!isDragging) return;
  carouseljs.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const dragStop = () => {
  isDragging = false;
  carouseljs.classList.remove('dragging');
};

const infiniteScroll = () => {
  if (carouseljs.scrollLeft === 0) {
    carouseljs.classList.add('no-transition');
    carouseljs.scrollLeft = carouseljs.scrollWidth - 2 * carouseljs.offsetWidth;
    carouseljs.classList.remove('no-transition');
  } else if (
    Math.ceil(carouseljs.scrollLeft) ===
    carouseljs.scrollWidth - carouseljs.offsetWidth
  ) {
    carouseljs.classList.add('no-transition');
    carouseljs.scrollLeft = carouseljs.offsetWidth;
    carouseljs.classList.remove('no-transition');
  }

  clearTimeout(timeoutId);
  if (!wrapper.matches(':hover')) autoPlay();
};

const autoPlay = () => {
  if (window.innerWidth < 800 || !isAutoPlay) return;
  timeoutId = setTimeout(() => (carouseljs.scrollLeft += firstCardWidth), 2500);
};
autoPlay();

carouseljs.addEventListener('mousedown', dragStart);
carouseljs.addEventListener('mousemove', dragging);
document.addEventListener('mouseup', dragStop);
carouseljs.addEventListener('scroll', infiniteScroll);
wrapper.addEventListener('mouseenter', () => clearTimeout(timeoutId));
wrapper.addEventListener('mouseleave', autoPlay);
