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

// Get the number of cards that can fit in the carouseljs at once
let cardPerView = Math.round(carouseljs.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carouseljs for infinite scrolling
carouselChildrens
  .slice(-cardPerView)
  .reverse()
  .forEach((card) => {
    carouseljs.insertAdjacentHTML('afterbegin', card.outerHTML);
  });

// Insert copies of the first few cards to end of carouseljs for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach((card) => {
  carouseljs.insertAdjacentHTML('beforeend', card.outerHTML);
});

// Scroll the carouseljs at appropriate postition to hide first few duplicate cards on Firefox
carouseljs.classList.add('no-transition');
carouseljs.scrollLeft = carouseljs.offsetWidth;
carouseljs.classList.remove('no-transition');

// Add event listeners for the arrow buttons to scroll the carouseljs left and right
arrowBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    carouseljs.scrollLeft +=
      btn.id == 'left' ? -firstCardWidth : firstCardWidth;
  });
});

const dragStart = (e) => {
  isDragging = true;
  carouseljs.classList.add('dragging');
  // Records the initial cursor and scroll position of the carouseljs
  startX = e.pageX;
  startScrollLeft = carouseljs.scrollLeft;
};

const dragging = (e) => {
  if (!isDragging) return; // if isDragging is false return from here
  // Updates the scroll position of the carouseljs based on the cursor movement
  carouseljs.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const dragStop = () => {
  isDragging = false;
  carouseljs.classList.remove('dragging');
};

const infiniteScroll = () => {
  // If the carouseljs is at the beginning, scroll to the end
  if (carouseljs.scrollLeft === 0) {
    carouseljs.classList.add('no-transition');
    carouseljs.scrollLeft = carouseljs.scrollWidth - 2 * carouseljs.offsetWidth;
    carouseljs.classList.remove('no-transition');
  }
  // If the carouseljs is at the end, scroll to the beginning
  else if (
    Math.ceil(carouseljs.scrollLeft) ===
    carouseljs.scrollWidth - carouseljs.offsetWidth
  ) {
    carouseljs.classList.add('no-transition');
    carouseljs.scrollLeft = carouseljs.offsetWidth;
    carouseljs.classList.remove('no-transition');
  }

  // Clear existing timeout & start autoplay if mouse is not hovering over carouseljs
  clearTimeout(timeoutId);
  if (!wrapper.matches(':hover')) autoPlay();
};

const autoPlay = () => {
  if (window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
  // Autoplay the carouseljs after every 2500 ms
  timeoutId = setTimeout(() => (carouseljs.scrollLeft += firstCardWidth), 2500);
};
autoPlay();

carouseljs.addEventListener('mousedown', dragStart);
carouseljs.addEventListener('mousemove', dragging);
document.addEventListener('mouseup', dragStop);
carouseljs.addEventListener('scroll', infiniteScroll);
wrapper.addEventListener('mouseenter', () => clearTimeout(timeoutId));
wrapper.addEventListener('mouseleave', autoPlay);
