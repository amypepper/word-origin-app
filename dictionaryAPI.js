"use strict";

// call Merriam-Webster Dictionary API
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
}

function generateDefinitions(dictEntriesArr) {
  // test to be sure there is a `shortdef` key
  if (!dictEntriesArr[0].shortdef) {
    $(".js-definitions-ul").append(
      `<p role="alert" class="ital">We couldn't find that word. Here are some search suggestions:</p>`
    );

    for (let i = 0; i < 10; i++) {
      $(".js-definitions-ul").append(`<p>${dictEntriesArr[i]}</p>`);
    }
  } else {
    // grab all matching dictionary definitions
    dictEntriesArr.forEach(dictObj => {
      let headWord = `${dictObj.hwi.hw}`;
      // check whether shortdef is empty first
      if (dictObj.shortdef.length === 0) {
        // if it is empty, stop it from throwing an error
        console.log("empty array- no definition text");
      } else {
        // display all forms of the search word that are defined by the API and their definitions
        let senses = dictObj.shortdef;
        $(".js-definitions-ul").append(
          `<li><p><span class="ital">${headWord}:</span>${senses.join(
            "; "
          )}</p></li>`
        );
      }
    });
  }
}

function displayEtymology(dictionaryArr) {
  $(".js-origins-sec").removeClass("hidden");

  //render results to the DOM
  testEtymologies(dictionaryArr);
}

function testEtymologies(entriesArr) {
  // test for presence of "et" key
  for (let i = 0; i < entriesArr.length; i++) {
    if (entriesArr[i].et) {
      // if et exists, render the contents at index 1 of each of its arrays to the DOM
      entriesArr[i].et.forEach(etItem => {
        // if index 1 is an array, grab and display the string inside it
        if (Array.isArray(etItem[1])) {
          etItem[1].forEach(innerEtItem => {
            $(".js-origins-ul").append(
              `<li>
                <p class="supp-notes">Supplemental notes: ${innerEtItem[1]}</p>
              </li>`
            );
          });
        } else {
          // otherwise display each form of the word that has an etymology
          $(".js-origins-ul").append(
            `<li>
                <p class="etymology"><span class="ital">${
                  entriesArr[i].hwi.hw
                }: </span>${formatEtymologies(etItem[1], entriesArr)}</p>
              </li>`
          );
        }
      });
    }
  }
}

// remove all markup included in the `et` string values that the API returns
function formatEtymologies(rawString, arr) {
  const regex = /{et_link\|(.*?)\|.*?}/g;
  const replaceFunctions = rawString
    .replace(/{\/?it}/g, `"`)
    .replace(/{\/?dx_ety}/g, ``)
    .replace(
      /{dxt\|(.*?):\.*?(.*?)\|.*?}/g,
      `"$1", entry 2 at <a target="_blank" href="https://www.merriam-webster.com/">merriam-webster.com</a>`
    )
    .replace(/{ma}.*?{\/ma}/g, ``)
    .replace(/{b}.*?{\/b}/g, "")
    .replace(/{bc}/g, `: `)
    .replace(/{[lr]dquo}/g, `"`)
    .replace(/{sc}.*?{\/sc}/g, "")
    .replace(/{sup}(.*?){\/sup}/g, `<sup>$1</sup>`)
    .replace(/{inf}(.*?){\/inf}/g, `<sub>$1</sub>`);

  if (regex.test(rawString)) {
    // if the etymology string contains only cross-reference markup, grab the dict. entry it references and display the
    // headword and a hyperlink to the dictionary's website
    let crossRefHw = arr.find(
      item => item.meta.id === `${rawString.match(regex)[0].split("|")[1]}`
    );
    return replaceFunctions.replace(regex, `${crossRefHw.hwi.hw}`);
  }
  return replaceFunctions;
}
