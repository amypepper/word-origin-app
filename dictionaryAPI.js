"use strict";

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

function displayDictionaryDefs(dictionaryArr) {
  console.log("this is dictionaryArr: ", dictionaryArr);
  // remove hidden class so results will show
  $(".js-definitions-sec").removeClass("hidden");

  //render results to the DOM
  $(".js-definitions-ul").append(`
     <h2 class="center-text">Related Definitions:</h2>`);

  generateDefinitions(dictionaryArr);

  $(".js-definitions-sec").append(
    `<p class="center-text"><a target="_blank" href="https://www.merriam-webster.com/">Click here to visit Merriam-Webster's online dictionary</a></p>`
  );
  console.log(`displayDictionaryDefs ran`);
}

function generateDefinitions(dictInfo) {
  // test to be sure there is a `shortdef` key
  if (!dictInfo[0].shortdef) {
    $(".js-definitions-ul").append(
      `<p class="ital">We couldn't find that word. Here are some search suggestions:</p>`
    );

    for (let i = 0; i < 10; i++) {
      $(".js-definitions-ul").append(`<p>${dictInfo[i]}</p>`);
    }
  } else {
    // grab all matching dictionary definitions
    dictInfo.forEach(dictObj => {
      let headWord = `${dictObj.hwi.hw}`;
      let senses = dictObj.shortdef;
      $(".js-definitions-ul").append(
        `<li><p><span class="ital">${headWord}:</span>${senses.join(
          "; "
        )}</p></li>`
      );
    });
  }
  console.log(`generateDefinitions ran`);
}

function displayEtymology(dictionaryArr) {
  // remove hidden class so results will show
  $(".js-origins-sec").removeClass("hidden");

  $(".js-origins-ul").append(`
    <h2 class="center-text">Related Word Origin(s):</h2>`);

  //render results to the DOM
  testEtymologies(dictionaryArr);

  $(".js-origins-sec").append(
    `<p class="center-text"><a target="_blank" href="https://www.merriam-webster.com/">Click here to visit Merriam-Webster's online dictionary</a></p>`
  );
}

function testEtymologies(dictInfo) {
  // test for presence of "et" key
  for (let i = 0; i < dictInfo.length; i++) {
    if (dictInfo[i].et) {
      // if et exists, render the contents at index 1 of each of its arrays to the DOM
      dictInfo[i].et.forEach(etItem => {
        const regex = /{[^/i]/g;
        if (regex.test(etItem[1])) {
          console.log("bad cross-reference");
        } else {
          $(".js-origins-ul").append(
            `<li><p><span class="ital">${
              dictInfo[i].hwi.hw
            }:</span>${formatEtymologies(etItem[1])}</p></li>`
          );
        }
      });
    }
  }
}

function formatEtymologies(rawString) {
  const regex1 = /{it}/g;
  const regex2 = /{\/it}/g;
  let firstCleanup = rawString.replace(regex1, `"`);
  let cleanedUpEtymologies = firstCleanup.replace(regex2, `"`);

  console.log("no more stupid {i}???", cleanedUpEtymologies);
  return cleanedUpEtymologies;
}
