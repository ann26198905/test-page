$(document).ready(function() {
    //изменение цвета ссылок меню и цвета svg
    $(".header__link").on('click', function () {
        $(".header__link").removeClass("header__link_active");
        $(this).toggleClass("header__link_active");
        $(".header__link>.svg").removeClass("svg-active");
        $(".header__link_active>.svg").toggleClass("svg-active");
    });  

    //hide and show 1popup
    $(".js-popup").on('click', function () {
        $('.js-hidden-block').removeClass('hide');
    });
    
    $('.popup__close').mouseup(function() {
        $('.js-hidden-block').addClass('hide');
    });
    
    $(document).keyup(function(e) {
        if (e.keyCode === 27) { 
            $('.js-hidden-block').addClass('hide');
        }
    });

    //hide and show 2popup
    $(".js-1popup-submit").on('click', function () {
        $('.js-hidden-block2').removeClass('hide');
    });

    $('.js-close').on('click', function () {
        $('.js-hidden-block2').addClass('hide');
        $('.js-hidden-block').addClass('hide');
    });
    
    $('.popup__close').mouseup(function() {
        $('.js-hidden-block2').addClass('hide');
    });
 
    $(document).keyup(function(e) {
        if (e.keyCode === 27) { 
            $('.js-hidden-block2').addClass('hide');
        }
    });

    //hide and show pictures-popup
    $(".js-block-popup").on('click', function () {
        $('.js-pictures-popup').removeClass('hide');
    });

    $('body').mouseup(function() {
        $('.js-pictures-popup').addClass('hide');
        });
 
    $('body').keyup(function() {
        $('.js-pictures-popup').addClass('hide');
    });
});