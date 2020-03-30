"use strict";

function libraryCall(url) {
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(libraryJson => {
      console.log("this is libraryJson: ", libraryJson);
      displayLibrary(libraryJson);
    })
    .catch(err => $(".search-error").text(`${err}`));
}

function displayLibrary(libraryData) {
  $(".js-newspapers-sec").removeClass("hidden");
  $(".search-term-holder").html(`"${searchTerm}"`);

  $(generateNewspaperResults(libraryData));

  console.log(`displayLibrary ran`);
}

function generateNewspaperResults(libObj) {
  const newsArray = libObj.items;

  for (let i = 0; i < 5; i++) {
    let rawTitle = newsArray[i].title;
    let rawDate = newsArray[i].date;

    $(".js-newspapers-ul").append(`<li>
        <h3 class="ital">${rawTitle.split("[")[0]}</h3>
        <p>Date published: ${normalizeDate(rawDate)}</p>
        <a class="news-link" target="_blank" href="https://chroniclingamerica.loc.gov/${
          newsArray[i].id
        }/ocr/">View newspaper (opens in new tab)</a>
      </li>`);
  }
}
function normalizeDate(dateString) {
  return `${dateString.slice(4, 6)}/${dateString.slice(
    6,
    8
  )}/${dateString.slice(0, 4)}`;
}
