"use strict";

// call the Library of Congress' Chronicling America API
function libraryCall(url) {
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(libraryJson => {
      displayNewspapers(libraryJson);
    })
    .catch(err => $(".search-error").text(`${err}`));
}

function displayNewspapers(libraryObj) {
  $(".js-newspapers-sec").removeClass("hidden");
  // grab users' keyword to display in title of section
  $(".search-term-holder").html(`"${searchTerm}"`);

  //render results to the DOM
  $(generateNewspaperResults(libraryObj));
}

function generateNewspaperResults(newspapersObj) {
  const newsArray = newspapersObj.items;
  // limit results returned to 10 (no way to limit via parameters/headers)
  for (let i = 0; i < 10; i++) {
    let rawTitle = newsArray[i].title;
    let rawDate = newsArray[i].date;

    // generate HTML for the title without '[volume]' in every headline
    // also grab id from each of the 10 search resullts to create a hyperlink to
    // each newspaper page image
    $(".js-newspapers-ul").append(`<li>
        <h3 class="ital">${rawTitle.split("[")[0]}</h3>
        <p>Date published: ${normalizeDate(rawDate)}</p>
        <a class="news-link" target="_blank" href="https://chroniclingamerica.loc.gov/${
          newsArray[i].id
        }/ocr/">View newspaper (opens in new tab)</a>
      </li>`);
  }
}
// display the `date` value returned by the API as a normally formatted date
function normalizeDate(dateString) {
  return `${dateString.slice(4, 6)}/${dateString.slice(
    6,
    8
  )}/${dateString.slice(0, 4)}`;
}
