document.addEventListener("DOMContentLoaded", function () {
  fetchData();
});

document.getElementById("fetch-button").addEventListener("click", function () {
  fetchData();
});

function fetchData() {
  const diceElement = document.getElementById("dice");

  diceElement.classList.add("button__loading");

  const fetchButton = document.getElementById("fetch-button");
  fetchButton.disabled = true;

  fetch("https://api.adviceslip.com/advice")
    .then((response) => response.json())
    .then((data) => {
      const advice = data.slip.advice;
      const adviceNumber = data.slip.id;

      const adviceElement = document.querySelector("#advice");
      const quotesElement = document.querySelector("#quotes");

      const newAdvice = `ADVICE #${adviceNumber}`;
      const newQuotes = `“${advice}”`;

      if (
        adviceElement.textContent === newAdvice ||
        quotesElement.textContent === newQuotes
      ) {
        fetchData();
        return;
      }

      adviceElement.textContent = newAdvice;
      quotesElement.textContent = newQuotes;

      diceElement.classList.remove("button__loading");
      fetchButton.disabled = false;
    })
    .catch((error) => {
      console.log("Wystąpił błąd:", error);
      diceElement.classList.remove("button__loading");
      fetchButton.disabled = false;
    });
}
