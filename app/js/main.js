$(function () {


  $('.product-top__link').on('click', function (e) {
    e.preventDefault();
    $('.product-top__link').removeClass('product-top__link--active');
    $(this).addClass('product-top__link--active');

    $('.product-page__wrapper-item').removeClass('product-page__wrapper-item--active');
    $($(this).attr('href')).addClass('product-page__wrapper-item--active');
  });

  $('.catalog-filter__select').styler({});


  var $range = $(".filters__price-input"),
    $inputFrom = $(".filter__from"),
    $inputTo = $(".filter__to"),
    instance,
    min = 0,
    max = 1000,
    from = 100,
    to = 1000;

  $range.ionRangeSlider({
    skin: "round",
    type: "double",
    onStart: updateInputs,
    onChange: updateInputs,


  });
  instance = $range.data("ionRangeSlider");

  function updateInputs(data) {
    from = data.from;
    to = data.to;

    $inputFrom.prop("value", from);
    $inputTo.prop("value", to);
  }


  $inputFrom.on("input", function () {
    var val = $(this).prop("value");

    // validate
    if (val < min) {
      val = min;
    } else if (val > to) {
      val = to;
    }

    instance.update({
      from: val
    });
  });

  $inputTo.on("input", function () {
    var val = $(this).prop("value");

    // validate
    if (val < from) {
      val = from;
    } else if (val > max) {
      val = max;
    }

    instance.update({
      to: val
    });
  });


  // счетчик


  window.addEventListener('click', function (even) {

    let counter;


    if (event.target.dataset.action === 'plus' || event.target.dataset.action === 'minus') {

      const counterWrapper = even.target.closest('.counter');

      counter = counterWrapper.querySelector('[data-counter]');
    };



    if (event.target.dataset.action === 'plus') {
      counter.innerText = ++counter.innerText;
    }


    if (event.target.dataset.action === 'minus') {

      if (parseInt(counter.innerText) > 1) {
        counter.innerText = --counter.innerText;
      } else if (this.event.target.closest('.basket-product') && parseInt(counter.innerText) === 1) {
        calcCartPrice();
      }
    }

    // Проверяем клик на + или - внутри корзины

    if (event.target.hasAttribute('data-action') && event.target.closest('.basket-product__catalog')) {
      // Пересчет общей стоимости товаров в корзине 

      calcCartPrice();
    }



  });


  // добавление товара в корзину

  const cartWrapper = document.querySelector('.basket-product');

  window.addEventListener('click', function () {

    if (event.target.hasAttribute('data-cart')) {

      const card = event.target.closest('.category__items-item');


      const productInfo = {
        id: card.dataset.id,
        imgSrc: card.querySelector('.category__img').getAttribute('src'),
        title: card.querySelector('.category__text').innerText,
        price: card.querySelector('.category__price').innerText,
        counter: card.querySelector('[data-counter]').innerText,
      };

      // Есть ли уже такой товар в корзине (проверка)

      const itemInCart = cartWrapper.querySelector(`[data-id="${productInfo.id}"]`);
      console.log(itemInCart);

      // Если товар есть в корзине

      if (itemInCart) {
        const counterElement = itemInCart.querySelector('[data-counter]');
        counterElement.innerText = parseInt(counterElement.innerText) + parseInt(productInfo.counter);
      } else {
        // Если товара нет в корзине


        // сборка товара в корзину

        const cartItemHTML = `<li class="basket-product__catalog">
         <article class="basket-product__item" data-id="${productInfo.id}">
         <a class="basket-product__link" href="#"></a>
        <img class="basket-product__img" src="${productInfo.imgSrc}" alt="Product">
        
        <div class="basket-product__box">
          <p class="basket-product__text">${productInfo.title}</p>
          
            <div class="counter">
              <button class="counter__minus counter__btn" data-action="minus"></button>
              <span class="counter__num" data-counter>${productInfo.counter}</span>
              <button class="counter__plus counter__btn" data-action="plus"></button>
            </div>

          <div class="basket-product__box-item">
            <span class="basket-product__num">${productInfo.price} </span>
            <span class="basket-product__price">1998₽ </span>
          </div>
        </div>

        <button class="basket-product__delete" data-action="delete">
          <svg class="basket-product__icon">
              <use xlink:href="images/stack/sprite.svg#remove-btn"></use>
            </svg>
        </button>
      </article>   
      </li>`;

        cartWrapper.insertAdjacentHTML('beforeend', cartItemHTML);
      }

      // Сбрасываем счетчик на 1
      card.querySelector('[data-counter]').innerText = '1';

      // Пересчет обей стоимости товара

      calcCartPrice();
    }
  });


  let swiperIMG = new Swiper('.swiper-img', {

    speed: 800,
    // spaceBetween: 85,
    grabCursor: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

    a11y: {
      enabled: true,
      nextSlideMessage: 'Next slide',
      prevSlideMessage: 'Previous slide',
      lastSlideMessage: 'This is the last slide',
      firstSlideMessage: 'This is the first slide',
      paginationBulletMessage: 'Go to slide {{index}}',
    },

    parallax: true,
    effect: 'coverflow',

    coverflowEffect: {
      rotate: 30,
      slideShadows: false,
    },

    keyboard: {
      enable: true,
      OnlyInViewport: true,
      pageUpDown: true,
    },

    breakpoints: {

      992: {

        effect: 'coverflow',

        coverflowEffect: {
          rotate: 30,
          slideShadows: false,
        },

      }

    }

  });

  let swiperPartners = new Swiper('.partners__swiper', {

    loop: true,
    speed: 800,
    grabCursor: true,


    a11y: {
      enabled: true,
      nextSlideMessage: 'Next slide',
      prevSlideMessage: 'Previous slide',
      lastSlideMessage: 'This is the last slide',
      firstSlideMessage: 'This is the first slide',
      paginationBulletMessage: 'Go to slide {{index}}',
    },


    breakpoints: {
      375: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 6,
      },
    }


  });

  let productSlide = new Swiper('.product-slide__swiper', {

    loop: true,
    speed: 500,
    // grabCursor: true,

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    a11y: {
      enabled: true,
      nextSlideMessage: 'Next slide',
      prevSlideMessage: 'Previous slide',
      lastSlideMessage: 'This is the last slide',
      firstSlideMessage: 'This is the first slide',
      paginationBulletMessage: 'Go to slide {{index}}',
    },
  });

  let productSlidePopup = new Swiper('.product-popup__swiper', {

    loop: true,
    speed: 500,
    // grabCursor: true,

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

    a11y: {
      enabled: true,
      nextSlideMessage: 'Next slide',
      prevSlideMessage: 'Previous slide',
      lastSlideMessage: 'This is the last slide',
      firstSlideMessage: 'This is the first slide',
      paginationBulletMessage: 'Go to slide {{index}}',
    },
  });

  let productSlideAddition = new Swiper('.product-addition__swiper', {

    loop: true,
    speed: 300,
    spaceBetween: 30,
    slidesPerView: 4,

    navigation: {
      nextEl: '.product-addition__next',
      prevEl: '.product-addition__prev',
    },

    

    a11y: {
      enabled: true,
      nextSlideMessage: 'Next slide',
      prevSlideMessage: 'Previous slide',
      lastSlideMessage: 'This is the last slide',
      firstSlideMessage: 'This is the first slide',
      paginationBulletMessage: 'Go to slide {{index}}',
    },
  });



  $('.product-slide__slide').click(function () {
    $.fancybox.open({
      src: '.product-popup',
      type: 'inline'
    });
  });




  $('[data-fancybox="images"]').fancybox({
    afterLoad: function (instance, current) {
      var pixelRatio = window.devicePixelRatio || 1;

      if (pixelRatio > 1.5) {
        current.width = current.width / pixelRatio;
        current.height = current.height / pixelRatio;
      }
    }
  });



  $(".star").rateYo({
    rating: 5,
    starWidth: "16px",
    normalFill: '#c1c1c1',
    numStars: 1,
    readOnly: true,
    ratedFill: "#ffb800"
  });

  $(".product__star").rateYo({
    rating: 5,
    starWidth: "16px",
    normalFill: '#c1c1c1',
    numStars: 1,
    readOnly: true,
    ratedFill: "#ffb800"
  });

  $(".product-content__star").rateYo({
    starWidth: "16px",
    normalFill: '#c1c1c1',
    numStars: 5,
    readOnly: true,
    ratedFill: "#ffb800"
  });

  $(".product-reviews__star").rateYo({
    starWidth: "16px",
    normalFill: '#c1c1c1',
    numStars: 5,
    readOnly: true,
    ratedFill: "#ffb800"
  });

  $(".product-reviews__star-item").rateYo({
    starWidth: "16px",
    normalFill: '#c1c1c1',
    numStars: 5,
    ratedFill: "#ffb800"
  });

  
  $('.client__search').on('click', function () {
    $('.menu-search').toggleClass('menu-search--active');
  });


  $('.menu__catalog').on('click', function () {
    $('.catalog').toggleClass('catalog--active');
    $('.menu__button').toggleClass('menu__button--active');
    $('.menu__button-item').toggleClass('menu__button-item--active');

  });

  $(".client__cart, .basket__icon").on('click', function () {
    $('.basket').toggleClass('basket--active');
    $('.basket-bg').toggleClass('basket-bg--active');
    $('body').toggleClass('body--active');
  });


  $('.catalog-filter__icon').on('click', function () {

    $('.catalog-filter__icon').removeClass('catalog-filter__icon--active');

    $(this).toggleClass('catalog-filter__icon--active');


  });

  $('.catalog-filter__btn--list').on('click', function () {

    $('.catalog-product').addClass('catalog-product--list');


  });

  $('.catalog-filter__btn--grid').on('click', function () {

    $('.catalog-product').removeClass('catalog-product--list');


  });



  var mixer = mixitup('.category__items');
  var mixer = mixitup('.product');

});