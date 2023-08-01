document.addEventListener("DOMContentLoaded", function () {
  fetchData();
  updatedFavouriteList();
});

document.getElementById("fetch-button").addEventListener("click", function () {
  fetchData().then(() => {
    const quote = document.querySelector("#quote").innerHTML;
    if (isInFavourites(quote)) {
      addToFavouriteButton.classList.add("hidden");
      removeFromFavouriteButton.classList.remove("hidden");
    } else {
      removeFromFavouriteButton.classList.add("hidden");
      addToFavouriteButton.classList.remove("hidden");
    }
    updatedFavouriteList();
  });
});

function fetchData() {
  const diceElement = document.getElementById("dice");

  diceElement.classList.add("button__loading");

  const fetchButton = document.getElementById("fetch-button");
  fetchButton.disabled = true;

  return fetch("https://api.adviceslip.com/advice")
    .then((response) => response.json())
    .then((data) => {
      const quote = data.slip.advice;
      const adviceNumber = data.slip.id;

      const adviceElement = document.querySelector("#advice");
      const quoteElement = document.querySelector("#quote");

      const newAdvice = `ADVICE #${adviceNumber}`;
      const newQuote = `“${quote}”`;

      if (
        adviceElement.innerHTML === newAdvice ||
        quoteElement.innerHTML === newQuote
      ) {
        fetchData();
        return;
      }

      adviceElement.innerHTML = newAdvice;
      quoteElement.innerHTML = newQuote;

      diceElement.classList.remove("button__loading");
      fetchButton.disabled = false;
    })
    .catch((error) => {
      console.log("An error occurred:", error);
      diceElement.classList.remove("button__loading");
      fetchButton.disabled = false;
    });
}

const addToFavouriteButton = document.getElementById("add-to-favourite-button");
const removeFromFavouriteButton = document.getElementById(
  "remove-from-favourites-button"
);

addToFavouriteButton.addEventListener("click", function () {
  const quote = document.querySelector("#quote").innerHTML;
  addToFavourites(quote);
  addToFavouriteButton.classList.add("hidden");
  removeFromFavouriteButton.classList.remove("hidden");
  updatedFavouriteList();
});

removeFromFavouriteButton.addEventListener("click", function () {
  const quote = document.querySelector("#quote").innerHTML;
  removeFromFavourites(quote);
  removeFromFavouriteButton.classList.add("hidden");
  addToFavouriteButton.classList.remove("hidden");
  updatedFavouriteList();
});

function isInFavourites(quote) {
  const favourites = getFavouritesFromLocalStorage();
  return favourites.includes(quote);
}

function addToFavourites(quote) {
  const favourites = getFavouritesFromLocalStorage();
  if (!favourites.includes(quote)) {
    favourites.push(quote);
    updatedFavouritesInLocalStorage(favourites);
  }
}

function removeFromFavourites(quote) {
  const favourites = getFavouritesFromLocalStorage();
  const updatedFavourites = favourites.filter(
    (favourite) => favourite !== quote
  );
  updatedFavouritesInLocalStorage(updatedFavourites);
}

function getFavouritesFromLocalStorage() {
  const favouritesJSON = localStorage.getItem("favourites");
  return favouritesJSON ? JSON.parse(favouritesJSON) : [];
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

const favouriteListEmpty = document.getElementById("favourite-list-empty");

function updatedFavouriteList() {
  const favourites = getFavouritesFromLocalStorage();
  const favouriteListQuotes = document.getElementById("favourite-list-quotes");

  const favouriteList = document.createElement("ul");
  favouriteList.setAttribute("class", "favourite-list");

  if (favourites.length !== 0) {
    favouriteListEmpty.classList.add("hidden");
  }

  favourites.forEach((favourite, index) => {
    const listItem = document.createElement("li");
    listItem.setAttribute("class", "favourite-list__item");
    listItem.textContent = favourite;

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "favourite-list__delete-button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.addEventListener("click", () => {
      removeFromFavourites(favourite);
      listItem.remove();
      addEmptyState();
      updateFavouriteButtonState(favourite);
    });

    listItem.appendChild(deleteButton);
    favouriteList.appendChild(listItem);
  });
  favouriteListQuotes.innerHTML = "";
  favouriteListQuotes.appendChild(favouriteList);
}

updatedFavouriteList();

function addEmptyState() {
  const favourites = getFavouritesFromLocalStorage();
  if (favourites.length === 0) {
    favouriteListEmpty.classList.remove("hidden");
  }
}
addEmptyState();

function updateFavouriteButtonState(deleted) {
  const quoteElement = document.querySelector("#quote").innerHTML;
  if (quoteElement === deleted) {
    removeFromFavouriteButton.classList.add("hidden");
    addToFavouriteButton.classList.remove("hidden");
  }
}
