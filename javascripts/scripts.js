$(document).ready(function(){


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

  $( ".form-table" ).addClass( "table" ); 
  $( ".button-primary" ).addClass( "btn-primary btn-default btn btn-lg pull-right" ); 
  $( "input[type='text']" ).addClass( "form-control input-lg" );  
jQuery('input[name$="email"]').attr('placeholder', 'Your email ex: john@doe.com');  

});
