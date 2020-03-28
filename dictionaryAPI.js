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
  $(".dictionary").removeClass("hidden");

  //render results to the DOM
  $(".dictionary ul").append(`
     <li class="dictionary"><h2 class="center-text">Related Definitions:</h2></li>`);

  generateDefinitions(dictionaryArr);

  $("li.dictionary").append(
    `<p class="center-text"><a target="_blank" href="https://www.merriam-webster.com/">Click here to visit Merriam-Webster's online dictionary</a></p>`
  );
  console.log(`displayDictionaryDefs ran`);
}

function generateDefinitions(dictInfo) {
  // test to be sure there is a `shortdef` key
  if (!dictInfo[0].shortdef) {
    $("li.dictionary").append(
      `<p class="ital">We couldn't find that word. Here are some search suggestions:</p>`
    );

    for (let i = 0; i < 10; i++) {
      $("li.dictionary").append(`<p>${dictInfo[i]}</p>`);
    }
  } else {
    // grab all matching dictionary definitions
    dictInfo.forEach(dictObj => {
      let headWord = `${dictObj.hwi.hw}`;
      let senses = dictObj.shortdef;
      $("li.dictionary").append(
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
  $(".dictionary").removeClass("hidden");

  //render results to the DOM
  testEtymologies(dictionaryArr);

  $("li.origins").append(
    `<p class="center-text"><a target="_blank" href="https://www.merriam-webster.com/">Click here to visit Merriam-Webster's online dictionary</a></p>`
  );
}

function testEtymologies(dictInfo) {
  $(".dictionary ul").append(`
    <li class="origins" id="origin-id"><h2 class="center-text">Related Word Origin(s):</h2></li>`);

  // test for presence of "et" key
  for (let i = 0; i < dictInfo.length; i++) {
    if (dictInfo[i].et) {
      // if et exists, render the contents at index 1 of each of its arrays to the DOM
      dictInfo[i].et.forEach(etItem => {
        if (/^{/.test(etItem[1])) {
          console.log("bad cross-reference");
        } else {
          $("li.origins").append(
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
