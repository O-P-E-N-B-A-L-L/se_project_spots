import "./index.css";

import Api from "../utils/Api.js";
import handleSubmit from "../utils/handleSubmit.js";
import {
  settings,
  disableButtonState,
  enableValidation,
  resetValidation,
} from "../scripts/validation.js";

// --- ----------------- --- //
// --- Element Selection --- //
// --- ----------------- --- //

// Sections & Modals
const profileSection = document.querySelector(".profile");
const cardsSection = document.querySelector(".cards");

const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editProfileModal = document.querySelector("#edit-profile-modal");
const newPostModal = document.querySelector("#new-post-modal");
const deletePostModal = document.querySelector("#delete-post-modal");
const imageCanvasModal = document.querySelector("#image-canvas-modal");

// Forms
const editAvatarForm = editAvatarModal.querySelector(".modal__form");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const newPostForm = newPostModal.querySelector(".modal__form");
const confirmDeleteForm = deletePostModal.querySelector(".modal__form");

// Profile Related Fields
const profileName = profileSection.querySelector(".profile__name");
const profileDescription = profileSection.querySelector(
  ".profile__description",
);
const profileAvatar = profileSection.querySelector(".profile__avatar-image");
const profileAvatarField = editAvatarModal.querySelector("#avatar-image-input");
const editProfileInputName = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileInputDescription = editProfileModal.querySelector(
  "#profile-description-input",
);

// New Post Fields
const newPostImageLink = newPostModal.querySelector("#card-image-input");
const newPostCaption = newPostModal.querySelector("#card-caption-input");

// Buttons
const editAvatarBtn = profileSection.querySelector(
  ".profile__button--edit-avatar",
);
const editProfileBtn = profileSection.querySelector(
  ".profile__button--edit-profile",
);
const newPostBtn = profileSection.querySelector(".profile__button--new-post");

const avatarSubmitBtn = editAvatarModal.querySelector(".modal__button--submit");
const editProfileSubmitBtn = editProfileForm.querySelector(
  ".modal__button--submit",
);
const newPostSubmitBtn = newPostModal.querySelector(".modal__button--submit");

const cancelDeleteBtn = deletePostModal.querySelector(".modal__button--cancel");

// Card Template
const cardTemplate = document.querySelector("#card-template").content;
const imageCanvas = imageCanvasModal.querySelector(".modal__image");
const imageCanvasCaption = imageCanvasModal.querySelector(
  ".modal__image-caption",
);

// Card Tracking
let selectedCard;

// Utilities
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "34cf53ee-b4e2-47f3-b3d9-df8e77df9592",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userData]) => {
    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardsSection.append(cardElement);
    });

    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.src = userData.avatar;
  })
  .catch((err) => console.error(err));

// --- --------- --- //
// --- Functions --- //
// --- --------- --- //

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", modal.closeOnEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", modal.closeOnEscape);
}

function fillProfileInputFields() {
  editProfileInputName.value = profileName.textContent;
  editProfileInputDescription.value = profileDescription.textContent;
}

function handleEditProfileSubmit(evt) {
  function makeRequest() {
    return api
      .editUserInfo({
        name: editProfileInputName.value,
        about: editProfileInputDescription.value,
      })
      .then((userData) => {
        profileName.textContent = userData.name;
        profileDescription.textContent = userData.about;
        closeModal(editProfileModal);
        disableButtonState(editProfileSubmitBtn, settings);
      });
  }

  handleSubmit(makeRequest, evt);
}

function handleNewPostSubmit(evt) {
  function makeRequest() {
    return api
      .createCard({
        name: newPostCaption.value,
        link: newPostImageLink.value,
      })
      .then((cardData) => {
        cardsSection.prepend(getCardElement(cardData));
        closeModal(newPostModal);
        disableButtonState(newPostSubmitBtn, settings);
      });
  }

  handleSubmit(makeRequest, evt);
}

function handlePostDelete(evt) {
  function makeRequest() {
    return api.deleteCard(selectedCard.cardId).then(() => {
      selectedCard.remove();
      closeModal(deletePostModal);
    });
  }

  handleSubmit(makeRequest, evt, "Deleting...");
}

function handleAvatarSubmit(evt) {
  function makeRequest() {
    return api.editUserAvatar(profileAvatarField.value).then((avatarData) => {
      profileAvatar.src = avatarData.avatar;
      closeModal(editAvatarModal);
      disableButtonState(avatarSubmitBtn, settings);
    });
  }

  handleSubmit(makeRequest, evt);
}

// --- ----------------- --- //
// --- Factory Functions --- //
// --- ----------------- --- //

// Card Factory
function getCardElement(data) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikeBtn = cardElement.querySelector(".card__button--like");
  const cardDeleteBtn = cardElement.querySelector(".card__button--delete");

  cardElement.cardId = data._id;
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  // For syncing the "like" state to the local instance
  if (data.isLiked) {
    cardElement.isLiked = true;
    cardLikeBtn.classList.add("card__button--liked");
  }

  cardLikeBtn.addEventListener("click", () => {
    if (!cardElement.isLiked) {
      api
        .likeCard(cardElement.cardId)
        .then(() => {
          cardElement.isLiked = true;
          cardLikeBtn.classList.add("card__button--liked");
        })
        .catch(console.error);
    } else {
      api
        .dislikeCard(cardElement.cardId)
        .then(() => {
          cardElement.isLiked = false;
          cardLikeBtn.classList.remove("card__button--liked");
        })
        .catch(console.error);
    }
  });

  cardDeleteBtn.addEventListener("click", (evt) => {
    selectedCard = evt.target.closest(".card");
    openModal(deletePostModal);
  });

  cardImage.addEventListener("click", () => {
    imageCanvas.src = data.link;
    imageCanvas.alt = data.name;
    imageCanvasCaption.textContent = data.name;
    openModal(imageCanvasModal);
  });

  return cardElement;
}

// Modal Factory
const setModalListeners = (modal) => {
  // User clicks on the close button
  modal.querySelector(".modal__button--close").addEventListener("click", () => {
    closeModal(modal);
  });

  // User clicks off of the modal
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });

  // User hits the Escape key
  modal.closeOnEscape = (evt) => {
    if (evt.key === "Escape") {
      closeModal(modal);
    }
  };
};

// --- --------------- --- //
// --- Event Listeners --- //
// --- --------------- --- //

// Avatar
editAvatarBtn.addEventListener("click", () => {
  openModal(editAvatarModal);
});

editAvatarForm.addEventListener("submit", handleAvatarSubmit);

// Edit Profile
editProfileBtn.addEventListener("click", () => {
  fillProfileInputFields();
  resetValidation(
    editProfileForm,
    [editProfileInputName, editProfileInputDescription],
    settings,
  );
  openModal(editProfileModal);
});

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

// New Post
newPostBtn.addEventListener("click", () => {
  openModal(newPostModal);
});

newPostForm.addEventListener("submit", handleNewPostSubmit);

// Card deletion
confirmDeleteForm.addEventListener("submit", handlePostDelete);

cancelDeleteBtn.addEventListener("click", () => {
  closeModal(deletePostModal);
});

// --- -------------- --- //
// --- Initialization --- //
// --- -------------- --- //

// Apply modal-related event listeners to all modals
document.querySelectorAll(".modal").forEach(setModalListeners);

enableValidation(settings);
