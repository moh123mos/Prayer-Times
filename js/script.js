let url = {
  coutries: "https://countriesnow.space/api/v0.1/countries",
  prayerTimes: "http://api.aladhan.com/v1/calendarByCity/",
  urlAyah: "http://api.alquran.cloud/v1/ayah/",
  methods: "https://api.aladhan.com/v1/methods",
};

let countries = [];
let cities = [];
let methods = [];
let prayersContainer = document.querySelector(".prayer-times");
let ayahText = document.querySelector(".ayah .ayah-text");
let surahText = document.querySelector(".ayah .surah");
let copyBtn = document.querySelector(".copy-ayah");
let alert = document.querySelector(".alert");
let countrySelect = document.querySelector("#prayer-setting .setting #country");
let citySelect = document.querySelector("#prayer-setting .setting #city");
let methodsSelect = document.querySelector("#prayer-setting .setting #methods");
let prayerData = document.querySelectorAll(".prayer-data");
let latitude;
let longitude;
let userData = {
  country: "",
  city: "",
  method: "",
};

function copyAyah() {
  navigator.clipboard.writeText(`${ayahText.innerHTML}
${document.querySelector(".ayah .surah").innerHTML}`);
  alert.classList.remove("opacity-0");
  setTimeout(() => {
    alert.classList.add("opacity-0");
  }, 1000);
}
function getAyah() {
  document.querySelector(".ayah").style.display = "none";
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
      location.reload();
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
        '{ country: "", city: "", method: "" }' &&
      localStorage.getItem("userData") != null
    ) {
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
    } else {
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
function getByLatLongitude() {
  let year = new Date().getFullYear();
  console.log(longitude, latitude);
  console.log(year);
  let url = `http://api.aladhan.com/v1/calendar/${year}?latitude=51.508515&longitude=-0.1254872&method=2`;
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
    console.log(res.data.data[11]);
    timingsOfPrayers = res.data.data[todayIdx].timings;
    console.log(timingsOfPrayers);
    addTimesInDOM(timingsOfPrayers);
  });
  userData.city = citySelect.value;
  userData.country = countrySelect.value;
  userData.method = methodsSelect.value;
  localStorage.setItem("userData", JSON.stringify(userData));
}
function addTimesInDOM(timingsOfPrayers) {
  let prayersName = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
  let falg = true;
  prayerData.forEach((e, i) => {
    let str = timingsOfPrayers[prayersName[i]].slice(0, 5);
    let prayerHours = parseInt(str.slice(0, 2));
    let prayerMinutes = parseInt(str.slice(3));
    let actaulHour = new Date().getHours();
    let actaulMinute = new Date().getMinutes();
    let period =
      prayerHours < 12
        ? " AM"
        : prayerHours == 24
        ? " AM"
        : prayerHours > 12
        ? " PM"
        : " PM";
    let tem = prayerHours % 12;
    let time = (tem < 10 ? "0" + tem : tem) + str.slice(2);
    e.innerHTML = `<p>${prayersName[i]}</p>
		<p>${time + period} </p>`;

    if (prayerHours > actaulHour && falg) {
      // console.log(prayerMinutes);
      // console.log(actaulMinute);
      // console.log(prayerHours - actaulHour);
      // console.log(Math.abs(prayerMinutes - actaulMinute));
      e.parentElement.classList.add("current");
      let remainTime =
        (prayerHours - actaulHour) * 60 +
        Math.abs(prayerMinutes - actaulMinute);
      let idx;
      if (i == 0) idx = 5;
      else idx = i - 1;
      console.log(timingsOfPrayers[prayersName[idx]].slice(0, 5));
      let fullTime =
        Math.abs(
          (parseInt(timingsOfPrayers[prayersName[idx]].slice(0, 2)) -
            prayerHours) *
            60
        ) +
        Math.abs(
          parseInt(timingsOfPrayers[prayersName[idx]].slice(3)) - prayerHours
        );
      console.log(remainTime);
      console.log(fullTime);
      console.log((remainTime / fullTime) * 100);

      let remainLine = document.querySelector(".prayer.current");
      console.log(remainLine);
      remainLine.style.setProperty(
        "--dynamic-width",
        `${(remainTime / fullTime) * 100}%`
      );

      let remain = document.querySelector(".prayer.current .prayer-remaining");
      remain.innerHTML = `<p>remaining</p>
                <p>${prayerHours - actaulHour}:${Math.abs(
        prayerMinutes - actaulMinute
      )}</p>`;
      falg = false;
    }
  });
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
