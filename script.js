const API = "https://api.freeapi.app/api/v1/public/dogs/dog/random";

const dogDisplayContainer = document.querySelector("#dog-selector-container");
const favoriteContainer = document.querySelector("#favorite-container");
const searchedText = document.querySelector("#search-text");
const searchBtn = document.querySelector("#search-btn");
const goBackBtn = document.querySelector("#go-back-btn");

// retrieve stored data
let storedDogArray = JSON.parse(localStorage.getItem("storedDogs"));
console.log(storedDogArray);

let favoriteDogArray = storedDogArray || [];
let isFavIconActive = false;

// fetch data from API
const getData = async () => {
  const response = await fetch(API);
  const data = await response.json();
  displayData(data.data);
};

// Display data from API to Dog selector container
const displayData = (data) => {
  let dogCard = "";
  dogCard = `
            <div class="card" style="width: 18rem">
            <img
              class="card-img-top"
              src=${data.image.url}
              alt=${data.name}
            />
            <div class="card-body">
              <h5 class="card-title">${data.name}</h5>
              <p class="card-text d-flex flex-wrap gap-1">
               ${data.temperament
                 .split(",")
                 .map((item) => {
                   return `<span class="border border-success rounded p-1">${item}</span>`;
                 })
                 .join(" ")}
              </p>
               <p class="card-text">
               Height : ${data.height.metric} cm
              </p>
               <p class="card-text">
               Weight : ${data.weight.metric} kg
              </p>
               <p class="card-text">
               Life - Span : ${data.life_span} yrs
              </p>
               <p class="card-text">
               Breed Group : ${data.breed_group} 
              </p>
               <p class="card-text">
               Breed For : ${data.bred_for} 
              </p>
              <div class="d-flex justify-content-between">
                <button class="btn btn-success" onclick="handleOnNextClick()">Next</button>
                <button class="btn" onclick = "handleFavBtnClick('${
                  data.name
                },${data.image.url},${data.id}')">
                  <i id="favorite-icon" class="fa-regular fa-heart"></i>
                </button>
              </div>
            </div>
          </div>
  `;
  dogDisplayContainer.innerHTML = dogCard;
};

const handleOnNextClick = () => {
  getData();
  isFavIconActive = false;
};

// store data locally and update value
const updateLocalStorage = () => {
  localStorage.setItem("storedDogs", JSON.stringify(favoriteDogArray));
  storedDogArray = JSON.parse(localStorage.getItem("storedDogs"));
};

// dynamically handles fav button color when clicked
const handleFavBtnColor = () => {
  const favoriteIcon = document.getElementById("favorite-icon");
  if (isFavIconActive) favoriteIcon.classList = "fa-solid fa-heart text-danger";
  else favoriteIcon.classList = "fa-regular fa-heart text-danger";
};

const handleFavBtnClick = (...data) => {
  // array destructuring
  const [name, image, id] = data[0].split(",");
  //   Spread operator on object
  const favoriteDog = { id, name, image, isFavorite: true };

  //   Push data only when favorite icon is off
  if (!isFavIconActive) {
    favoriteDogArray.push(favoriteDog);
    updateLocalStorage();
    isFavIconActive = true;
  }
  handleFavBtnColor();

  displayFavoriteData();
};

// Display favorite data
const displayFavoriteData = (dogArray = storedDogArray) => {
  let favDog = "";
  if (dogArray != null && dogArray != "") {
    dogArray.forEach((dog) => {
      favDog += ` <div class="card m-2 h-50" style="width: 18rem">
        <img
          class="card-img-top"
          src=${dog.image}
          alt=${dog.name}
          style="height:15rem"
        />
        <div
          class="card-body d-flex justify-content-between align-items-center"
        >
          <h5 class="card-title">${dog.name}</h5>
          <button id="fav-btn" class="btn" onclick= handleUnFavBtnClick(${dog.id})>
            <i class="fa-solid fa-heart text-danger"></i>
          </button>
        </div>
      </div>`;
    });
  } else {
    favDog = `<div class="m-2">No favorites yet :(</div>`;
  }
  favoriteContainer.innerHTML = favDog;
};

// toggle go back button visibility
const toggleGoBackButtonVisibility = () => {
  goBackBtn.classList.toggle("invisible");
};

// Remove dog from favorite
const handleUnFavBtnClick = (dogId) => {
  // Last Entry in array
  const lastItem = storedDogArray[storedDogArray.length - 1];
  //   Removed Item from array
  const removedItem = storedDogArray.filter((dog) => dog.id == dogId);
  //   Handle fav icon behavior of item in selector container
  if (lastItem.id === removedItem[0].id) {
    isFavIconActive = false;
    handleFavBtnColor();
  }
  //  Filter non selected item from array
  favoriteDogArray = storedDogArray.filter((dog) => dog.id != dogId);
  updateLocalStorage();
  displayFavoriteData();
  goBackBtn.classList = "btn btn-success invisible";
};

// Handles Search Operation
searchBtn.onclick = (event) => {
  event.preventDefault();
  const searchText = searchedText.value.toLowerCase().trim();

  if (searchText != "") {
    const filteredDogArray = favoriteDogArray.filter((dog) =>
      dog.name.toLowerCase().includes(searchText)
    );

    if (filteredDogArray != "") displayFavoriteData(filteredDogArray);
    else favoriteContainer.innerHTML = `"${searchText}" cannot be found.`;
    searchedText.value = "";
    toggleGoBackButtonVisibility();
  }
};

// handles go back button action after search
goBackBtn.onclick = () => {
  displayFavoriteData();
  toggleGoBackButtonVisibility();
};

getData();
displayFavoriteData();
