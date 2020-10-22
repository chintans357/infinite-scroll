//text-shadow variable declaration...
const header = document.querySelector("header");
const text = header.querySelector("h1");
const walk = 80;

//sliding-effect variable declaration...
let sliderImages;

//infinite-scroll variable declaration...
const count = 10;
const apiKey = "lYesx31WTYowL3AwURPwTpMHIu7kjMSWGzH2w8hQZ0A";
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

const imgContainer = document.querySelector("#image-container");
const loader = document.querySelector("#loader");

let photosArray = [];
let ready = false;
let totalImages = 0;
let imagesLoaded = 0;

//text-shadow functions declarations...
function shadow(e) {
  const { offsetWidth: width, offsetHeight: height } = header;
  let { offsetX: x, offsetY: y } = e;

  if (this !== e.target) {
    x = x + e.target.offsetLeft;
    y = y + e.target.offsetTop;
  }

  const xWalk = Math.round((x / width) * walk - walk / 2);
  const yWalk = Math.round((y / height) * walk - walk / 2);

  text.style.textShadow = `
  ${xWalk}px ${yWalk}px 2px #3E92CC
  `;
}

function normalShadow() {
  text.style.textShadow = `
  0px 0px 0px 
  `;
}

//infinite-scroll functions declarations...
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

function setAttr(elem, attributes) {
  for (const key in attributes) {
    elem.setAttribute(key, attributes[key]);
  }
}

function displayPhotos() {
  totalImages += photosArray.length;
  photosArray.forEach((photo) => {
    const a = document.createElement("a");
    setAttr(a, {
      href: photo.links.html,
      target: "_blank",
      class: "slide-in",
    });

    const img = document.createElement("img");
    setAttr(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    img.addEventListener("load", imageLoaded);
    a.append(img);
    imgContainer.append(a);
    sliderImages = document.querySelectorAll("img");
  });
}

async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
  } catch (error) {
    console.log(error);
  }
}

//sliding-effect functions declarations...
function debounce(func, wait = 5, immediate = true) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function checkSlide() {
  sliderImages.forEach((sliderImage) => {
    // half way through the image
    const slideInAt =
      window.scrollY + window.innerHeight - sliderImage.height / 2;
    // bottom of the image
    const imageBottom = sliderImage.offsetTop + sliderImage.height;
    const isHalfShown =
      slideInAt > sliderImage.offsetTop - sliderImage.offsetHeight / 3;
    const isNotScrolledPast = window.scrollY < imageBottom;
    if (isHalfShown && isNotScrolledPast) {
      sliderImage.classList.add("active");
    } else {
      sliderImage.classList.remove("active");
    }
  });
}

//Event Listeners...
header.addEventListener("mousemove", shadow);
header.addEventListener("mouseout", normalShadow);
window.addEventListener("scroll", debounce(checkSlide));

window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
      window.document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});

getPhotos();
