'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const opContents = document.querySelectorAll('.operations__content');
const header1 = document.querySelector('.header');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// SMOOTH SCROLL

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  section1.scrollIntoView({ behavior: 'smooth' });
});

//page navigation

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

// tabs

tabContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  tabs.forEach(x => x.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  opContents.forEach(x => x.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// links fading
const linkContainer = document.querySelector('.nav');
const links = document.querySelectorAll('.nav__link');

const fadeFunc = function (e) {
  if (e.target.classList.contains('nav__link')) {
    links.forEach(x => {
      if (x !== e.target) {
        x.style.opacity = this;
      }
    });
    linkContainer.querySelector('img').style.opacity = this;
  }
};

linkContainer.addEventListener('mouseover', fadeFunc.bind(0.5));
linkContainer.addEventListener('mouseout', fadeFunc.bind(1));

// sticky header

const obsCallback = function (entries, observer) {
  if (!entries[0].isIntersecting) {
    document.querySelector('.nav').classList.add('sticky');
  } else {
    document.querySelector('.nav').classList.remove('sticky');
  }
};

const obsOptions = {
  root: null,

  threshold: [0, 0.2], // more hresholds
  rootMargin: `${-document.querySelector('.nav').getBoundingClientRect()
    .height}px`,
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(header1);

// reveal sections

const sections1 = document.querySelectorAll('.section');

const secObsCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const secObsOptions = {
  root: null,
  threshold: 0.15,
};

const secObserver = new IntersectionObserver(secObsCallback, secObsOptions);

sections1.forEach(function (section) {
  secObserver.observe(section);
});

// lazy loading
const lazyImgs = document.querySelectorAll('img[data-src]');

const lazyImgCallback = function (entries, observer) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;

    entry.target.setAttribute('src', entry.target.dataset.src);

    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  });
  // const [entry] = entries;
};

const lazyImgOptions = {
  root: null,
  threshold: 0,
};

const lazyImgObserver = new IntersectionObserver(
  lazyImgCallback,
  lazyImgOptions
);

lazyImgs.forEach(function (img) {
  lazyImgObserver.observe(img);
});

// slider

const theSlider = function () {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const leftBtn = document.querySelector('.slider__btn--left');
  const rightBtn = document.querySelector('.slider__btn--right');
  const dots = document.querySelector('.dots');

  let curSlide = 0;

  const setSlides = function (curSlide) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${(i - curSlide) * 100}%)`;
    });
  };

  const activateDots = function (curSlide) {
    dots.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    dots
      .querySelector(`.dots__dot[data-slide="${curSlide}"]`)
      .classList.add('dots__dot--active');
  };

  const createDots = function () {
    slides.forEach(function (_, i) {
      dots.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot ${
          i == 0 && 'dots__dot--active'
        }' data-slide='${i}'></button>`
      );
    });
  };

  const slideNext = function () {
    curSlide++;
    if (curSlide === slides.length) curSlide = 0;
    setSlides(curSlide);
    activateDots(curSlide);
  };

  const slidePrevious = function () {
    curSlide--;
    if (curSlide === -1) curSlide = slides.length - 1;
    setSlides(curSlide);
    activateDots(curSlide);
  };

  const init = function () {
    setSlides(0);
    createDots();
  };

  init();

  //eventListeners
  rightBtn.addEventListener('click', slideNext);
  leftBtn.addEventListener('click', slidePrevious);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      slideNext();
    } else if (e.key === 'ArrowLeft') {
      slidePrevious();
    }
  });

  dots.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dots__dot')) return;
    curSlide = e.target.dataset.slide;
    setSlides(curSlide);
    activateDots(curSlide);
  });
};
theSlider();

// cookie message
const header = document.querySelector('.header');
const message = document.createElement('div');
message.classList.add('cookie-message');
message.textContent = `We use cookies for improved functionality and analytics`;
message.innerHTML = `We use cookies for improved functionality and analytics<button class='btn btn--close-cookie'>Got it!</button>`;

header.append(message);

document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  message.remove();
});
