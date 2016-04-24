'use strict';

/** Мобильное меню */
(function(){
  var
    nav    = document.querySelector('.nav'),
    navBtn = nav.querySelector('.nav__btn')
  ;
  nav.classList.remove("nav--expand");
  navBtn.addEventListener("click", function() {
    nav.classList.toggle("nav--expand");
  });
}());


/** Вычисляемые поля */
(function(){
  /** Инициализация блока вычисляемого поля
   *  Значения параметров "по умолчанию"" находянтся в переменной myOptions
   *  @param {Object} options - параметры, значения которых отличаются от значений по умолчанию.
   *    требуется указать как минимум селектор основного DOM-элемента (mainElemSelector)
   *  @param {Function} onInputChange - функция которая вызывается при изменении инпута
   */
  function initCalcBlock(options, onInputChange) {
    var myOptions = {
      mainElemSelector: '',
      btnPlusSelector: '.calc__button--plus',
      btnMinusSelector: '.calc__button--minus',
      elemInputSelector: '.calc__input'
    };

    // изменяем дефолтные значения параметров, если изменения были переданы в options
    if (options) {
      for (var property in myOptions) {
        if (property in options && options[property]) {
          myOptions[property] = options[property];
        }
      }
    };

    var
      mainElem = document.querySelector(myOptions.mainElemSelector),
      btnPlus = mainElem && mainElem.querySelector(myOptions.btnPlusSelector),
      btnMinus = mainElem && mainElem.querySelector(myOptions.btnMinusSelector),
      elemInput = mainElem && mainElem.querySelector(myOptions.elemInputSelector)
    ;

    // выходим, если элемент не найден
    if (!mainElem) {
      return;
    };


    /** Повесить обработчик на все события изменения элемента.
     * Идея взята отсюда: https://learn.javascript.ru/events-change
     */
    function changeFormElement(element, functionElementProcessor) {
      element.onchange = element.onkeyup = element.oninput = functionElementProcessor;
      element.onpropertychange = function(event) {
        if (event.propertyName === 'value') {
          functionElementProcessor();
        }
      };
      element.oncut = function() {
        setTimeout(functionElementProcessor, 0); // на момент oncut значение еще старое
      };
    };

    // ф-ция, отслеживающая изменение значения поля и вызывающаа коллбэк
    function changeFormElementT(element, callback) {
      var preValue = null;
      return setInterval(function() {
        if (element.value !== preValue) {
          preValue = element.value;
          if (typeof(callback) === 'function') {
            callback(element);
          }
        };
      }, 50);
    };

    // вычислить новое значение инпута
    function calcInputValue(isClickedPlus) {
      isClickedPlus = typeof(isClickedPlus) === 'boolean' ? isClickedPlus : true;
      var startValue = parseInt(elemInput.value) || 0;
      var result = isClickedPlus ? startValue + 1 : startValue - 1;
      return result > 0 ? result : 1;
    };

    // взводим обработчик кнопки "плюс"
    btnPlus.addEventListener('click', function() {
      elemInput.value = calcInputValue();
    });

    // взводим обработчик кнопки "минус"
    btnMinus.addEventListener('click', function() {
      elemInput.value = calcInputValue(false);
    });

    // навесим на инпут функцию реагирования на изменение значения
    changeFormElementT(elemInput, onInputChange);
  };


  // инициализация блока кол-ва дней
  initCalcBlock({mainElemSelector: '.calc.calc--days'}, function(elemInput){
    var elemDateIn = document.querySelector('#date_checkin');
    var elemDateOut = document.querySelector('#date_checkout');

    var dateStart = moment(elemDateIn.value, 'DD.MM.YYYY');
    var dateEnd = dateStart.add(parseInt(elemInput.value), 'd');

    elemDateOut.value = dateEnd.format('DD.MM.YYYY');
  });

  // инициализация блока кол-ва путешественников
  initCalcBlock({mainElemSelector: '.calc.calc--travellers'}, function(elemInput) {
    var template = document.querySelector('#template_traveller');
    var container = document.querySelector('#travellers_container');
    if (!template || !container) {
      return;
    }
    var count = parseInt(elemInput.value);
    var travellersInContainer = container.querySelectorAll('.traveller');
    var countNew = count - travellersInContainer.length;

    if (countNew > 0) {
      for (var i = 0; i < countNew; i++) {
        var newElem = document.createElement('div');
        newElem.classList.add('traveller');
        newElem.innerHTML = Mustache.render(template.innerHTML, {"no": count + i});
        container.appendChild(newElem);
      }
    } else {
      for (
        var i = travellersInContainer.length;
        i > travellersInContainer.length + countNew;
        i--
      ) {
        container.removeChild(travellersInContainer[i-1]);
      }
    }
  });
}());


