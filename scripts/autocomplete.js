const xhr = new XMLHttpRequest();
const urlNastavniPlan = "http://www.fulek.com/VUA/SUPIT/GetNastavniPlan";

xhr.open("GET", urlNastavniPlan);
var podaci = [];
var predmeti = [];
var idPredmeta = [];
var objKolegij = [];

xhr.onreadystatechange = function() {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    podaci = JSON.parse(xhr.response);
    podaci.sort((a, b) => a.value - b.value);

    podaci.forEach(kolegij => {
      predmeti.push(kolegij.label);
      idPredmeta.push(kolegij.value);
    });

    // var xh;
    // idPredmeta.forEach(id => {
    //   xh = new XMLHttpRequest();
    //   let url = `http://www.fulek.com/VUA/supit/GetKolegij/${id}`; //loadaj sve kolegije odjednom
    //   xh.open("GET", url);
    //   xh.onreadystatechange = function() {
    //     if(this.readyState === XMLHttpRequest.DONE) {
    //       console.log(JSON.parse(this.response));
    //     }
    //   };
    //   xh.send();
    // });
  }
};

new autoComplete({
  data: {
    src: predmeti,
    cache: false
  },
  placeHolder: "Kolegiji...",
  selector: ".autocomplete-subject",
  threshold: 2,
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
  onSelection: feedback => {
    podaci.forEach(kolegij => {
      if (kolegij.label == feedback.selection.value) {
        let kolegijID = kolegij.value;
        //loadaj kolegij po kolegij kako user odabire
        var xhrKolegij = new XMLHttpRequest();
        xhrKolegij.open(
          "GET",
          `http://www.fulek.com/VUA/supit/GetKolegij/${kolegijID}`
        );
        xhrKolegij.onreadystatechange = function() {
          if (this.readyState === XMLHttpRequest.DONE) {
            var objKolegij = [];
            xhrKolegij.onload = function() {
              objKolegij.push(JSON.parse(xhrKolegij.response));
              let kol = objKolegij[objKolegij.length - 1];
              $("tbody").append(
                `<tr>
                  <td>${kol.kolegij}</td>
                  <td>${kol.ects}</td>
                  <td>${kol.sati}</td>
                  <td>${kol.predavanja}</td>
                  <td>${kol.tip}</td>
                 </tr>`
              );
            };
          }
        };
        xhrKolegij.send();
      }
    });
  }
});

xhr.send();
