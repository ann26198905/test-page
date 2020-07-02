$(document).ready(function() {
  
  $('.js-slider').slick({
infinite: false,
slidesToShow: 2,
dots: false,
arrows: true,
responsive: [
  {
    breakpoint: 375,
    settings: {
      slidesToShow: 0
    }
  }
]
    });

});