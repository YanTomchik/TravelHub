
'use strict';

let nationalityTourist;
let sexTourist;
let lastNameTourist;
let firstNameTourist;
let documentNumberTourist;
let expirationDateTourist;
let personalNumberTourist;
let birthDateTourist;


var worker;

function initWorker() {
	var blob = new Blob(
    [mrz_worker.toString().replace(/^function .+\{?|\}$/g, '')],
    { type:'text/javascript' }
  );
	var objectURL = URL.createObjectURL(blob);
	var worker = new Worker(objectURL);

  worker.addEventListener('error',function(e){
    console.log(e);
    $('html').html(['<pre>',e.message,' (',e.filename,':',e.lineno,':',e.colno,')</pre>'].join(''));
  },false);

  worker.addEventListener('message', function (e) {
    var data = e.data;

    switch (data.type) {
      case 'progress':
        $('.progress-text').text(data.msg.substr(0, 1).toUpperCase() + data.msg.substr(1));
        break;

      case 'error':
        $('.progress').removeClass('visible');
        console.log(data);
        setTimeout(function () {
          window.alert(data.error);
        }, 100);
        break;

      case 'result':
        $('.progress').removeClass('visible');
        const mainInfoScanner = document.getElementById('mainInfoScanner');
        if(mainInfoScanner){
          
        }
        showResult(data.result);
        break;

      default:
        console.log(data);
        break;
    }
  }, false);

  var pathname=document.location.pathname.split('/');
  pathname.pop();
  pathname=pathname.join('/');

  worker.postMessage({
    cmd: 'config',
    config: {
      fsRootUrl: document.location.origin+pathname
    }
  });

  return worker;
}


function startScannerMrzScript(elem){
  console.log(elem)
  try {
    worker = initWorker();
  } catch (err) {
    $('html').text(err.message);
  }
  $('#photo').on('change', function (e) {
    $('#detected, #parsed').empty();
//    $('#image').attr('src', '');
    var reader = new FileReader();
    reader.onload = function (e) {
//      $('#image').attr('src', e.target.result);
      $('.progress').addClass('visible');
      $('.progress-text').text('Processing...');
      worker.postMessage({
        cmd: 'process',
        image: e.target.result
      });
    };
    if (e.target.files.length) {
      reader.readAsDataURL(e.target.files[0]);
    }
  });
}


function showResult(result) {
  var html;
  var info;

  function escape(t) {
    return t.replace(/</g, '&lt;');
  }

  if (result.parsed && result.parsed.modified) {
    info = result.parsed.modified;
  } else if (result.ocrized) {
    info = result.ocrized;
  } else {
    info = [];
  }
  info = info.join('\n');

  if (result.error) {
    html = [
      '<div class="error">',
      escape(result.error),
      '</div>',
      '<pre>',
      escape(info),
      '</pre>'
    ];
  } else {
    if (result.parsed.valid) {
      // console.log(result.parsed.fields)
      nationalityTourist = result.parsed.fields.nationality;
      birthDateTourist = result.parsed.fields.birthDate;
      sexTourist = result.parsed.fields.sex;
      lastNameTourist = result.parsed.fields.lastName;
      firstNameTourist = result.parsed.fields.firstName;
      documentNumberTourist = result.parsed.fields.documentNumber;
      expirationDateTourist = result.parsed.fields.expirationDate;
      personalNumberTourist = result.parsed.fields.personalNumber;

      console.log(nationalityTourist)
      console.log(sexTourist)
      console.log(lastNameTourist)
      console.log(firstNameTourist)
      console.log(documentNumberTourist)
      console.log(expirationDateTourist)
      console.log(personalNumberTourist)
      console.log(birthDateTourist)

      expirationDateTourist = convertMRZDate(expirationDateTourist)
      birthDateTourist = convertMRZDate(birthDateTourist)
      nationalityTourist = convertCountryCode(nationalityTourist);
      console.log(nationalityTourist)

      // Получаем ссылки на элементы DOM
      const clientBirthday = document.getElementById('client-birthday');
      const clientLastnameEn = document.getElementById('client-lastnameen');
      const clientFirstnameEn = document.getElementById('client-firstnameen');
      let index = 1
      // Динамически формируем id для элементов
      const clientDocsExpireAt = document.getElementById(`client-docs-${index}-expireat`);
      const clientDocsNumber = document.getElementById(`client-docs-${index}-number`);
      const clientNationalitySelect = document.getElementById('client-nationality');
      const clientSexSelect = document.getElementById('client-sex');

      // Проверка наличия и присвоение значений
      if (clientBirthday) {
        clientBirthday.value = birthDateTourist;
      }

      if (clientLastnameEn) {
        clientLastnameEn.value = lastNameTourist;
      }

      if (clientFirstnameEn) {
        clientFirstnameEn.value = firstNameTourist;
      }

      if (clientDocsExpireAt) {
        clientDocsExpireAt.value = expirationDateTourist;
      }

      if (clientDocsNumber) {
        clientDocsNumber.value = documentNumberTourist;
      }

      // Проверка наличия элемента и установка значения для nationalityTourist
      if (clientNationalitySelect) {
        $('#client-nationality option').each(function () {
          if ($(this).data('country-code') === nationalityTourist) {
            // Устанавливаем выбранное значение селекта
            $(this).prop('selected', true);
          }
        });

        // Обновляем селект с учетом использования Select2
        $('#client-nationality').trigger('change.select2');
      }

      // Проверка наличия элемента и установка значения для sexTourist
      if (clientSexSelect) {
        $(clientSexSelect).val(sexTourist).trigger('change.select2');
      }     

      html = [
        '<pre>',
        escape(JSON.stringify(result.parsed.fields, false, 4)),
        '</pre>',
        '<pre>',
        escape(info),
        '</pre>'
      ];
    } else {
      if (result.parsed.details) {
        var details = [];
        result.parsed.details.forEach(function (d) {
          if (!d.valid) {
            details.push(d);
          }
        });
        info = [
          info,
          '',
          JSON.parse(details, false, 4),
        ].join('\n');
      }
      html = [
        '<pre>',
        'Could not parse ocrized text:',
        '<pre>',
        '</pre>',
        escape(info),
        '</pre>'
      ];
    }
  }
  
  // $('#parsed').html(html.join('\n'));
  showImages(['painted']/*result.images*/);
}

