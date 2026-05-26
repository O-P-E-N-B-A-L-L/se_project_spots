import "./index.css";

import Api from "../utils/Api.js";
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

const confirmDeleteBtn = deletePostModal.querySelector(
  ".modal__button--delete",
);
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
  evt.preventDefault();
  editProfileSubmitBtn.textContent = "Saving...";
  api
    .editUserInfo({
      name: editProfileInputName.value,
      about: editProfileInputDescription.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
    })
    .catch(console.error)
    .finally(() => {
      editProfileSubmitBtn.textContent = "Save";
      disableButtonState(editProfileSubmitBtn, settings);
      closeModal(editProfileModal);
    });
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  newPostSubmitBtn.textContent = "Saving...";
  api
    .createCard({
      name: newPostCaption.value,
      link: newPostImageLink.value,
    })
    .then((data) => {
      cardsSection.prepend(getCardElement(data));
    })
    .catch(console.error)
    .finally(() => {
      newPostSubmitBtn.textContent = "Save";
      disableButtonState(newPostSubmitBtn, settings);
      closeModal(newPostModal);
      newPostForm.reset();
    });
}

function handlePostDelete() {
  confirmDeleteBtn.textContent = "Deleting...";
  api
    .deleteCard(selectedCard.cardId)
    .then((res) => {
      console.log(res);
    })
    .then(() => {
      selectedCard.remove();
    })
    .catch(console.error)
    .finally(() => {
      confirmDeleteBtn.textContent = "Delete";
      closeModal(deletePostModal);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  avatarSubmitBtn.textContent = "Saving...";
  api
    .editUserAvatar(profileAvatarField.value)
    .then(() => {
      profileAvatar.src = profileAvatarField.value;
    })
    .catch(console.error)
    .finally(() => {
      avatarSubmitBtn.textContent = "Save";
      disableButtonState(avatarSubmitBtn, settings);
      closeModal(editAvatarModal);
      editAvatarForm.reset();
    });
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

editAvatarForm.addEventListener("submit", (evt) => {
  handleAvatarSubmit(evt);
});

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

editProfileForm.addEventListener("submit", (evt) => {
  handleEditProfileSubmit(evt);
});

// New Post
newPostBtn.addEventListener("click", () => {
  openModal(newPostModal);
});

newPostForm.addEventListener("submit", (evt) => {
  handleNewPostSubmit(evt);
});

// Card deletion
confirmDeleteBtn.addEventListener("click", (evt) => {
  handlePostDelete(evt);
});

cancelDeleteBtn.addEventListener("click", () => {
  closeModal(deletePostModal);
});

// --- -------------- --- //
// --- Initialization --- //
// --- -------------- --- //

// Apply modal-related event listeners to all modals
document.querySelectorAll(".modal").forEach((modal) => {
  setModalListeners(modal);
});

enableValidation(settings);
