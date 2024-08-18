const dropArea = document.querySelector(".drag-area"),
            dragText = dropArea.querySelector("header"),
            browseButton = document.querySelector("#browseBtn"),
            takePictureButton = document.querySelector("#takePictureBtn"),
            input = document.querySelector("#photo"),
            video = document.querySelector("#video"),
            canvas = document.querySelector("#canvas"),
            captureButton = document.querySelector("#capture");

            
      let file; // глобальная переменная для хранения файла
    
      browseButton.onclick = () => {
        input.click(); // клик по input при нажатии на "Browse File"
      }
    
      input.addEventListener("change", function(){
        file = this.files[0];
        dropArea.classList.add("active");
        // showFile(); // вызов функции показа файла
      });
    
      // Активируем камеру при нажатии на кнопку "Take Picture"
      takePictureButton.onclick = () => {
        video.style.display = 'block'
        navigator.mediaDevices.getUserMedia({ video: true })
          .then((stream) => {
            video.srcObject = stream;
            video.style.display = "block";
            captureButton.style.display = "block";
          })
          .catch((err) => {
            console.error("Error accessing camera: ", err);
          });
      }
    
      // Снимаем фото при нажатии на "Capture"
      captureButton.onclick = () => {
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      file = new File([blob], "photo.png", { type: "image/png" });

      // Создаем объект DataTransfer для манипуляции с input[type="file"]
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files; // Устанавливаем файл в input[type="file"]

      // Эмулируем событие change, чтобы обработчик считал, что файл был добавлен через интерфейс
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);

      stopVideo(); // Останавливаем видео поток
    });
}

    
      // Функция для отображения файла
function showFile() {
    const fileType = file.type;
    const validExtensions = ["image/jpeg", "image/jpg", "image/png"];
    
    if (validExtensions.includes(fileType)) {
        const fileReader = new FileReader();
        
        fileReader.onload = () => {
            const fileURL = fileReader.result;
            const imgTag = `<img src="${fileURL}" alt="image">`; 
            dropArea.innerHTML = imgTag; // Добавляем изображение в область
        }
        fileReader.readAsDataURL(file);
    } else {
        alert("This is not an Image File!");
        dropArea.classList.remove("active");
        dragText.textContent = "Drag & Drop to Upload File";
    }
}
    
      function stopVideo() {
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        video.style.display = "none";
        captureButton.style.display = "none";
      }
    
// Если пользователь перетаскивает файл над областью
dropArea.addEventListener("dragover", (event) => {
    event.preventDefault(); // Предотвращение стандартного поведения
    dropArea.classList.add("active");
    dragText.textContent = "Release to Upload File";
});
    
// Если пользователь покидает область перетаскивания
dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
});
    
      // Если пользователь сбрасывает файл на область
dropArea.addEventListener("drop", (event) => {
    event.preventDefault(); // Предотвращение стандартного поведения
    file = event.dataTransfer.files[0];

    // Создаем объект DataTransfer для манипуляции с input[type="file"]
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    input.files = dataTransfer.files; // Устанавливаем файл в input[type="file"]

    // Эмулируем событие change, чтобы обработчик считал, что файл был добавлен через интерфейс
    const eventChange = new Event('change', { bubbles: true });
    input.dispatchEvent(eventChange);

    // showFile(); // Вызываем функцию показа файла
});


const openScannerBtns = document.querySelectorAll('.scannerdoc-btn-wrapper')

openScannerBtns.forEach(elem=>{
  elem.addEventListener('click',()=>{
    elem.nextElementSibling.classList.toggle('active')
    elem.querySelector('.arrow-icon').classList.toggle('active')
  })
})


