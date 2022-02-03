





document.addEventListener('DOMContentLoaded', () => {

  
  let swiperContent = new Swiper('.swiper-content', {

    // loop: true,
    spaceBetween: 85,
    navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  });

  let swiperIMG = new Swiper('.swiper-img', {

    // loop: true,
    parallax: true,
    speed: 2000,
    parallax: true,
  
  });

  swiperContent.controller.control = swiperIMG;
  swiperIMG.controller.control = swiperContent;

});

var mixer = mixitup('.category__items');