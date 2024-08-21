document.querySelectorAll(".scannerdoc-wrapper").forEach((scannerWrapper) => {
  const dropArea = scannerWrapper.querySelector(".drag-area"),
        dragText = dropArea.querySelector("header"),
        browseButton = scannerWrapper.querySelector(".browse-btn"),
        input = scannerWrapper.querySelector(".attach-file");

  let file;

  if (browseButton && input) {
    browseButton.onclick = () => {
      input.click(); 
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
      event.preventDefault();
      dropArea.classList.add("active");
      dragText.textContent = "Release to Upload File";
    });

    dropArea.addEventListener("dragleave", () => {
      dropArea.classList.remove("active");
      dragText.textContent = "Drag & Drop to Upload File";
    });

    dropArea.addEventListener("drop", (event) => {
      event.preventDefault();
      file = event.dataTransfer.files[0];

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files; 

      const eventChange = new CustomEvent('change', { bubbles: true });
      setTimeout(() => {
        input.dispatchEvent(eventChange);
      }, 100);
      

    });
  }
});

const openScannerBtns = document.querySelectorAll('.scannerdoc-btn-wrapper')

openScannerBtns.forEach(elem=>{
  elem.addEventListener('click',()=>{
    elem.nextElementSibling.classList.toggle('active')
    elem.querySelector('.arrow-icon').classList.toggle('active');
  })
});

document.querySelector('#touristChangeModal .close').addEventListener('click',()=>{
  document.querySelector('#parsed').innerHTML = ''
})