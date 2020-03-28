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
  $(".wiki").removeClass("hidden");
  $(".wiki ul").append(`
    <li class="wiki"><h2 class="center-text">Wikipedia page(s):</h2></li>`);

  testWiki(wikiObj);

  console.log(`displayWiki ran`);
}
function testWiki(obj) {
  if (obj.type !== "standard") {
    $("li.wiki").append(`<p class="wiki-title ital">${obj.displaytitle}</p>
    <p><a target="_blank" href="${obj["content_urls"].desktop.page}">See full article</a></p>
    <p class="ital">(${obj.description})</p>`);
  } else {
    $("li.wiki").append(`<p class="wiki-title bold">${obj.displaytitle}</p>
    <p><a target="_blank" href="${obj["content_urls"].desktop.page}">See full article</a></p>
     <article>${obj["extract"]}</article>`);
  }
}
