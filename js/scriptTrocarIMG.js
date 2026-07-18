document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".trocarIMG").addEventListener("click", function () {
        document.querySelector(".popupContainer").classList.toggle("hidden");
    });

    document.getElementById("closeButton").addEventListener("click", function () {
        document.querySelector(".popupContainer").classList.add("hidden");
    });

    const inputField = document.getElementById("inputField");
    const customButton = document.getElementById("customButton");
    const fileName = document.getElementById("fileName");

    customButton.addEventListener("click", function () {
        inputField.click();
    });

    inputField.addEventListener("change", function () {
        if (inputField.files.length > 0) {
            fileName.textContent = inputField.files[0].name;
        } else {
            fileName.textContent = "Nenhum arquivo selecionado";
        }
    });

    if (!imgChanged) moveToZeroPoint();
    draw(); 
    enviar();
});

document.getElementById('save-img-png').addEventListener('click', () => saveImg(true));
document.getElementById('save-img-bmp').addEventListener('click', () => saveImg(false));
document.getElementById('submitButton').addEventListener('click', () => enviar() );

const fileInput = document.getElementById('inputField');
const slider = document.getElementById('slider');
const imageCanvas = document.getElementById('imageCanvas');
const cv = document.getElementById('canvas');
const imageCtx = imageCanvas.getContext('2d');
const switchInput = document.getElementById('switchround');
let sliderValue = 100;

let img = new Image();
img.src = 'src/pfp-blank.jpg'; 
let startX = 50, startY = 50;
let cropWidth = sliderValue, cropHeight = sliderValue; 
let isDragging = false; 
let imgChanged = false;

let movingImage = new Image();
movingImage.src = 'src/pfp-canva1x1.png'; 
let movingImgLoaded = false;
let movingImgX = 50, movingImgY = 50;
let movingImgWidth = sliderValue, movingImgHeight = sliderValue;

movingImage.onload = () => {
    movingImgLoaded = true;
};

slider.addEventListener("input", () => {
    sliderValue = Number(slider.value);

    let centerX = startX + cropWidth / 2;
    let centerY = startY + cropHeight / 2;

    const rect = imageCanvas.getBoundingClientRect();

    if(sliderValue > rect.height){ sliderValue = rect.height; }
    if(sliderValue < 100){ sliderValue = 100; }

    slider.value = sliderValue;

    let newCropWidth = sliderValue;
    let newCropHeight = sliderValue;
    let newStartX = centerX - newCropWidth / 2;
    let newStartY = centerY - newCropHeight / 2;

    movingImgX = movingImgX + (newStartX - startX);
    movingImgY = movingImgY + (newStartY - startY);

    startX = newStartX;
    startY = newStartY;
    cropWidth = newCropWidth;
    cropHeight = newCropHeight;

    tamanhoDoRecorte();
});

switchInput.addEventListener('change', function() {
    const imgDiv = document.getElementById('fotoPerfil');
    imgDiv.classList.toggle('roundedimg');
    if (!imgChanged) moveToZeroPoint();
    draw(); 
    enviar();
})

imageCanvas.addEventListener('wheel', (event) => {
    event.preventDefault();

    let centerX = startX + cropWidth / 2;
    let centerY = startY + cropHeight / 2;

    if (event.deltaY < 0) {
        sliderValue = parseInt(sliderValue) + 50;
    } else {
        sliderValue = parseInt(sliderValue) - 50;
    }

    const rect = imageCanvas.getBoundingClientRect();

    if(sliderValue > rect.height){ sliderValue = rect.height; }
    if(sliderValue < 100){ sliderValue = 100; }

    slider.value = sliderValue;

    let newCropWidth = sliderValue;
    let newCropHeight = sliderValue;
    let newStartX = centerX - newCropWidth / 2;
    let newStartY = centerY - newCropHeight / 2;

    movingImgX = movingImgX + (newStartX - startX);
    movingImgY = movingImgY + (newStartY - startY);

    startX = newStartX;
    startY = newStartY;
    cropWidth = newCropWidth;
    cropHeight = newCropHeight;
 
    console.log(cropWidth + " < Tamanho do recorte > " + cropHeight);

    tamanhoDoRecorte();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(); 
    reader.onload = function(event) {
        img.onload = function() {
            const rect = imageCanvas.getBoundingClientRect();
            console.log(rect.width + " < Tamanho do canvas > " + rect.height);
            imageCanvas.width = rect.width;
            imageCanvas.height = rect.height;
            draw(); 
        };
        img.src = event.target.result; 
    };

    imgChanged = true;
    reader.readAsDataURL(file); 
});

imageCanvas.addEventListener('mousedown', (e) => {
    isDragging = true; 
});

