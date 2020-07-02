// $('.wrapper').addClass('loaded');
$(document).ready(function() {
$('.js-menu').click(function(event) {
    $('.menu-icon__span').toggleClass('active');
    $('.js-menu-body').toggleClass('active2');
    $('body').toggleClass('lock');
});

});