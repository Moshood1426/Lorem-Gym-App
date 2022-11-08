const menuBtn = document.querySelector(".menu-btn");
const hamburger = document.querySelector(".menu-btn__burger");
const navBar = document.querySelector(".intro_nav_list");
const carousel_Item = document.querySelectorAll(".feedback_carousel_item");
const active_carousel = document.querySelector("active");
const rightArrow = document.querySelector(".next");

let showMenu = false;
let currentCarouselIndex = 0;

menuBtn.addEventListener("click", () => toggleMenu(showMenu));

rightArrow.addEventListener("click", () => renderNextCarousel());

window.addEventListener("resize", () => toggleMenu(window.innerWidth < 450));

function toggleMenu(action) {
  if (!action) {
    hamburger.classList.add("open");
    navBar.style.visibility = "visible";
    navBar.style.opacity = 1;
    showMenu = true;
  } else {
    hamburger.classList.remove("open");
    navBar.style.visibility = "hidden";
    navBar.style.opacity = 0;
    showMenu = false;
  }
}

function renderNextCarousel() {
  const array = Array.from(carousel_Item); //gets all array in carousel

  //get current active carousel item
  const activeCarouselIndex = array.findIndex((item) =>
    item.classList.contains("active")
  );

  const length = array.length - 1; //gets total items in carousel

  if (activeCarouselIndex < length) {
    array.map((item, index) => {
      if (index === activeCarouselIndex) {
        item.classList.remove("active");
      } else if (index === activeCarouselIndex + 1) {
        item.classList.add("active");
      } else {
        return item;
      }
    });
  } else {
    array.map((item, index) => {
      if (index === length) {
        item.classList.remove("active");
      } else if (index === 0) {
        item.classList.add("active");
      } else {
        return item;
      }
    });
  }
}
