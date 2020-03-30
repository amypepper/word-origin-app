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
    .catch(err => $(".search-error").text(`${err}`));
}

function displayDictionaryDefs(dictionaryArr) {
  console.log("this is dictionaryArr: ", dictionaryArr);

  // remove hidden class so results will show
  $(".js-definitions-sec").removeClass("hidden");

  //render results to the DOM
  generateDefinitions(dictionaryArr);

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
      // check whether shortdef is empty first
      if (dictObj.shortdef.length === 0) {
        console.log("empty array- no definition text");
      } else {
        let headWord = `${dictObj.hwi.hw}`;
        let senses = dictObj.shortdef;
        $(".js-definitions-ul").append(
          `<li><p><span class="ital">${headWord}:</span>${senses.join(
            "; "
          )}</p></li>`
        );
      }
    });
  }
  console.log(`generateDefinitions ran`);
}

function displayEtymology(dictionaryArr) {
  // remove hidden class so results will show
  $(".js-origins-sec").removeClass("hidden");

  //render results to the DOM
  testEtymologies(dictionaryArr);
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

  return cleanedUpEtymologies;
}
