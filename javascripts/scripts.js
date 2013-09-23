$(document).ready(function(){

	/// menu

    $(window).scroll(function(){
     var divOffset2 = $('.shrink-nav').offset();
     if(window.scrollY > divOffset2.top ){
        $('.main-nav').addClass('small-nav');
     }
     if(window.scrollY < divOffset2.top){
        $('.main-nav').removeClass('small-nav');
     }
    });

jQuery(document).ready(function($) {
  var rsi = $('#slider-in-laptop').royalSlider({
    autoHeight: false,
    arrowsNav: false,
    fadeinLoadedSlide: false,
    controlNavigationSpacing: 0,
    controlNavigation: 'bullets',
    imageScaleMode: 'fill',
    imageAlignCenter:true,
    loop: false,
    loopRewind: false,
    numImagesToPreload: 6,
    keyboardNavEnabled: true,
    autoScaleSlider: false,  
    autoScaleSliderWidth: 320,     
    autoScaleSliderHeight: 568
  }).data('royalSlider');
  $('#slider-next').click(function() {
    rsi.next();
  });
  $('#slider-prev').click(function() {
    rsi.prev();
  });
});

  //test slider

  $('.test-item:first-of-type').addClass('active');

  $('ol.carousel-indicators li:first-of-type').addClass('active');
    

});
