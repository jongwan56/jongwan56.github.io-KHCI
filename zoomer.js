//var selectedSong = null; //made for passing song to play but now other feature is used
(function($) {
 $.fn.Zoomer = function(b) {
  var c = $.extend({
   speedView: 200,
   speedRemove: 400,
   altAnim: false,
   speedTitle: 400,
   debug: false
  }, b);
  var d = $.extend(c, b);

  function e(s) {
   if (typeof console != "undefined" && typeof console.debug != "undefined") {
    console.log(s)
   } else {
    alert(s)
   }
  }

  if (d.speedView == undefined || d.speedRemove == undefined || d.altAnim == undefined || d.speedTitle == undefined) {
   e('speedView: ' + d.speedView);
   e('speedRemove: ' + d.speedRemove);
   e('altAnim: ' + d.altAnim);
   e('speedTitle: ' + d.speedTitle);
   return false
  }

  if (d.debug == undefined) {
   e('speedView: ' + d.speedView);
   e('speedRemove: ' + d.speedRemove);
   e('altAnim: ' + d.altAnim);
   e('speedTitle: ' + d.speedTitle);
   return false
  }

  if (typeof d.speedView != "undefined" || typeof d.speedRemove != "undefined" || typeof d.altAnim != "undefined" || typeof d.speedTitle != "undefined") {
   if (d.debug == true) {
    e('speedView: ' + d.speedView);
    e('speedRemove: ' + d.speedRemove);
    e('altAnim: ' + d.altAnim);
    e('speedTitle: ' + d.speedTitle);
   }

   var mouseoverSong = false;
   var mouseStateChanged = false;

   function unfold(elem) {
    unfoldImage(elem);
    if (d.altAnim == true) {viewTitle(elem)}    
   }

   function unfoldImage(elem) {
    $(elem).css({
     'z-index': '10'
    });
    $(elem).addClass("hover").stop().animate({
     marginTop: '-0px',
     marginLeft: '-50px',
     top: '0%',
     left: '0%',
     width: '100px',
     height: '100px',
     paddingLeft: '8px'
    }, d.speedView);
   }

   function viewTitle(elem) {
    var a = $(elem).attr("alt");
     if (a.length != 0) {
      $(elem).closest('li').prepend('<span class="title">' + a + '</span>');
      $('.title').animate({
       marginLeft: '-50px',
       marginTop: '80px'
      }, d.speedTitle).css({
       'z-index': '11',
       'position': 'absolute',
       'float': 'left'
      })
     }
   }

   function fold(elem) {
    $(elem).css({
      'z-index': '0'
    });
    $(elem).removeClass("hover").stop().animate({
     marginTop: '0',
     marginLeft: '0',
     top: '0',
     left: '0',
     width: '100%',
     height: '100px',
     paddingLeft: '8px'
    }, d.speedRemove);
    $(elem).closest('li').find('.title').remove()
   }

   $(this).find('img').mouseover(function() {
    if(!mouseoverSong){
      mouseoverSong = true;
      unfold(this);
    }
   });
   $(this).closest('li').find('span').mouseover(function() {
    alert("haha")
   });
   $(this).find('img').mouseleave(function() {
    if(mouseoverSong){
      mouseoverSong = false;
      //$(this).closest('li').find('.title').mouseover(function() {mouseoverSong = true;console.log('haha')});
      //if(!mouseoverSong){
        fold(this);
      //}
    }
   });
   $(this).find('img').click(function(){
     play_list.push($(this).attr("alt"));
     //alert($(this).attr("alt"););
   });
  }
/* For test
  $('#square').click(function(){
    $('.thumb').toggle();
  });
  $('span').mouseover(function() {
    alert("haha")
  });
*/
 }
})(jQuery);