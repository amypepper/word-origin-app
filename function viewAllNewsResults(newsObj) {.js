function viewAllNewsResults(newsObj) {
  $(".newspapers").on("click", "a", generateAllNewsResults(newsObj));
}

function generateAllNewsResults(anotherlibObj) {
  const newsArray = anotherlibObj.items;
  $(".newspapers").removeClass("hidden");

  $(".newspapers ul").append(`
    <li class="newspapers">
    <p class="disclaimer ital">(Search results' relevance limited by accuracy of text recognition software)</p></li>`);

  newsArray.forEach(newspaper => {
    let rawTitle = newspaper.title;
    let rawDate = newspaper.date;

    $(".newspapers li").append(`<p class="ital">${rawTitle.split(".")[0]}</p>
      <p>Date published: ${normalizeDate(rawDate)}</p>
      <p><a target="_blank" href="https://chroniclingamerica.loc.gov/${
        newspaper.id
      }/ocr/">View newspaper (opens in new tab)</a></p>
      `);
  });
}
