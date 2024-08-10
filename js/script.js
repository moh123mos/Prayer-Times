let url = {
  coutries: "https://countriesnow.space/api/v0.1/countries",
  prayerTimes: "http://api.aladhan.com/v1/calendarByCity/2017/4?",
  urlAyah: "http://api.alquran.cloud/v1/ayah/1080 ",
  methods: "https://api.aladhan.com/v1/methods",
};
let countries = [];
let cities = [];
axios.get(url.urlAyah).then((data) => console.log(data.data.data));
