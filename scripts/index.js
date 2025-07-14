// --- ----------- --- //
// --- Bug Tracker --- //
// --- ----------- --- //
/*

  1. New Post Form Submission:
    a. The form can submit empty url's without throwing errors.
       This will result in the logging of 'New post using image "" with caption "caption" was created.'

*/
// --- --------------- --- //
// --- Local Variables --- //
// --- --------------- --- //

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

// --- ---------------------- --- //
// --- Element Identification --- //
// --- ---------------------- --- //

// Sections & Modals
const newPostModal = document.querySelector("#new-post-modal");
const editProfileModal = document.querySelector("#edit-profile-modal");
const profileSection = document.querySelector(".profile");

// Buttons
const editProfileBtn = profileSection.querySelector(
  ".profile__edit-profile-button"
);
const editProfileCloseBtn = editProfileModal.querySelector(
  ".modal__close-button"
);
const newPostBtn = profileSection.querySelector(".profile__new-post-button");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-button");

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

// Forms
const editProfileForm = editProfileModal.querySelector(".modal__form");
const newPostForm = newPostModal.querySelector(".modal__form");

// --- -------------------- --- //
// --- Function Definitions --- //
// --- -------------------- --- //

function toggleModalVisibility(modal) {
  modal.classList.toggle("modal_is-opened");
}

function fillProfileInputFields() {
  editProfileInputName.value = profileName.textContent;
  editProfileInputDescription.value = profileDescription.textContent;
}

function setProfileContentFields() {
  profileName.textContent = editProfileInputName.value;
  profileDescription.textContent = editProfileInputDescription.value;
}

function addNewPost() {
  console.log(
    `New post using image "${newPostImageLink.value}" with caption "${newPostCaption.value}" was created.`
  );
  newPostForm.reset();
}

// --- --------------- --- //
// --- Event Listeners --- //
// --- --------------- --- //

editProfileBtn.addEventListener("click", () => {
  toggleModalVisibility(editProfileModal);
  fillProfileInputFields();
});

editProfileCloseBtn.addEventListener("click", () => {
  toggleModalVisibility(editProfileModal);
});

editProfileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  setProfileContentFields();
  toggleModalVisibility(editProfileModal);
});

newPostBtn.addEventListener("click", () => {
  toggleModalVisibility(newPostModal);
});

newPostCloseBtn.addEventListener("click", () => {
  toggleModalVisibility(newPostModal);
});

newPostForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addNewPost();
  toggleModalVisibility(newPostModal);
});

// --- ---------- --- //
// --- Load Posts --- //
// --- ---------- --- //

initialCards.forEach((card) => {
  console.log(`Array item loaded: "${card.name}".`);
});
