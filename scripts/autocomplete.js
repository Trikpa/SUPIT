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

var objKolegij = [];

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
            xhrKolegij.onload = function() {
              objKolegij.push(JSON.parse(xhrKolegij.response));
              // console.log(objKolegij[objKolegij.length - 1].id);
              let kol = objKolegij[objKolegij.length - 1];
              $("tbody").append(
                `<tr>
                  <td>${kol.kolegij}</td>
                  <td class="ects">${kol.ects}</td>
                  <td class="sati">${kol.sati}</td>
                  <td>${kol.predavanja}</td>
                  <td>${kol.vjezbe}</td>
                  <td>${kol.tip}</td>
                  <td class="td-button"><button class="btn-delete id-${kolegijID}" onclick="deleteAndUpdate('${kolegijID}')">Obriši</button></td>
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
  $(`.id-${subjectID}`)
    .parent()
    .parent()
    .remove();
  deleteObjFromArray(objKolegij, subjectID);
  updateSums();
}

function deleteObjFromArray(arr, subjectID) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id == subjectID) {
      arr.splice(i, 1);
    }
  }
}

function updateSums() {
  var sumEcts = 0;
  var sumSati = 0;
  objKolegij.forEach(kolegij => {
    sumEcts += kolegij.ects;
    sumSati += kolegij.sati;
  });
  $("#suma-ects").text(sumEcts);
  $("#suma-sati").text(sumSati);

  if (sumEcts === 0 && sumSati === 0) {
    $(".classes-table").css("display", "none");
    $(".body-content").css({
      "justify-content": "flex-start",
      "padding-left": "20%"
    });
  } else {
    $(".classes-table").css("display", "initial");
    $(".body-content").css({
      "justify-content": "space-evenly",
      "padding-left": "0"
    });
  }
}
xhr.send();
