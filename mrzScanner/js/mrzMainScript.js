
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

function initWorker(type) {
  var blob = new Blob(
    [mrz_worker.toString().replace(/^function .+\{?|\}$/g, '')],
    { type: 'text/javascript' }
  );
  var objectURL = URL.createObjectURL(blob);
  var worker = new Worker(objectURL);

  worker.addEventListener('error', function (e) {
    console.log(e);
    document.querySelector('html').innerHTML = `<pre>${e.message} (${e.filename}:${e.lineno}:${e.colno})</pre>`;
  }, false);

  worker.addEventListener('message', function (e) {
    var data = e.data;

    switch (data.type) {
      case 'progress':
        break;

      case 'error':

        document.querySelectorAll('.progress').forEach(elem => {
          elem.classList.remove('visible');
        })
        console.log(data);
        setTimeout(function () {
          window.alert(data.error);
        }, 100);
        break;

      case 'result':
        document.querySelectorAll('.progress').forEach(elem => {
          elem.classList.remove('visible');
        })
        showResult(data.result);
        break;

      default:
        console.log(data);
        break;
    }
  }, false);

  var pathname = document.location.pathname.split('/');
  pathname.pop();
  pathname = pathname.join('/');

  worker.postMessage({
    cmd: 'config',
    config: {
      fsRootUrl: document.location.origin + pathname
    }
  });

  return worker;
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.attach-file').forEach((inputFile, index) => {
    inputFile.addEventListener('change', function (e) {
      const scannerWrapper = inputFile.closest('.scannerdoc-wrapper');

      console.log(scannerWrapper)
      if (scannerWrapper) {
        scannerWrapper.querySelector('.detected').innerHTML = '';
        scannerWrapper.querySelector('.parsed').innerHTML = '';

        var reader = new FileReader();
        reader.onload = function (e) {
          scannerWrapper.querySelector('.progress').classList.add('visible');
          worker = initWorker();  // Инициализируем Worker с type и index
          worker.postMessage({
            cmd: 'process',
            image: e.target.result
          });
        };

        if (e.target.files.length) {
          reader.readAsDataURL(e.target.files[0]);
        }
      }
    });
  });
});

