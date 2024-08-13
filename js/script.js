let url = {
  coutries: "https://countriesnow.space/api/v0.1/countries",
  prayerTimes: "https://api.aladhan.com/v1/calendarByCity/",
  urlAyah: "https://api.alquran.cloud/v1/ayah/",
  methods: "https://api.aladhan.com/v1/methods",
};

let countries = [];
let cities = [];
let methods = [];
let prayersContainer = document.querySelector(".prayer-times");
let ayahContainer = document.querySelector(".ayah");
let ayahText = document.querySelector(".ayah .ayah-text");
let surahText = document.querySelector(".ayah .surah");
let copyBtn = document.querySelector(".copy-ayah");
let alert = document.querySelector(".alert");
let countrySelect = document.querySelector("#prayer-setting .setting #country");
let citySelect = document.querySelector("#prayer-setting .setting #city");
let methodsSelect = document.querySelector("#prayer-setting .setting #methods");
let prayerData = document.querySelectorAll(".prayer-data");
let prayersName = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

function copyAyah() {
  navigator.clipboard.writeText(`${ayahText.innerHTML}
${document.querySelector(".ayah .surah").innerHTML}`);
  alert.classList.remove("opacity-0");
  setTimeout(() => {
    alert.classList.add("opacity-0");
  }, 1000);
}
function getAyah() {
  ayahContainer.style.display = "none";
  let rand = Math.floor(1 + Math.random() * 6236);
  axios
    .get(`${url.urlAyah}${rand}`)
    .then((data) => {
      document.querySelector(".ayah").style.display = "block";
      ayahText.innerHTML = data.data.data.text;
      surahText.innerHTML = `${data.data.data.surah.name} (${data.data.data.numberInSurah} : ${data.data.data.surah.numberOfAyahs})`;
    })
    .catch((err) => {
      console.error(err);
    });
}