function showImages(images, callback, index) {
  if (!index) index = 0;

  if (index >= images.length) {
    if (callback) callback()
    return;
  }

  var random = Math.random();
  worker.addEventListener('message', function showImage(e) {
    var data = e.data;
    if (data.type == 'image' && data.random == random) {
      worker.removeEventListener('message', showImage);
      var imageData = new ImageData(data.rgba, data.width, data.height);
      var canvas = document.createElement('canvas');
      canvas.width = data.width;
      canvas.height = data.height;
      var ctx = canvas.getContext('2d');
      ctx.putImageData(imageData, 0, 0);
      $(canvas).attr('title', data.name);
      $('#detected').append(canvas);
      setTimeout(function () {
        showImages(images, callback, index + 1);
      });
    }
  }, false);

  worker.postMessage({
    cmd: 'get-image',
    image: images[index],
    random: random
  });
}

function convertMRZDate(mrzDate) {
  // Разбиваем строку на компоненты даты
  let year = parseInt(mrzDate.slice(0, 2));
  let month = mrzDate.slice(2, 4);
  let day = mrzDate.slice(4, 6);

  // Определяем текущее тысячелетие
  let currentYear = new Date().getFullYear();
  let currentCentury = Math.floor(currentYear / 100) * 100;

  // Определяем полный год
  let fullYear = currentCentury + year;

  // Если год больше текущего на 10 лет, то это дата из прошлого века
  if (fullYear > currentYear + 10) {
      fullYear -= 100;
  }

  // Форматируем дату в нужный формат
  return `${day}.${month}.${fullYear}`;
}

const countryCodes = {
  RUS: "RU",  // Россия
  BLR: "BY",  // Беларусь
  UKR: "UA",  // Украина
  KAZ: "KZ",  // Казахстан
  UZB: "UZ",  // Узбекистан
  TJK: "TJ",  // Таджикистан
  KGZ: "KG",  // Кыргызстан
  AZE: "AZ",  // Азербайджан
  ARM: "AM",  // Армения
  MDA: "MD",  // Молдова
  USA: "US",  // Соединенные Штаты Америки
  GBR: "GB",  // Великобритания
  FRA: "FR",  // Франция
  DEU: "DE",  // Германия
  ITA: "IT",  // Италия
  ESP: "ES",  // Испания
  NLD: "NL",  // Нидерланды
  BEL: "BE",  // Бельгия
  CHE: "CH",  // Швейцария
  AUT: "AT",  // Австрия
  SWE: "SE",  // Швеция
  NOR: "NO",  // Норвегия
  DNK: "DK",  // Дания
  FIN: "FI",  // Финляндия
  POL: "PL",  // Польша
  CZE: "CZ",  // Чехия
  HUN: "HU",  // Венгрия
  GRC: "GR",  // Греция
  PRT: "PT",  // Португалия
  IRL: "IE",  // Ирландия
  LUX: "LU",  // Люксембург
  ROU: "RO",  // Румыния
  BGR: "BG",  // Болгария
  EST: "EE",  // Эстония
  LVA: "LV",  // Латвия
  LTU: "LT",  // Литва
  HRV: "HR",  // Хорватия
  SVK: "SK",  // Словакия
  SVN: "SI",  // Словения
  MLT: "MT",  // Мальта
  CYP: "CY",  // Кипр
  ISL: "IS",  // Исландия
};


// Функция для преобразования кода
function convertCountryCode(alpha3Code) {
  return countryCodes[alpha3Code] || alpha3Code; // Если нет соответствия, возвращаем исходный код
}

