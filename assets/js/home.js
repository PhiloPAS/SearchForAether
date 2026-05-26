const homeInput = document.getElementById("query");

if (homeInput) {
  homeInput.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      homeInput.value = "";
    }
  });
}
