$(
    function(){
        var css = '\
.gotop-svg-wrapper{\
  display:none;\
}\
.gotop-svg{\
  width:100%;\
  height:100%;\
  fill:#488aae\
}\
#gotop{\
  display:none;\
  position:fixed;\
  width:51px;\
  height:51px;\
  right:7px;\
  bottom:20px;\
  z-index:99;\
  transition:none;\
}';
        var scroll_start = 300;
        var top = 0;
        $('head').append('<style>'+css+'</style>');
        $('body').append('\
<div class="gotop-svg-wrapper">\
<svg id="gotopSvg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">\
<path d="M256,0C114.624,0,0,114.624,0,256s114.624,256,256,256c141.404,0,256-114.624,256-256S397.404,0,256,0z M376.125,233.438\
  c-11.626,13.283-31.53,14.595-44.781,2.904L288,197.75V384c0,17.687-14.343,32-32,32c-17.67,0-32-14.313-32-32V199.782\
  l-42.157,37.062c-13.188,11.751-33.984,10.56-45.734-2.627c-11.767-13.248-10.576-33.53,2.624-45.28l95.673-85.155\
  c1.126-1.001,2.5-1.344,3.687-2.157c1.859-1.283,3.674-2.499,5.734-3.344c1.814-0.688,3.565-1.031,5.44-1.437\
  c2.186-0.438,4.249-0.845,6.499-0.845c1.875,0,3.687,0.375,5.562,0.72c2.125,0.374,4.188,0.749,6.249,1.593\
  c1.939,0.781,3.562,1.904,5.312,3.062c1.299,0.842,2.736,1.219,3.923,2.25l96.189,84.563\
  C386.25,199.875,387.812,220.125,376.125,233.438z"/>\
</svg></div>');
        $('body').append('<a href="#" id="gotop" title="Наверх &uarr;"><svg class="gotop-svg"><use xlink:href="#gotopSvg"></use></svg></a>');
        var s = $('#gotop');
        function gotop_scroll() {
            top = $(window).scrollTop();
            if (top < scroll_start)
                s.fadeOut('fast');
            else
                s.css('opacity',0.5).fadeIn('slow');
        }
        gotop_scroll();
        $(window).on('scroll', gotop_scroll);
        s.on(
            {
            mouseenter: function() {
                if(top > scroll_start) {
                    $(this).fadeTo('fast', 1.0);
                }
            },
            mouseleave: function() {
                if(top > scroll_start) {
                    $(this).fadeTo('fast', 0.5)
                }
            },
            click: function() {
                $('html, body').animate({scrollTop:0}, 'fast');
                return false;
            }
            }
        )
   }
);