/** Обработка фотографий */
(function () {
  var form = document.forms[0];
  //--- Фотографии ----------------
  if (form && "FileReader" in window) {
    var
      inputFile = form.querySelector("#input_file"),
      picsArea = form.querySelector(".upload-pics"),
      templatePic = form.querySelector("#pic_template").innerHTML
    ;

    // вешаем событие на выбор файла
    inputFile && inputFile.addEventListener("change", function() {
      for (var i = 0; i < this.files.length; i++) {
        preview(this.files[i]);
      };
      this.value = "";
    });

    // функция добавления фото
    function preview(file) {
      if (file.type.match(/image.*/)) {
        var reader = new FileReader();

        reader.addEventListener("load", function(event) {
          var html = Mustache.render(templatePic, {
            "img-src": event.target.result,
            "img-alt": file.name,
            "img-label": file.name
          });

          var pic = document.createElement("div");
          pic.classList.add("upload-pics__item");
          pic.innerHTML = html;
          pic.file = file;
          picsArea.appendChild(pic);

          pic.querySelector(".upload-pics__item-del").addEventListener("click", function(event) {
            event.preventDefault();
            addRemovePhotoFunction(pic);
          });
          //queue.push({"file": file, "div": pic});
        });

        reader.readAsDataURL(file);
      };
    };

    // Удаление фотографий
    function addRemovePhotoFunction(photo) {
      photo.addEventListener('click', function(event) {
        console.log(event.target);
        console.log(event.target.parentNode);
        picsArea.removeChild(event.target.parentNode);
      });
    };

    /*var btnDelAll = picsArea.querySelectorAll('.upload-pics__item-del');
    [].forEach.call(btnDelAll, function(item) {
      item.addEventListener('click', function(event) {
        picsArea.removeChild(event.target.parentNode);
      });
    });*/
  }
}());


/** Отправка формы */
(function() {
  var form = document.forms[0];
  if (form) {
    var picsArea = form.querySelector(".upload-pics"),
        msg = document.querySelector('.modal--success'),
        btn = msg.querySelector('.modal__btn');

    // функция отправки запроса по Ajax
    function request (dataQS, url, func) {
      var
        xhr = new XMLHttpRequest(),
        time = (new Date()).getTime(),
        url = url +'?'+ time
      ;

      xhr.open("post", url);
      xhr.addEventListener("readystatechange", function() {
        if (xhr.readyState == 4) {
          func(xhr.responseText);
        };
      });
      xhr.send(dataQS);
    };

    // обработка submit формы
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      var data = new FormData(form),
          pics = picsArea.querySelectorAll('.upload-pics__item');

      [].forEach.call(pics, function(item) {
        data.append("images", item.file);
        //console.log(item.file);
      });

      request(data, form.action, function(response) {
        console.log("server response: \n\"" + response+"\"");
        showMsgOk();
      });
    });

    // показать что все отправилось
    function showMsgOk() {
      btn.addEventListener('click', closeMsgOk);
      document.body.classList.add('veiled');
      msg.style.display = 'block';
    }

    // показать что все отправилось
    function closeMsgOk() {
      btn.removeEventListener('click', closeMsgOk);
      msg.style.display = 'none';
      location.pathname = '';
    }
  }
}());
