const initialCards = [
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

// --- ---------------------- --- //
// --- Element Identification --- //
// --- ---------------------- --- //

// Sections & Modals
const profileSection = document.querySelector(".profile");
const cardsSection = document.querySelector(".cards");
const newPostModal = document.querySelector("#new-post-modal");
const editProfileModal = document.querySelector("#edit-profile-modal");
const imageCanvasModal = document.querySelector("#image-canvas-modal");

// Forms
const editProfileForm = editProfileModal.querySelector(".modal__form");
const newPostForm = newPostModal.querySelector(".modal__form");

// Profile Related Fields
const profileName = profileSection.querySelector(".profile__name");
const profileDescription = profileSection.querySelector(
  ".profile__description"
);
const editProfileInputName = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileInputDescription = editProfileModal.querySelector(
  "#profile-description-input"
);

// New Post Fields
const newPostImageLink = newPostModal.querySelector("#card-image-input");
const newPostCaption = newPostModal.querySelector("#card-caption-input");

// Buttons
const editProfileBtn = profileSection.querySelector(
  ".profile__edit-profile-button"
);
const editProfileCloseBtn = editProfileModal.querySelector(
  ".modal__close-button"
);
const editProfileSubmitBtn = editProfileForm.querySelector(
  ".modal__submit-button"
);
const newPostBtn = profileSection.querySelector(".profile__new-post-button");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-button");
const newPostSubmitBtn = newPostModal.querySelector(".modal__submit-button");
const imageCanvasCloseBtn = imageCanvasModal.querySelector(
  ".modal__close-button"
);

// Card Template
const cardTemplate = document.querySelector("#card-template").content;
const imageCanvas = imageCanvasModal.querySelector(".modal__image");
const imageCanvasCaption = imageCanvasModal.querySelector(
  ".modal__image-caption"
);

// --- --------- --- //
// --- Functions --- //
// --- --------- --- //

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", (evt) => {
    handleEscapePress(evt, modal);
  });
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", (evt) => {
    handleEscapePress(evt, modal);
  });
}

function fillProfileInputFields() {
  editProfileInputName.value = profileName.textContent;
  editProfileInputDescription.value = profileDescription.textContent;
}

function setProfileContentFields() {
  profileName.textContent = editProfileInputName.value;
  profileDescription.textContent = editProfileInputDescription.value;
}

function getCardElement(data) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  cardImage.src = data.link;
  cardImage.alt = data.name;

  cardTitle.textContent = data.name;

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-button_liked");
  });

  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImage.addEventListener("click", () => {
    imageCanvas.src = data.link;
    imageCanvas.alt = data.name;
    imageCanvasCaption.textContent = data.name;
    openModal(imageCanvasModal);
  });

  return cardElement;
}

function addNewPost() {
  const cardElement = getCardElement({
    name: newPostCaption.value,
    link: newPostImageLink.value,
  });
  cardsSection.prepend(cardElement);
  disableButtonState(newPostSubmitBtn, settings);
  newPostForm.reset();
}

// Modal Factory Function
const setModalListeners = (modal) => {
  // Close button
  modal.querySelector(".modal__close-button").addEventListener("click", () => {
    closeModal(modal);
  });

  // User clicks off of the modal
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
};

const handleEscapePress = (evt, modal) => {
  if (evt.key === "Escape" && modal) {
    closeModal(modal);
  }
};

// --- --------------- --- //
// --- Event Listeners --- //
// --- --------------- --- //

editProfileBtn.addEventListener("click", () => {
  fillProfileInputFields();
  resetValidation(
    editProfileForm,
    [editProfileInputName, editProfileInputDescription],
    settings
  );
  openModal(editProfileModal);
});

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  setProfileContentFields();
  disableButtonState(editProfileSubmitBtn, settings);
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", () => {
  openModal(newPostModal);
});

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  addNewPost();
  closeModal(newPostModal);
});

// --- -------------- --- //
// --- Initialization --- //
// --- -------------- --- //

// Set the initial posts
initialCards.forEach((card) => {
  const cardElement = getCardElement(card);
  cardsSection.prepend(cardElement);
});

// Apply modal-related event listeners to all modals
document.querySelectorAll(".modal").forEach((modal) => {
  setModalListeners(modal);
});
