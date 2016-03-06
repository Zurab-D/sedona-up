/**
 * Мобильное меню
 */
(function(){
  var
    nav    = document.querySelector('.nav'),
    navBtn = nav.querySelector('.nav__btn')
  ;
  nav.classList.remove("nav--expand");
  navBtn.addEventListener("click", function() {
    nav.classList.toggle("nav--expand");
  });
}())
