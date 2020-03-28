"use strict";

let searchTerm;

// listen for click on 'search' button
function submitHandler() {
  $(".js-search").on("click", "button", event => {
    // store the text that is in `input`
    const userInput = $('input[id="word-search"]').val();

    // prevent default submit behavior
    event.preventDefault();

    // clear the search results
    $(".js-results-list").empty();

    // strip out spaces and lowercase letters
    searchTerm = prepText(userInput);
    console.log(`this is searchTerm: ${searchTerm}`);

    // test for non A-Z characters
    if (searchTerm.length === 0) {
      $(".form-validation-success").addClass("hidden");
      $(".form-validation-fail").removeClass("hidden");

      $(".form-validation-advice").text(
        "We need a word before we can search for it!"
      );
    } else if (/(\W|[0-9])/g.test(searchTerm)) {
      $(".form-validation-success").addClass("hidden");
      $(".form-validation-fail").removeClass("hidden");

      $(".form-validation-advice").text("Invalid search term. Try again!");
    } else {
      $(".form-validation-fail").addClass("hidden");
      $(".form-validation-success").removeClass("hidden");

      // call APIs with searchTerm
      runSearches();
    }
  });
  console.log(`submitHandler ran`);
}

// remove all characters except [a-z]
function prepText(userWord) {
  const regex2 = /\s|[\,\-]/g;
  console.log(`prepText ran`);
  return userWord
    .toLowerCase()
    .trim()
    .replace(regex2, "");
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

$(submitHandler);
