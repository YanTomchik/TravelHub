
document.addEventListener("DOMContentLoaded", function() {
    const defaultWrapper = document.getElementById('defaultWayAviaWrapper');
    const manyWayWrapper = document.getElementById('manyWayAviaWrapper');
    const routeLink = document.getElementById('addRouteAviaDefault');
    const backToSimpleRoute = document.getElementById('addRouteAviaManyWay');
    const addRowBtn = document.querySelector('.add-avia-row-btn');
    
    // Переключение между блоками defaultWayAviaWrapper и manyWayAviaWrapper
    routeLink.addEventListener('click', function() {
        toggleVisibility(defaultWrapper, manyWayWrapper);
    });
    
    backToSimpleRoute.addEventListener('click', function() {
        toggleVisibility(manyWayWrapper, defaultWrapper);
    });
    
    function toggleVisibility(hideElement, showElement) {
        hideElement.classList.remove('show');
        hideElement.classList.add('fade');
        
        setTimeout(() => {
            hideElement.style.display = 'none';
            showElement.style.display = 'block';
            setTimeout(() => {
                showElement.classList.add('show');
            }, 10);  // добавляем задержку для плавного перехода
        }, 300); // Время должно совпадать с `transition` в CSS
    }
  
    // Добавление блока avia-row при клике на кнопку
    addRowBtn.addEventListener('click', function() {
      const newRow = createAviaRow();
      
      // Найти последний блок avia-row и вставить новый блок после него
      const lastRow = manyWayWrapper.querySelectorAll('.avia-row');
      const lastElementRow = lastRow[lastRow.length - 1];
  
      const firstRowForm = manyWayWrapper.querySelector('.form-row');
  
      if (lastElementRow) {
        lastElementRow.insertAdjacentElement('afterend', newRow);
      } else {
          // Если нет ни одного блока, добавляем в конец manyWayWrapper
          firstRowForm.prepend(newRow);
      }
  
      
  });
  
    // Создание нового блока avia-row
    function createAviaRow() {
        const row = document.createElement('div');
        row.classList.add('form-row', 'rm', 'avia-row');
        
        row.innerHTML = `
            <div class="group-type-1">
                                              <div class="input-group-item input-default-flights-from" id="input-default-flights-from">
                                                  <div class="form-group rm field-flightsearchform-locationfrom required">
                                                      <label for="flightsearchform-locationfrom">Откуда</label>
                                                      <select id="flightsearchform-locationfrom" class="form-control select2-hidden-accessible"
                                                          name="FlightSearchForm[locationFrom]" aria-required="true" data-s2-options="s2options_3267a624"
                                                          data-krajee-select2="select2_c65e8864" style="width: 100%; height: 1px; visibility: hidden;"
                                                          data-select2-id="flightsearchform-locationfrom" tabindex="-1" aria-hidden="true">
                                                          <option value="" data-select2-id="2">Откуда (город или аэропорт)
                                                          </option>
                                                          <option value="MOW" selected="" data-select2-id="3">Москва</option>
                                                      </select><span class="select2 select2-container select2-container--krajee-bs3" dir="ltr" data-select2-id="1"
                                                          style="width: 100%;"><span class="selection"><span class="select2-selection select2-selection--single"
                                                                  role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false"
                                                                  aria-labelledby="select2-flightsearchform-locationfrom-container"><span class="select2-selection__rendered"
                                                                      id="select2-flightsearchform-locationfrom-container" role="textbox" aria-readonly="true"
                                                                      title="Москва">Москва</span><span class="select2-selection__arrow" role="presentation"><b
                                                                          role="presentation"></b></span></span></span><span class="dropdown-wrapper"
                                                              aria-hidden="true"></span></span>
                                                      
                                                      <div class="help-block"></div>
                                                  </div>
                                              </div>
      
                                              <div class="switch-btn-wrapper" id="switch-btn-wrapper">
                                                  <img src="./images/switcher-avia-icon.svg" alt="">
                                              </div>
      
                                              <div class="input-group-item input-default-flights-to" id="input-default-flights-to">
                                                  <div class="form-group rm field-flightsearchform-locationto required">
                                                      <label class="control-label" for="flightsearchform-locationto">Куда</label>
                                                      <select id="flightsearchform-locationto" class="form-control select2-hidden-accessible"
                                                          name="FlightSearchForm[locationTo]" aria-required="true" data-s2-options="s2options_3267a624"
                                                          data-krajee-select2="select2_da4abfe4" style="width: 100%; height: 1px; visibility: hidden;"
                                                          data-select2-id="flightsearchform-locationto" tabindex="-1" aria-hidden="true">
                                                          <option value="" data-select2-id="5">Куда (город или аэропорт)
                                                          </option>
                                                          <option value="MLE" selected="" data-select2-id="6">Мале MLE
                                                          </option>
                                                      </select><span class="select2 select2-container select2-container--krajee-bs3" dir="ltr" data-select2-id="4"
                                                          style="width: 100%;"><span class="selection"><span class="select2-selection select2-selection--single"
                                                                  role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false"
                                                                  aria-labelledby="select2-flightsearchform-locationto-container"><span
                                                                      class="select2-selection__rendered" id="select2-flightsearchform-locationto-container"
                                                                      role="textbox" aria-readonly="true" title="Мале MLE">Мале MLE</span><span
                                                                      class="select2-selection__arrow" role="presentation"><b
                                                                          role="presentation"></b></span></span></span><span class="dropdown-wrapper"
                                                              aria-hidden="true"></span></span>
                                              
                                                      <div class="help-block"></div>
                                                  </div>
                                              </div>
                                          </div>
  
                                          <div class="group-type-2 date">
                                              <div class="input-group-item flight-date">
                                                  <div class="form-group rm field-hotel-book-checkin-date">
                                                      <label class="control-label" for="hotel-book-checkin-date">Туда</label>
                                                      <div class="date-inputs-wrapper rm">
                                                          <input type="text" class="date-inputs-item left datepicker-avia-from" name="FlightSearchForm[date]"
                                                          placeholder="Туда" value="26.10.2024" autocomplete="off" readonly="">
                                                          <span class="remove-datepicker-date" id="remove-datepicker-date">
                                                              <img src="./images/cross-icon.svg" alt="Cross-btn">
                                                          </span>
                                                      </div>
                                                      <div class="help-block"></div>
                                                      <div class="error-message-user" id="error-message-user">
                                                  
                                                      </div>
                                                  </div>
                                              </div>
      
                                              <div class="delete-avia-row">
                                                  <img src="./images/cross-grey-icon.svg" alt="">
                                              </div>
                                          </div>
        `;
  
        // Добавление обработчика для удаления строки
        const deleteBtn = row.querySelector('.delete-avia-row');
        deleteBtn.addEventListener('click', function() {
            row.remove();
        });
  
        return row;
    }
  
    const deleteBtns = document.querySelectorAll('.delete-avia-row');
  
    if(deleteBtns){
      deleteBtns.forEach(elem => {
        elem.addEventListener('click', function() {
          elem.closest('.avia-row').remove();
      });
      })
      
    }
  
    const radioButton = document.querySelector('input[name="cabin-class"]:checked');
    console.log(radioButton)
  
  
  });
  
  