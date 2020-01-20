const xhr = new XMLHttpRequest();
const urlNastavniPlan = "http://www.fulek.com/VUA/SUPIT/GetNastavniPlan";

xhr.open("GET", urlNastavniPlan);
var podaci = [];
var predmeti = [];
var idPredmeta = [];

xhr.onload = function() {
  podaci = JSON.parse(xhr.response);
  console.log(podaci);
  podaci.sort((a, b) => a.value - b.value);

  podaci.forEach(kolegij => {
    predmeti.push(kolegij.label);
    idPredmeta.push(kolegij.value);
  });
};

new autoComplete({
  data: {
    src: predmeti,
    cache: false
  },
  placeHolder: "Kolegiji...",
  selector: ".autocomplete-subject",
  threshold: 3,
  debounce: 0,
  searchEngine: "loose",
  resultsList: {
    render: true,
    destination: document.querySelector(".autocomplete-subject"),
    position: "afterend",
    element: "div"
  },
  maxResults: 5,
  highlight: true,
  resultItem: {
    content: (data, source) => {
      source.innerHTML = data.match;
    },
    element: "li"
  },
  onSelection: feedback => {
    podaci.forEach(kolegij => {
      if (kolegij.label == feedback.selection.value) {
        let kolegijID = kolegij.value;
        let url = `http://www.fulek.com/VUA/supit/GetKolegij/${kolegijID}`;
        let xhrKolegij = new XMLHttpRequest();
        xhrKolegij.open("GET", url);
        let objKolegij = [];
        xhrKolegij.onload = function() {
          objKolegij = JSON.parse(this.response);
          console.log(this.response);
        };
      }
    });
    $(".list").append(`<li class="list-item">${feedback.selection.value}</li>`);
  }
});

xhr.send();
