let userData = {
  country: "",
  city: "",
  method: "",
  isBgImg: true,
  bgImg: "",
  bgBlur: false,
  bgAutoChange: false,
  bgColor: "",
};
let setIcon = document.querySelector(".set-icon");
let later = document.querySelector("#later");
let app = document.querySelector("#app");
let layer = document.querySelector(".layer");
let settings = document.querySelectorAll(".main-setting>div");
let navSettings = document.querySelectorAll(".nav-setting li");
let hoursTime = document.querySelector(".actual-time .hours");
let minutesTime = document.querySelector(".actual-time .minutes");
let secondsTime = document.querySelector(".actual-time .seconds");
let periodTime = document.querySelector(".actual-time .period");
let bgShow = document.querySelector(
  ".main-setting #bg-setting .setting input#show-bg "
);
let bgRandom = document.querySelector(
  ".main-setting #bg-setting .setting input#random "
);
let bgNext = document.querySelector(
  ".main-setting #bg-setting .setting .icon-rotate"
);
let bgBlur = document.querySelector(
  ".main-setting #bg-setting .setting input#blur"
);
let bgColor = document.querySelector(
  ".main-setting #bg-setting .setting input#bg-color"
);

function setTime() {
  // let actualTime = document.querySelector(".actual-time ");
  let time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  // console.log(minutesTime, secondsTime);
  hoursTime.innerHTML = time.slice(0, 2);
  minutesTime.innerHTML = time.slice(2, 5);
  secondsTime.innerHTML = time.slice(5, 8);
  periodTime.innerHTML = time.slice(9);
}
// setTime();
function setDate() {
  let hijriDate = document.querySelector(".dates .hijri-date");
  let gregorianDate = document.querySelector(".dates .gregorian-date");
  //set date in page
  let hijri = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(Date.now());
  let gregorian = new Intl.DateTimeFormat("default", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(Date.now());
  hijriDate.innerHTML = hijri;
  gregorianDate.innerHTML = gregorian;
}
// fun. to show setting window
function showSetting() {
  later.classList.toggle("d-none");
  layer.classList.toggle("d-none");
}
// fun. to show setting section
navSettings.forEach((e, i) => {
  e.addEventListener("click", (e) => {
    navSettings.forEach((e, j) => {
      e.classList.remove("active");
      settings[j].classList.add("d-none");
    });
    e.target.classList.add("active");
    settings[i].classList.remove("d-none");
  });
});
// console.log(bgShow);
function setShowBackground() {
  if (bgShow.checked) {
    bgRandom.disabled = false;
    bgBlur.disabled = false;
    bgColor.disabled = true;
    app.setAttribute(
      "style",
      "background-image: linear-gradient(#00000075, #00000075),url(./imgs/07.jpg);"
    );
  } else {
    bgRandom.disabled = true;
    bgBlur.disabled = true;
    bgColor.disabled = false;
    app.setAttribute("style", `background-color:${bgColor.value} !important;`);
  }
}
// fire EL functoins :)
setDate();
setInterval(setTime, 1000);
setShowBackground();