function showResult(result) {
  var html;
  var info;

  function escape(t) {
    return t.replace(/</g, '&lt;');
  }

  console.log(result);

  if (result.parsed && result.parsed.modified) {
    info = result.parsed.modified;
  } else if (result.ocrized) {
    info = result.ocrized;
  } else {
    info = [];
  }
  info = info.join('\n');

  if (result.error) {
    html = `
      <div class="error">
        ${escape(result.error)}
      </div>
      <pre>${escape(info)}</pre>
    `;
    document.querySelector('#parsed').innerHTML = `<h2 style="margin-top:10px; color:#F64E60;">Что-то пошло не так</h2>`;
  } else {
    if (result.parsed.valid) {
      nationalityTourist = result.parsed.fields.nationality;
      birthDateTourist = result.parsed.fields.birthDate;
      sexTourist = result.parsed.fields.sex;
      lastNameTourist = result.parsed.fields.lastName;
      firstNameTourist = result.parsed.fields.firstName;
      documentNumberTourist = result.parsed.fields.documentNumber;
      expirationDateTourist = result.parsed.fields.expirationDate;
      personalNumberTourist = result.parsed.fields.personalNumber;

      expirationDateTourist = convertMRZDate(expirationDateTourist);
      birthDateTourist = convertMRZDate(birthDateTourist);
      nationalityTourist = convertCountryCode(nationalityTourist);


      const clientBirthday = document.getElementById('client-birthday');
      const clientLastnameEn = document.getElementById('client-lastnameen');
      const clientFirstnameEn = document.getElementById('client-firstnameen');
      const clientNationalitySelect = document.getElementById('client-nationality');
      const clientSexSelect = document.getElementById('client-sex');
      if (clientBirthday) {
        clientBirthday.value = birthDateTourist;
        $(clientBirthday).addClass('animated-field active');
      }

      if (clientLastnameEn) {
        clientLastnameEn.value = lastNameTourist;
        $(clientLastnameEn).addClass('animated-field active');
      }

      if (clientFirstnameEn) {
        clientFirstnameEn.value = firstNameTourist;
        $(clientFirstnameEn).addClass('animated-field active');
      }

      if (clientNationalitySelect) {
        $('#client-nationality option').each(function () {
          if ($(this).data('country-code') === nationalityTourist) {
            $(this).prop('selected', true);
          }
        });
        $('#client-nationality').next().find('.selection').children().addClass('animated-field active');

        $('#client-nationality').trigger('change.select2')

      }

      const clientDocs = document.getElementById('client-docs')
      
      if(clientDocs){
        const multipleListElem = clientDocs.querySelector('.multiple-input-list');
        let firstItem = multipleListElem.querySelector('.multiple-input-list__item');
        let dataIndex = firstItem.getAttribute('data-index');

        const clientDocsExpireAt = document.getElementById(`client-docs-${dataIndex}-expireat`);
        const clientDocsNumber = document.getElementById(`client-docs-${dataIndex}-number`);

        if (clientDocsExpireAt) {
          clientDocsExpireAt.value = expirationDateTourist;
          $(clientDocsExpireAt).addClass('animated-field active');
        }
  
        if (clientDocsNumber) {
          clientDocsNumber.value = documentNumberTourist;
          $(clientDocsNumber).addClass('animated-field active');
        }
      }

      

      if (clientSexSelect) {
        $(clientSexSelect).next().find('.selection').children().addClass('animated-field active');
        $(clientSexSelect).val(sexTourist).trigger('change.select2')
      }

      

      document.querySelector('#parsed').innerHTML = `<h2 style="margin-top:10px; color:#3E7B50;">Документ успешно отсканирован</h2>`;
      setTimeout(() => {
        $('.animated-field').removeClass('active');
      }, 1000);

    } else {
      if (result.parsed.details) {
        var details = [];
        result.parsed.details.forEach(function (d) {
          if (!d.valid) {
            details.push(d);
          }
        });
        info = `
          ${info}
          <pre>${JSON.stringify(details, false, 4)}</pre>
        `;
      }

      html = `
        <pre>Could not parse ocrized text:</pre>
        <pre>${escape(info)}</pre>
      `;

    }
  }

}

function convertMRZDate(mrzDate) {
  let year = parseInt(mrzDate.slice(0, 2));
  let month = mrzDate.slice(2, 4);
  let day = mrzDate.slice(4, 6);

  let currentYear = new Date().getFullYear();
  let currentCentury = Math.floor(currentYear / 100) * 100;

  let fullYear = currentCentury + year;

  if (fullYear > currentYear + 10) {
    fullYear -= 100;
  }

  return `${day}.${month}.${fullYear}`;
}

const countryCodes = {
  RUS: "RU",
  BLR: "BY",
  UKR: "UA",
  KAZ: "KZ",
  UZB: "UZ",
  TJK: "TJ",
  KGZ: "KG",
  AZE: "AZ",
  ARM: "AM",
  MDA: "MD",
  USA: "US",
  GBR: "GB",
  FRA: "FR",
  DEU: "DE",
  ITA: "IT",
  ESP: "ES",
  NLD: "NL",
  BEL: "BE",
  CHE: "CH",
  AUT: "AT",
  SWE: "SE",
  NOR: "NO",
  DNK: "DK",
  FIN: "FI",
  POL: "PL",
  CZE: "CZ",
  HUN: "HU",
  GRC: "GR",
  PRT: "PT",
  IRL: "IE",
  LUX: "LU",
  ROU: "RO",
  BGR: "BG",
  EST: "EE",
  LVA: "LV",
  LTU: "LT",
  HRV: "HR",
  SVK: "SK",
  SVN: "SI",
  MLT: "MT",
  CYP: "CY",
  ISL: "IS",
};

function convertCountryCode(alpha3Code) {
  return countryCodes[alpha3Code] || alpha3Code;
}