imageCanvas.addEventListener('mousemove', (e) => {
    if (isDragging) { 
        const rect = imageCanvas.getBoundingClientRect(); 
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;        
        
        
        if (mouseX >= (cropWidth / 2) && mouseX <= imageCanvas.width - (cropWidth / 2)) {
            startX = mouseX - (cropWidth / 2);
            movingImgX = mouseX - (movingImgWidth / 2);
        } else if (mouseX < (cropWidth / 2)){
            startX = 0;
            movingImgX = 0;
        } else if (mouseX > imageCanvas.width - (cropWidth / 2)){
            startX = imageCanvas.width - cropWidth;
            movingImgX = imageCanvas.width - cropWidth;
        }
        
        if (mouseY >= (cropHeight / 2) && mouseY <= imageCanvas.height - (cropHeight / 2)) {
            startY = mouseY - cropHeight / 2;
            movingImgY = mouseY - movingImgHeight / 2;
        } else if (mouseY < (cropHeight / 2)){
            startY = 0;
            movingImgY = 0;
        } else if (mouseY > imageCanvas.height - (cropHeight / 2)){
            startY = imageCanvas.height - cropHeight;
            movingImgY = imageCanvas.height - cropHeight;
        }
        
        console.log(movingImgX + " < Ponto da imagem > " + movingImgY);
        console.log(startX + " < Ponto inicial do corte > " + startY);
        draw();
    }
});

imageCanvas.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        document.querySelector(".popupContainer").classList.add("hidden");
    }
});

function moveToZeroPoint() {
    const widthCanva = 1090.81;
    const heightCanva = 666;

    imageCanvas.width = widthCanva;
    imageCanvas.height = heightCanva;
    startX = (widthCanva - heightCanva) / 2;
    startY = 0;
    cropWidth = heightCanva;
    cropHeight = heightCanva;

    movingImgX = (widthCanva - heightCanva) / 2;
    movingImgY = 0;
    movingImgWidth = heightCanva;
    movingImgHeight = heightCanva;

    sliderValue = heightCanva;
}

function tamanhoDoRecorte(){
    cropWidth = sliderValue;
    cropHeight = sliderValue; 
    movingImgWidth = sliderValue; 
    movingImgHeight = sliderValue; 
    
    if(startX < 0){
        startX = 0; movingImgX = 0;
    }
    if(startY < 0){
        startY = 0; movingImgY = 0;
    }

    if(startX + movingImgWidth > imageCanvas.width){
        let deslocamentoHorizontal = imageCanvas.width - (startX + movingImgWidth);
        startX += deslocamentoHorizontal; movingImgX += deslocamentoHorizontal;
    }
    if(startY + movingImgHeight > imageCanvas.height){
        let deslocamentoVertical = imageCanvas.height - (startY + movingImgHeight);
        startY += deslocamentoVertical; movingImgY += deslocamentoVertical;
    }
    draw();
}

function draw() {
    if(img.src == "") return;
    imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height); 
    const scale = Math.min(imageCanvas.width / img.width, imageCanvas.height / img.height);

    const newWidth = img.width * scale;
    const newHeight = img.height * scale;

    const x = (imageCanvas.width - newWidth) / 2;
    const y = (imageCanvas.height - newHeight) / 2;

    imageCtx.drawImage(img, x, y, newWidth, newHeight);

    if (movingImgLoaded && switchInput.checked) {
        imageCtx.drawImage(movingImage, movingImgX, movingImgY, movingImgWidth, movingImgHeight);
    }
        /*
            VER ÁREA DISPONÍVEL
            imageCtx.beginPath();
            imageCtx.rect((cropWidth / 2), (cropHeight / 2), imageCanvas.width - cropWidth, imageCanvas.height - cropHeight);
            imageCtx.strokeStyle = 'blue'; // Define a cor do retângulo de recorte
            imageCtx.lineWidth = 2; // Define a largura da linha do retângulo de recorte
            imageCtx.stroke();
        */

    const lineWidth2 = 1100;
    
    imageCtx.beginPath();
    imageCtx.rect(
        startX - lineWidth2 / 2, 
        startY - lineWidth2 / 2, 
        parseInt(cropWidth) + lineWidth2, 
        parseInt(cropHeight) + lineWidth2);
    imageCtx.strokeStyle = 'rgba(24, 24, 24, 0.92)';
    imageCtx.lineWidth = lineWidth2;
    imageCtx.stroke();
}

function enviar(){
    const targetSize = 500;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = targetSize;
    tempCanvas.height = targetSize;
    const tempContext = tempCanvas.getContext('2d');
    
    if(switchInput.checked){
        tempContext.beginPath();
        tempContext.arc(
            targetSize / 2,
            targetSize / 2,
            targetSize / 2,
            0, Math.PI * 2
        );
        tempContext.closePath();
        tempContext.clip();
    }

    tempContext.drawImage(
        imageCanvas, 
        startX, startY, cropWidth, cropHeight, 
        0, 0, targetSize, targetSize
    );

    const image = tempCanvas.toDataURL("image/png");
    const imageNoData = image.replace("data:image/png;base64,", "");

    const inputBase64 = document.getElementById('fotoUsuario');
    inputBase64.value = imageNoData;
    
    document.querySelector('.img-perfil').src = image;
    
    document.querySelector('.popupContainer').classList.add('hidden');
}

function saveImg(png) {
    const name = document.getElementById('renametext').value || document.getElementById('fileName').textContent.split('.')[0];
    const ext = png ? "png" : "bmp"; 
    const img = document.getElementById('fotoPerfil');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0);

    let url;
    if (png) {
        url = canvas.toDataURL("image/png");
    } else {
        const bmpBlob = canvasToBMP(canvas);
        url = URL.createObjectURL(bmpBlob);
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (!png) {
        URL.revokeObjectURL(url);
    }
}