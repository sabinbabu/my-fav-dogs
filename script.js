const API = "https://api.freeapi.app/api/v1/public/dogs/dog/random";

const dogDisplayContainer = document.querySelector("#dog-selector-container");
const favoriteContainer = document.querySelector("#favorite-container");
let favoriteDogArray = [];
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
              <p class="card-text">
               ${data.temperament}
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
                <button class="btn" onclick = "handleFavBtnClick('${data.name},${data.image.url},${data.id}')">
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
    isFavIconActive = true;
  }
  handleFavBtnColor();
  displayFavoriteData();
};

// Display favorite data
const displayFavoriteData = () => {
  let favDog = "";
  if (favoriteDogArray != "") {
    favoriteDogArray.forEach((dog) => {
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

// Remove dog from favorite
const handleUnFavBtnClick = (dogId) => {
  // Last Entry in array
  const lastItem = favoriteDogArray[favoriteDogArray.length - 1];

  //   Removed Item from array
  const removedItem = favoriteDogArray.filter((dog) => dog.id == dogId);

  //   Handle fav icon behavior of item in selector container
  if (lastItem.id === removedItem[0].id) {
    isFavIconActive = false;
    handleFavBtnColor();
  }

  //   Filter non selected item from array
  favoriteDogArray = favoriteDogArray.filter((dog) => dog.id != dogId);
  displayFavoriteData();
};

getData();
displayFavoriteData();
