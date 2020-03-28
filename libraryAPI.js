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
    .catch(err =>
      $(".search-error").html(`<p>Something went wrong: (${err})</p>`)
    );
}

function displayLibrary(libraryData) {
  $(".newspapers").removeClass("hidden");

  $(".newspapers ul").append(`
    <li class="newspapers"><h2 class="center-text newspaper-title">"${searchTerm}" as used in newspapers throughout American history:</h2>
    <p class="disclaimer ital">(Search results' relevance limited by accuracy of text recognition software):</p></li>`);

  $(generateNewspaperResults(libraryData));

  $("li.newspapers").append(
    `<p class="center-text"><a target="_blank" href="https://chroniclingamerica.loc.gov/">Search for more results from the Library of Congress' database</a></p>`
  );
  console.log(`displayLibrary ran`);
}

function generateNewspaperResults(libObj) {
  const newsArray = libObj.items;

  for (let i = 0; i < 5; i++) {
    let rawTitle = newsArray[i].title;
    let rawDate = newsArray[i].date;

    $("li.newspapers").append(`<li><p class="ital">${rawTitle.split("[")[0]}</p>
      <p>Date published: ${normalizeDate(rawDate)}</p>
      <p class="news-link"><a target="_blank" href="https://chroniclingamerica.loc.gov/${
        newsArray[i].id
      }/ocr/">View newspaper (opens in new tab)</a></p></li>
      `);
  }
}
function normalizeDate(dateString) {
  return `${dateString.slice(4, 6)}/${dateString.slice(
    6,
    8
  )}/${dateString.slice(0, 4)}`;
}
