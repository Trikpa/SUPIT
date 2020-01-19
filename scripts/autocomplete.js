const xhr = new XMLHttpRequest();
const urlNastavniPlan = "http://www.fulek.com/VUA/SUPIT/GetNastavniPlan";

xhr.open("GET", urlNastavniPlan);
var podaci = [];
var predmeti = [];

xhr.onload = function() {
  podaci = JSON.parse(xhr.response);
  console.log(podaci);
  podaci.sort((a, b) => a.value - b.value);

  podaci.forEach(kolegij => {
    predmeti.push(kolegij.label);
  });
  // $(".ui-autocomplete-input").autocomplete({
  //   source: predmeti
  // });
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
    
    $(".list").append(`<li class="list-item">${feedback.selection.value}</li>`);
  }
});

xhr.send();
