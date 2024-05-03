//getting elements
const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const skipS = player.querySelectorAll("[data-skip]");
const ranges = player.querySelectorAll(".player__slider");
//functions
function togglePlay() {
  video.paused ? video.play() : video.pause();
}
function skipVideo() {
  if (this.dataset.skip == -10) {
    video.currentTime -= 10.0;
    video.currentTime < 0
      ? (video.currentTime = 0)
      : (video.currentTime = video.currentTime);
  } else video.currentTime += 25.0;
  video.currentTime > video.duration
    ? console.log("bitti")
    : console.log("25 sn sardım");
}
function updateButton() {
  toggle.textContent = this.paused ? "►" : "❚ ❚";
}
function handleRangeUpdate() {
  video[this.name] = this.value;
}
function handleProgress() {
  const watched = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${watched}%`;
}
function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}
let mouseClicked = false;
//even listener
progress.addEventListener("mousedown", () => (mouseClicked = true));
progress.addEventListener("mouseup", () => (mouseClicked = false));
ranges.forEach((range) => range.addEventListener("click", handleRangeUpdate));
ranges.forEach((range) =>
  range.addEventListener("mousemove", handleRangeUpdate)
);
video.addEventListener("timeupdate", handleProgress);
toggle.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);
skipS.forEach((skip) => skip.addEventListener("click", skipVideo));
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", (e) => mouseClicked && scrub(e));
