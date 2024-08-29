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
let cur_img = 7;
let setIcon = document.querySelector(".set-icon");
let later = document.querySelector("#later");
let backgroundImg = document.querySelector("#background-img");
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
let ayah = document.querySelector(".ayah");

// save bg img in localStorage
if (localStorage.getItem("cur_img")) cur_img = localStorage.getItem("cur_img");
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
let nextBg = true;
// console.log(bgShow);
function setShowBackground() {
  if (bgShow.checked) {
    // bgRandom.disabled = false;
    bgBlur.disabled = false;
    nextBg = true;
    bgColor.disabled = true;
    backgroundImg.setAttribute(
      "style",
      `background: linear-gradient(#00000075, #00000075),url(./imgs/0${cur_img}.jpg) no-repeat;background-size: cover;`
    );
    if (bgBlur.checked) {
      backgroundImg.style = `background: linear-gradient(#00000075, #00000075),url(./imgs/0${cur_img}.jpg) no-repeat;background-size: cover;filter: blur(2px)`;
    }
  } else {
    // bgRandom.disabled = true;
    bgBlur.disabled = true;
    nextBg = false;
    bgColor.disabled = false;
    backgroundImg.setAttribute(
      "style",
      `background:${bgColor.value} !important;`
    );
  }
}
const nextBackground = () => {
  if (!nextBg) return;
  // if (localStorage.getItem("cur_img"))
  //   cur_img = localStorage.getItem("cur_img");
  console.log(cur_img);
  cur_img = (cur_img % 7) + 1;
  backgroundImg.setAttribute(
    "style",
    `background: linear-gradient(#00000075, #00000075),url(./imgs/0${cur_img}.jpg) no-repeat;background-size: cover;`
  );
  localStorage.setItem("cur_img", cur_img);
};
const setShowAyah = () => {
  ayah.classList.toggle("hide");
};
// fire EL functoins :)
setDate();
setInterval(setTime, 1000);
setShowBackground();
/*
[1] randomize background img
[2] save it in localStorage
[3] make btn to nxt img in case that randomzing no work
[4] enable blur filter on bgImg (optional)
[5] show bgColor or not
[6] show ayah or not
*/
