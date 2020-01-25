const xhr = new XMLHttpRequest();
const urlNastavniPlan = "http://www.fulek.com/VUA/SUPIT/GetNastavniPlan";

xhr.open("GET", urlNastavniPlan);
var podaci = [];
var predmeti = [];
var idPredmeta = [];
xhr.onreadystatechange = function() {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    podaci = JSON.parse(xhr.response);
    podaci.sort((a, b) => a.value - b.value);

    podaci.forEach(kolegij => {
      predmeti.push(kolegij.label);
      idPredmeta.push(kolegij.value);
    });
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
      if (kolegij.label === feedback.selection.value) {
        let kolegijID = kolegij.value;

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
                  <td class="ects">${kol.ects}</td>
                  <td class="sati">${kol.sati}</td>
                  <td>${kol.predavanja}</td>
                  <td>${kol.vjezbe}</td>
                  <td>${kol.tip}</td>
                  <td class="td-button"><button class="btn-delete id-${kolegijID}" onclick="deleteAndUpdate('id-${kolegijID}')">Obriši</button></td>
                 </tr>`
              );
              updateSums();
            };
          }
        };
        xhrKolegij.send();
      }
    });
  }
});

function deleteAndUpdate(subjectID) {
  $(`.${subjectID}`)
    .parent()
    .parent()
    .remove();

  updateSums();
}

function updateSums() {
  var sumEcts = 0;
  var sumSati = 0;
  $(".ects").each(function() {
    sumEcts += parseInt($(".ects").text());
  });
  $("#suma-ects").text(`${sumEcts}`);

  $(".sati").each(function() {
    sumSati += parseInt($(".sati").text());
  });
  $("#suma-sati").text(`${sumSati}`);
}
xhr.send();
