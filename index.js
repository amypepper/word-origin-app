"use strict";

let searchTerm;

function submitHandler() {
  $(".js-search").on("click", "button", event => {
    event.preventDefault();

    $(".js-results-list").empty();
    $(".search-error").empty();
    $(".form-validation-advice").empty();

    // store the text that is in `input`
    const userInput = $('input[id="word-search"]').val();

    // strip out spaces and lowercase letters from user input
    searchTerm = prepSearchString(userInput);

    // run function to validate the search term
    validateSearch(searchTerm);
  });
}
function validateSearch(testString) {
  //test for no input
  if (testString.length === 0) {
    $(".form-validation-success").addClass("hidden");
    $(".form-validation-fail").removeClass("hidden");

    $(".form-validation-advice").text(
      "We need a word before we can search for it!"
    );
  } else if (/(\W|[0-9])/g.test(testString)) {
    // test for non A-Z characters
    // if there are, display the red x and an error message
    $(".form-validation-success").addClass("hidden");
    $(".form-validation-fail").removeClass("hidden");

    $(".form-validation-advice").text("Invalid search term. Try again!");
  } else {
    // if all is well, show the check symbol and run the searches
    $(".form-validation-fail").addClass("hidden");
    $(".form-validation-success").removeClass("hidden");

    // call APIs with searchTerm
    runSearches(testString);
  }
}

// remove spaces/hyphens and lower case letters so the URIs will work with users' keyword
function prepSearchString(userWord) {
  const regex2 = /\s|[\,\-]/g;
  console.log(`prepSearchString ran`);
  return userWord
    .toLowerCase()
    .trim()
    .replace(regex2, "");
}

function runSearches(searchString) {
  const dictionaryApi = `https://dictionaryapi.com/api/v3/references/collegiate/json/${searchString}?key=59c5b8e3-5c70-4863-a9b2-9edad5a91de1`;

  const wikiApi = `https://en.wikipedia.org/api/rest_v1/page/summary/${searchString}?redirect=false`;
  const wikiHeaders = {
    headers: new Headers({
      "User-Agent": `amycarlsonpepper@gmail.com`,
      Accept: `text/html; charset=utf-8; profile="https://www.mediawiki.org/wiki/Specs/HTML/2.0.0"`,
      Accept: `https://en.wikipedia.org/api/rest_v1`
    })
  };

  const libraryApi = `https://chroniclingamerica.loc.gov/search/pages/results/?andtext=${searchString}&format=json`;

  $(".js-results-list").empty();

  //call dictionary API
  dictionaryCall(dictionaryApi);

  //call Wikimedia API
  wikiCall(wikiApi, wikiHeaders);

  //call Library of Congress Chronicling America API
  libraryCall(libraryApi);
}

$(submitHandler);
