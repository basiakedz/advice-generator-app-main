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

const addToFavouriteButton = document.getElementById("add-to-favourite-button");

const removeFromFavouriteButton = document.getElementById(
  "remove-from-favourites-button"
);

addToFavouriteButton.addEventListener("click", function () {
  addToFavourites(advice);
  addToFavouriteButton.classList.add("hidden");
  removeFromFavouriteButton.classList.remove("hidden");
});

removeFromFavouriteButton.addEventListener("click", function () {
  removeFromFavourites(advice);
  removeFromFavouriteButton.classList.add("hidden");
  addToFavouriteButton.classList.remove("hidden");
});

function isInFavourites(advice) {
  const favourites = getFavouritesFromLocalStorage();
  return favourites.includes(advice);
}

function addToFavourites(advice) {
  const favourites = getFavouritesFromLocalStorage();
  if (!favourites.includes(advice)) {
    favourites.push(advice);
    updatedFavouritesInLocalStorage(favourites);
  }
}

function removeFromFavourites(advice) {
  const favourites = getFavouritesFromLocalStorage();
  const updatedFavourites = favourites.filter(
    (favourite) => favourite !== advice
  );
  updatedFavouritesInLocalStorage(updatedFavourites);
}

function getFavouritesFromLocalStorage() {
  return JSON.parse(localStorage.getItem("favourites")) || [];
}

function updatedFavouritesInLocalStorage(updatedFavourites) {
  return localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
}

function openModal() {
  const modal = document.querySelector(".modal");
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.querySelector(".modal");
  modal.style.display = "none";
}

document
  .getElementById("open-modal-button")
  .addEventListener("click", openModal);
document
  .getElementById("close-modal-button")
  .addEventListener("click", closeModal);

window.addEventListener("click", (event) => {
  const modal = document.querySelector(".modal");
  if (event.target === modal) {
    closeModal();
  }
});
