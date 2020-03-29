"use strict";

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

function displayWiki(wikiObj) {
  $(".js-wiki-sec").removeClass("hidden");
  $(".js-wiki-ul").append(`
    <h2 class="center-text">Wikipedia page(s):</h2>`);

  testWiki(wikiObj);

  console.log(`displayWiki ran`);
}
function testWiki(obj) {
  if (obj.type !== "standard") {
    $(".js-wiki-ul")
      .append(`<li><p class="wiki-title ital">${obj.displaytitle}</p>
    <p><a target="_blank" href="${obj["content_urls"].desktop.page}">See full article</a></p>
    <p class="ital">(${obj.description})</p></li>`);
  } else {
    $(".js-wiki-ul")
      .append(`<li><p class="wiki-title bold">${obj.displaytitle}</p>
    <p><a target="_blank" href="${obj["content_urls"].desktop.page}">See full article</a></p>
     <article>${obj["extract"]}</article></li>`);
  }
}
