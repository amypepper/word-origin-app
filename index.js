"use strict";

let searchTerm;

// listen for click on 'search' button
function submitHandler() {
  $(".js-search").on("click", "button", event => {
    event.preventDefault();
    // EMPTY ULs??? OR ADD BACK HIDDEN?

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
  const regex = /\s/g;
  console.log(`prepText ran`);
  return userWord
    .toLowerCase()
    .trim()
    .replace(regex, "");
}

function runSearches() {
  const dictionaryApi = `https://dictionaryapi.com/api/v3/references/collegiate/json/${searchTerm}?key=59c5b8e3-5c70-4863-a9b2-9edad5a91de1`;

  const wikiApi = `https://en.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`;
  const wikiHeaders = {
    headers: new Headers({
      "User-Agent": `amycarlsonpepper@gmail.com`,
      Accept: `text/html; charset=utf-8; profile="https://www.mediawiki.org/wiki/Specs/HTML/2.0.0"`,
      Accept: `https://en.wikipedia.org/api/rest_v1`
    })
  };

  const libraryApi = `https://chroniclingamerica.loc.gov/search/pages/results/?andtext=${searchTerm}&format=json`;

  //call dictionary API
  fetch(dictionaryApi)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(dictionaryJson => {
      console.log(displayDictionaryResults(dictionaryJson));
    })
    .catch(err => $(".search-error").html(`Something went wrong: (${err})`));

  //call Wikimedia API
  fetch(wikiApi, wikiHeaders)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(wikiJson => {
      console.log(wikiJson);
    })
    .catch(err => $(".search-error").html(`Something went wrong: (${err})`));

  //call lib of Congress API
  fetch(libraryApi)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(libraryJson => {
      console.log(libraryJson);
    })
    .catch(err =>
      $(".search-error").html(`<p>Something went wrong: (${err})</p>`)
    );
  console.log(
    `runSearches ran with: ${dictionaryApi}, ${wikiApi}, ${libraryApi}`
  );
}

// render search results to the DOM
function displayDictionaryResults(dictionaryArr) {
  for (let i = 0; i < dictionaryArr.length; i++) {
    return `${dictionaryArr[i].meta.stems[0]}, ${dictionaryArr[i].meta.stems[1]}`;
  }
}

// meta: {id: "gaslight:1", uuid: "95cfd457-08a8-49b5-9ddd-bec635ee94b9", sort: "070440000", src: "collegiate", section: "alpha", …}
// hom: 1
// hwi: {hw: "gas*light", prs: Array(2)}
// fl: "noun"
// def: [{…}]
// date: "1808{ds||1||}"
// shortdef: (3) ["light made by burning illuminating gas", "a gas flame", "a gas lighting fixture"]

submitHandler();
