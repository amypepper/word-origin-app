"use strict";

function wikiCall(url, options) {
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })

    .then(wikiJson => {
      console.log("this is wikipedia json: ", wikiJson);
      displayWiki(wikiJson);
    })
    .catch(err =>
      $(".search-error").text(
        `${err}: Wikipedia couldn't find an article with that title`
      )
    );
}

function displayWiki(wikiObj) {
  $(".js-wiki-sec").removeClass("hidden");

  testWiki(wikiObj);

  console.log(`displayWiki ran`);
}
function testWiki(obj) {
  if (obj.type !== "standard") {
    $(".js-wiki-ul").append(`<li>
      <article>
        <h3 class="wiki-title ital">${obj.displaytitle}</h3>
        <p class="ital">(${obj.description})</p>
      </article>
      <a class="wiki-title-link" target="_blank" href="${obj["content_urls"].desktop.page}">See full article</a>
    </li>`);
  } else {
    $(".js-wiki-ul").append(`<li>
      <article>
        <h3 class="wiki-title ital">${obj.displaytitle}</h3>
        ${obj["extract"]}
      </article>
      <a class="wiki-title-link" target="_blank" href="${obj["content_urls"].desktop.page}">See full article</a>
    </li>`);
  }
}
