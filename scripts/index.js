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
const editProfileSaveBtn = editProfileModal.querySelector(
  ".modal__submit-button"
);
const newPostBtn = profileSection.querySelector(".profile__new-post-button");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-button");
const newPostSaveBtn = newPostModal.querySelector(".modal__submit-button");

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

// --- --------- --- //
// --- Functions --- //
// --- --------- --- //

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

editProfileBtn.addEventListener("click", function () {
  toggleModalVisibility(editProfileModal);
  fillProfileInputFields();
});

editProfileCloseBtn.addEventListener("click", function () {
  toggleModalVisibility(editProfileModal);
});

editProfileForm.addEventListener("submit", function (e) {
  setProfileContentFields();
  toggleModalVisibility(editProfileModal);
  e.preventDefault();
});

newPostBtn.addEventListener("click", function () {
  toggleModalVisibility(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  toggleModalVisibility(newPostModal);
});

newPostForm.addEventListener("submit", function (e) {
  addNewPost();
  toggleModalVisibility(newPostModal);
  e.preventDefault();
});
