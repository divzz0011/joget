// script.js

const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const audio = document.getElementById("audio");
const video = document.getElementById("video");
const videoSource = document.getElementById("videoSource");
const blackout = document.getElementById("blackout");
const codeCredit = document.getElementById("codeCredit");
const introPage = document.getElementById("introPage");
const mainPage = document.getElementById("mainPage");
const startBtn = document.getElementById("startBtn");
const continueBtn = document.getElementById("continueBtn");

let chorusStarted = false;
let rgbInterval = null;
let blinkInterval = null;

function initPageEvents() {
  startBtn.addEventListener("click", () => {
    switchToMainPage(true);
  });

  continueBtn.addEventListener("click", () => {
    switchToMainPage(false);
  });

  playBtn.addEventListener("click", handlePlay);
  pauseBtn.addEventListener("click", handlePause);

  audio.addEventListener("timeupdate", handleAudioUpdate);
  audio.addEventListener("ended", handleAudioEnded);
  document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
}

function switchToMainPage(resetAudioVideo = false) {
  introPage.style.display = "none";
  mainPage.style.display = "block";

  if (resetAudioVideo) {
    audio.currentTime = 0;
    video.currentTime = 0;
  }
}

function handlePlay() {
  audio.play();
  video.loop = true;
  video.play();

  chorusStarted = false;
  codeCredit.style.opacity = 1;
  codeCredit.style.textAlign = "center";

  startTextBlink();
  applyWhiteBorder();
  removeRGBGlow();

  document.querySelectorAll("video").forEach(v => v.muted = true);
}

function handlePause() {
  audio.pause();
  video.pause();
}

function handleAudioUpdate() {
  if (!chorusStarted && audio.currentTime >= 68) {
    chorusStarted = true;
    blackout.style.opacity = 1;

    setTimeout(() => {
      video.pause();
      videoSource.src = "chorus.mp4";
      video.load();
      video.loop = true;
      video.play();

      removeWhiteBorder();
      applyRGBGlow();
    }, 1000);

    setTimeout(() => {
      blackout.style.opacity = 0;
    }, 2000);
  }
}

function handleAudioEnded() {
  video.pause();
  removeRGBGlow();
}

function applyRGBGlow() {
  const container = video.parentElement;
  container.style.transition = "box-shadow 0.5s ease, border 0.5s ease";
  container.style.aspectRatio = "1 / 1";
  let hue = 0;

  rgbInterval = setInterval(() => {
    hue = (hue + 3) % 360;
    const color = `hsl(${hue}, 100%, 50%)`;
    container.style.boxShadow = `
      0 0 10px ${color},
      0 0 20px ${color},
      0 0 30px ${color},
      0 0 40px ${color}`;
    container.style.border = `3px solid ${color}`;
  }, 40);
}

function removeRGBGlow() {
  const container = video.parentElement;
  if (rgbInterval) {
    clearInterval(rgbInterval);
    rgbInterval = null;
  }
  container.style.boxShadow = "none";
  container.style.border = "none";
}

function applyWhiteBorder() {
  const container = video.parentElement;
  container.style.border = "3px solid white";
  container.style.aspectRatio = "1 / 1";
}

function removeWhiteBorder() {
  const container = video.parentElement;
  container.style.border = "none";
}

function startTextBlink() {
  let visible = true;
  if (blinkInterval) clearInterval(blinkInterval);
  blinkInterval = setInterval(() => {
    codeCredit.style.opacity = visible ? 1 : 0.2;
    visible = !visible;
  }, 600);
}

function handleDOMContentLoaded() {
  removeRGBGlow();
  applyWhiteBorder();
  codeCredit.style.opacity = 1;
  codeCredit.style.textAlign = "center";
  startTextBlink();
}

// Initialize all events
initPageEvents();
