document.addEventListener("DOMContentLoaded", function () {
  fetchData();
});

document.getElementById("fetch-button").addEventListener("click", function () {
  fetchData();
});

function fetchData() {
  const diceElement = document.getElementById("dice");

  diceElement.classList.add("loading");

  const fetchButton = document.getElementById('fetch-button')
  fetchButton.disabled = true;

  fetch("https://api.adviceslip.com/advice")
    .then((response) => response.json())
    .then((data) => {
      const advice = data.slip.advice;
      const adviceNumber = data.slip.id;

      const adviceElement = document.querySelector("#advice");
      const sentenceElement = document.querySelector("#sentence");

      const newAdvice = `ADVICE #${adviceNumber}`;
      const newSentence = `“${advice}”`;

      if (
        adviceElement.textContent === newAdvice ||
        sentenceElement.textContent === newSentence
      ) {
        fetchData();
        return;
      }

      adviceElement.textContent = newAdvice;
      sentenceElement.textContent = newSentence;

      diceElement.classList.remove("loading");
      fetchButton.disabled = false;
    })
    .catch((error) => {
      console.log("Wystąpił błąd:", error);
      diceElement.classList.remove("loading");
      fetchButton.disabled = false;
    });
}