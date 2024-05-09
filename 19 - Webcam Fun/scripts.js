const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      try {
        video.srcObject = localMediaStream;
        video.play();
      } catch (error) {
        console.error("Something went wrong about the video stream!", error);
      }
    });
}
function renderCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  [canvas.width, canvas.height] = [width, height];
  //get the pixels of image
  const pixels = ctx.getImageData(0, 0, width, height); // 0 red 1 blue 2 green 3 alpha
  //mass with them
  pixels = redEffect(pixels);
  //put them again inside
  ctx.putImageData(pixels, 0, 0);
  //ctx.globalAlpha=0.1 //ghosting affect due to adding more images during the stream
  return setInterval(() => {
    // to allow you set clearInterval and clear the canvas
    ctx.drawImage(video, 0, 0, width, height);
  }, 10);
}

function takePhoto() {
  photoSound();
  //take the data out the canvas
  const data = canvas.toDataURL("image/jpeg"); //return base64 text base form of pictures
  const imageLink = document.createElement("a");
  imageLink.href = data;
  imageLink.setAttribute("download", "Photo");
  imageLink.textContent = "Download Image";
  imageLink.innerHTML = `<img src="${data}" alt="Photo of you"/>`;
  strip.insertBefore(imageLink, strip.firstChild); //jquery .prepend method like
}
function photoSound() {
  snap.currentTime = 0;
  snap.play();
}
function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = pixels.data[i] + 100; //red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; //blue
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //greeen
  }
  return pixels;
}
function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i]; //red
    pixels.data[i + 100] = pixels.data[i + 1]; //blue
    pixels.data[i - 200] = pixels.data[i + 2]; //greeen
  }
  return pixels;
}
function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll(".rgb input").forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

//getVideo();

video.addEventListener("canplay", renderCanvas);
