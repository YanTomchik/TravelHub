document.querySelectorAll(".scannerdoc-wrapper").forEach((scannerWrapper) => {
  const dropArea = scannerWrapper.querySelector(".drag-area"),
        dragText = dropArea.querySelector("header"),
        browseButton = scannerWrapper.querySelector(".browse-btn"),
        input = scannerWrapper.querySelector(".attach-file");

  let file; // локальная переменная для хранения файла в контексте одного сканера

  // Проверяем наличие элементов перед добавлением обработчиков
  if (browseButton && input) {
    browseButton.onclick = () => {
      input.click(); // клик по input при нажатии на "Browse File"
    };
  }

  if (input) {
    input.addEventListener("change", function(){
      file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          console.log("Файл успешно прочитан:", event.target.result);
          dropArea.classList.add("active");
        };
        reader.readAsDataURL(file);
      } else {
        console.log("Файл не прикреплен");
      }
    });
  }
  


  if (dropArea) {
    dropArea.addEventListener("dragover", (event) => {
      event.preventDefault(); // Предотвращение стандартного поведения
      dropArea.classList.add("active");
      dragText.textContent = "Release to Upload File";
    });

    dropArea.addEventListener("dragleave", () => {
      dropArea.classList.remove("active");
      dragText.textContent = "Drag & Drop to Upload File";
    });

    dropArea.addEventListener("drop", (event) => {
      event.preventDefault(); // Предотвращение стандартного поведения
      file = event.dataTransfer.files[0];

      // Создаем объект DataTransfer для манипуляции с input[type="file"]
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files; // Устанавливаем файл в input[type="file"]

      // Эмулируем событие change, чтобы обработчик считал, что файл был добавлен через интерфейс
      const eventChange = new CustomEvent('change', { bubbles: true });
      setTimeout(() => {
        input.dispatchEvent(eventChange);
      }, 100); // задержка в 100 миллисекунд
      

    });
  }
});


const openScannerBtns = document.querySelectorAll('.scannerdoc-btn-wrapper')

openScannerBtns.forEach(elem=>{
  elem.addEventListener('click',()=>{
    elem.nextElementSibling.classList.toggle('active')
    elem.querySelector('.arrow-icon').classList.toggle('active');

    document.getElementById('detected').innerHTML = ''
    // console.log(elem.parentElement.parentElement.parentElement)
    let type = undefined;
    let dataX = undefined;
    const dataIndex = elem.parentElement.parentElement.parentElement.dataset.index;
    const dataId = elem.parentElement.parentElement.parentElement.getAttribute('id');
    console.log(elem.parentElement.parentElement.parentElement)
    console.log(dataIndex)

    if(dataIndex !=undefined){
      dataX = dataIndex;
      
      type = 'multipleInfo'
    }
    if(dataId == 'main-info-scanner'){
      dataX = dataId;
      type = 'mainInfo'
    }
    console.log(type)
    console.log(dataX)
    startScannerMrzScript(type,dataX)
  })
});