function getCountries() {
  axios.get(url.coutries).then((data) => {
    countries = data.data.data;
    for (const coun of countries) {
      countrySelect.innerHTML += `<option value="${coun.country}">${coun.country}</option>`;
    }
    getCities();
    // retrieve Data from localstorage
    if (
      localStorage.getItem("userData") !=
        '{"country":"","city":"","method":"","isBgImg":true,"bgImg":"","bgBlur":false,"bgAutoChange":false,"bgColor":""}' &&
      localStorage.getItem("userData") != null
    ) {
      // console.log('hello');
      userData = JSON.parse(localStorage.getItem("userData"));
      console.log(userData);
      countrySelect.selectedIndex = countries.findIndex((e) => {
        return e.country === userData.country;
      });
      getCities();
      citySelect.selectedIndex = cities.findIndex((e) => {
        return e === userData.city;
      });
      methodsSelect.selectedIndex = methods.findIndex((e) => {
        return e.id == userData.method;
      });
      getPrayerTimes();
    }
    // handeling in case there isn't data in localStorage
    else {
      let btnGetLocation = document.querySelector(".get-location");
      prayersContainer.classList.add("d-none");
      btnGetLocation.classList.remove("d-none");
      btnGetLocation.addEventListener("click", () => {
        later.classList.toggle("d-none");
        layer.classList.toggle("d-none");
        navSettings[0].classList.toggle("active");
        settings[0].classList.remove("d-none");
        prayersContainer.classList.remove("d-none");
        btnGetLocation.classList.add("d-none");
      });
    }
  });
}
function getCities() {
  citySelect.innerHTML = "";
  cities = countries.find((e) => {
    return e.country === countrySelect.value;
  }).cities;
  for (const city of cities) {
    citySelect.innerHTML += `<option value="${city}">${city}</option>`;
  }
}
function getMethods() {
  axios.get(url.methods).then((data) => {
    // note: this is object!
    methods = Object.values(data.data.data);
    for (const method of methods) {
      if (method.id == 99) continue;
      methodsSelect.innerHTML += `<option value="${method.id}">${method.name}</option>`;
    }
    // console.log(methods);
  });
}
function getPrayerTimes() {
  let date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
  });
  date = date.split("/").reverse().join("/");

  let todayIdx = new Date().getDate() - 1;
  url.prayerTimes += `${date}?city=${citySelect.value}&country=${countrySelect.value}&method=${methodsSelect.value}`;
  let timingsOfPrayers;
  axios.get(url.prayerTimes).then((res) => {
    // console.log(res.data.data[11]);
    timingsOfPrayers = res.data.data[todayIdx].timings;
    console.log(timingsOfPrayers);
    addTimesInDOM(timingsOfPrayers);
  });
  userData.city = citySelect.value;
  userData.country = countrySelect.value;
  // userData.method = methodsSelect.value;
  localStorage.setItem("userData", JSON.stringify(userData));
}
function addTimesInDOM(timingsOfPrayers) {
  let falg = true;
  prayerData.forEach((e, i) => {
    let str = timingsOfPrayers[prayersName[i]].slice(0, 5);
    let currentPrayerHours = parseInt(str.slice(0, 2));
    let currentPrayerMinutes = parseInt(str.slice(3));
    let currentPrayerTimeInMinutes =
      currentPrayerHours * 60 + currentPrayerMinutes;
    let actaulHour = new Date().getHours();
    let actaulMinute = new Date().getMinutes();
    let actualTimeInMinutes = actaulHour * 60 + actaulMinute;
    let period =
      currentPrayerHours < 12
        ? " AM"
        : currentPrayerHours == 24
        ? " AM"
        : currentPrayerHours > 12
        ? " PM"
        : " PM";
    let time =
      (currentPrayerHours % 12 < 10
        ? "0" + (currentPrayerHours % 12)
        : currentPrayerHours % 12) + str.slice(2);
    e.innerHTML = `<p>${prayersName[i]}</p>
      <p>${time + period} </p>`;
    // to choose only first prayer greater than actual Time to be current prayer
    if (currentPrayerTimeInMinutes > actualTimeInMinutes && falg) {
      e.parentElement.classList.add("current");
      setRemainingTime(timingsOfPrayers, i);
      falg = false;
    }
  });
  // in case that falg not change then fajr is current
  if (falg) {
    prayerData[0].parentElement.classList.add("current");
    setRemainingTime(timingsOfPrayers, 0);
  }
}
function setRemainingTime(data, i) {
  let str = data[prayersName[i]].slice(0, 5);
  let currentPrayerHours = parseInt(str.slice(0, 2));
  let currentPrayerMinutes = parseInt(str.slice(3));
  let actaulHour = new Date().getHours();
  let actaulMinute = new Date().getMinutes();
  // handel fajr remaining time
  if (i == 0 && actaulHour > 12) currentPrayerHours = currentPrayerHours + 24;
  // rem aining time of prayer in minutes
  let remainTime = Math.abs(
    currentPrayerHours * 60 +
      currentPrayerMinutes -
      (actaulHour * 60 + actaulMinute)
  );

  let idx;
  if (i == 0) idx = 5;
  else idx = i - 1;

  let fullTime = Math.abs(
    currentPrayerHours * 60 +
      currentPrayerMinutes -
      (parseInt(data[prayersName[idx]].slice(0, 2)) * 60 +
        parseInt(data[prayersName[idx]].slice(3)))
  );

  // set Line progress according to Remaining Time
  let remainLine = document.querySelector(".prayer.current span.before");
  remainLine.style.setProperty(
    "--dynamic-width",
    `${(remainTime / fullTime) * 100}%`
  );
  if (remainTime < 20) {
    remainLine.style.setProperty("background-color", `#f90332`);
  }

  // set remaing time in 'prayer-remaining' section
  let remain = document.querySelector(".prayer.current .prayer-remaining");
  remain.innerHTML = `<p>remaining</p>
                  <p>${
                    parseInt(remainTime / 60) < 10
                      ? "0" + parseInt(remainTime / 60)
                      : parseInt(remainTime / 60)
                  }:${
    remainTime % 60 < 10 ? "0" + (remainTime % 60) : remainTime % 60
  }</p>`;
}

function setMethod() {
  userData.method = methodsSelect.value;
  getPrayerTimes();
  localStorage.setItem("userData", JSON.stringify(userData));
}

// Fire EL Functions
getAyah();
getMethods();
getCountries();
