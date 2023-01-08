const imageInput = document.getElementById("image-input");
const colorPicker = document.getElementById("color-picker");
const imageCanvas = document.getElementById("image-canvas");
const colorCountElement = document.getElementById("color-count");
const context = imageCanvas.getContext("2d", { willReadFrequently: true });
const reader = new FileReader();

reader.addEventListener("load", () => {
  const image = new Image();
  image.src = reader.result;
  image.addEventListener("load", () => {
    imageCanvas.width = image.width;
    imageCanvas.height = image.height;
    context.drawImage(image, 0, 0);
  });
});

colorPicker.addEventListener("input", () => updateCanvas);

function updateCanvas() {
  const imageData = context.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const sr = parseInt(colorPicker.value.substring(1, 3), 16);
    const sg = parseInt(colorPicker.value.substring(3, 5), 16);
    const sb = parseInt(colorPicker.value.substring(5, 7), 16);
    data[i + 3] = (data[i] === sr && data[i + 1] === sg && data[i + 2] === sb) ? 255 : 64;
  }
  imageData.data = data;
  context.fillStyle = "white";
  context.fillRect(0, 0, imageCanvas.width, imageCanvas.height);
  context.putImageData(imageData, 0, 0);
}

imageInput.addEventListener("change", () => {
  colorCountElement.textContent = "";
  reader.readAsDataURL(imageInput.files[0]);
});

imageCanvas.addEventListener("click", (event) => {
  const pixelData = context.getImageData(event.offsetX, event.offsetY, 1, 1);
  const rHex = pixelData.data[0].toString(16).padStart(2, "0");
  const gHex = pixelData.data[1].toString(16).padStart(2, "0");
  const bHex = pixelData.data[2].toString(16).padStart(2, "0");
  colorPicker.value = `#${rHex}${gHex}${bHex}`;
  updateCanvas();
});
