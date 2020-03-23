"use strict";

let searchTerm;

// listen for click on 'search' button
function submitHandler() {
  $(".js-search").on("click", "button", event => {
    event.preventDefault();

    // clear the search results
    $(".js-results-list").empty();

    // once button is clicked, collect the text that is in `input`
    const userInput = $('input[id="word-search"]').val();

    // strip out spaces and symbols
    searchTerm = prepText(userInput);
    console.log(`this is searchTerm: ${searchTerm}`);

    // call APIs with searchTerm
    runSearches();

    console.log(`submitHandler ran`);
  });
}

// remove all characters except [a-z] and hyphens
function prepText(userWord) {
  const regex = /\s|[\,\-]/g;
  console.log(`prepText ran`);
  return userWord
    .toLowerCase()
    .trim()
    .replace(regex, "");
}

function runSearches() {
  const dictionaryApi = `https://dictionaryapi.com/api/v3/references/collegiate/json/${searchTerm}?key=59c5b8e3-5c70-4863-a9b2-9edad5a91de1`;

  const wikiApi = `https://en.wikipedia.org/api/rest_v1/page/summary/${searchTerm}?redirect=false`;
  const wikiHeaders = {
    headers: new Headers({
      "User-Agent": `amycarlsonpepper@gmail.com`,
      Accept: `text/html; charset=utf-8; profile="https://www.mediawiki.org/wiki/Specs/HTML/2.0.0"`,
      Accept: `https://en.wikipedia.org/api/rest_v1`
    })
  };

  const libraryApi = `https://chroniclingamerica.loc.gov/search/pages/results/?andtext=${searchTerm}&format=json`;

  //call dictionary API
  dictionaryCall(dictionaryApi);

  //call Wikimedia API
  wikiCall(wikiApi, wikiHeaders);

  //call lib of Congress API
  libraryCall(libraryApi);

  console.log(
    `runSearches ran with: ${dictionaryApi}, ${wikiApi}, ${libraryApi}`
  );
}

function dictionaryCall(url) {
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(dictionaryJson => {
      displayDictionaryDefs(dictionaryJson);
      displayEtymology(dictionaryJson);
    })
    .catch(err => $(".search-error").html(`Something went wrong: (${err})`));
}

function wikiCall(url, options) {
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(
        `Wikipedia couldn't find a page that related to your search.`
      );
    })
    .then(wikiJson => {
      console.log("this is wikipedia json: ", wikiJson);
      displayWiki(wikiJson);
    })
    .catch(err => $(".search-error").html(`<p>${err}</p>`));
}

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

function displayDictionaryDefs(dictionaryArr) {
  // remove hidden class so results will show
  $(".dictionary").removeClass("hidden");

  //render results to the DOM
  $(".dictionary ul").append(`
  <li><p>Definition(s):</p></li>`);

  console.log(dictionaryArr);

  // grab all matching dictionary definitions
  dictionaryArr.forEach(dictObj => {
    console.log(dictObj.shortdef);
    dictObj.shortdef.forEach(sense => {
      $(".dictionary li").append(`<p>${sense}</p>`);
    });
  });
}

function displayEtymology(dictionaryArr) {
  // remove hidden class so results will show
  $(".dictionary").removeClass("hidden");

  //render results to the DOM
  $(".dictionary ul").append(`
  <li class="origin"><p>Origin(s):</p></li>`);

  // test for presence of "et" key
  for (let i = 0; i < dictionaryArr.length; i++) {
    if ("et" in dictionaryArr[i]) {
      // if et exists, render the contents at index 1 of each of its arrays to the DOM
      for (let index = 0; index < dictionaryArr[i].et.length; index++) {
        let etymologies = `${dictionaryArr[i].et[index][1]}`;
        console.log("this is etymologies: ", etymologies);

        $(".dictionary li.origin").append(
          `<p>${formatEtymologies(etymologies)}</p>`
        );
      }
    } else {
      console.log("sorry :(");
    }
  }
}
function formatEtymologies(rawString) {
  const regex1 = /{/g;
  const regex2 = /}/g;
  const regex3 = /it(?=>)/g;
  let firstCleanup = rawString.replace(regex1, "<");
  let secondCleanup = firstCleanup.replace(regex2, ">");
  let cleanedUpEtymologies = secondCleanup.replace(regex3, "i");
  console.log("no more stupid {i}???", cleanedUpEtymologies);
  return cleanedUpEtymologies;
}

function displayWiki(wikiObj) {
  $(".wiki").removeClass("hidden");

  $(".wiki ul").append(`
  <li class="wiki"><p>Wikipedia page(s):</p></li>
  <p class="wiki-title">${wikiObj.displaytitle}</p>
  <p><a href="${wikiObj["content_urls"].desktop.page}">${wikiObj["content_urls"].desktop.page}</a></p>
  ${wikiObj["extract_html"]}`);

  console.log(`displayWiki ran`);
}

function displayLibrary(libraryData) {
  $(".newspapers").removeClass("hidden");

  $(".newspapers ul").append(`
  <li class="newspapers"><p>"${searchTerm}" as used in newspapers throughout American history:<br />(Please note that the relevancy of search results is limited by the accuracy of the Library of Congess' text recognition software that scanned the newspaper images):</p></li>`);

  $(generateNewspaperResults(libraryData));

  console.log(`displayLibrary ran`);
  console.log(`this is libraryData: ${libraryData}`);
}

function generateNewspaperResults(libObj) {
  const newsArray = libObj.items;
  for (let i = 0; i < 5; i++) {
    $(".newspapers li").append(`<p>${normalizeNewsResults(newsArray)}</p>
    <p>Date published: ${newsArray[i].date}</p>
    <p><a target="_blank" href="https://chroniclingamerica.loc.gov/${
      newsArray[i].id
    }/ocr/">View newspaper (opens in new tab)</a></p>
    `);
  }
}
function normalizeNewsResults(arr) {
  let normalizedPaperTitle = arr[i].title.split("[");
  return normalizedPaperTitle[0];
}
$(submitHandler);
