const newPostModal = document.querySelector("#new-post-modal");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileBtn = document.querySelector(".profile__edit-profile-button");
const editProfileCloseBtn = editProfileModal.querySelector(
  ".modal__close-button"
);
const newPostBtn = document.querySelector(".profile__new-post-button");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-button");

/*
  Comment to reviewer:
  Both methods below serve the same purpose.  Whether that's adding & removing the class, or toggling the class.  Which would you prefer to see?  Of course this would be better off in a standalone function, which leads me to believe toggling is the way to go.  Your thoughts mean the world to me :D
*/

editProfileBtn.addEventListener("click", function (event) {
  editProfileModal.classList.add("modal_is-opened");
});

editProfileCloseBtn.addEventListener("click", function (event) {
  editProfileModal.classList.remove("modal_is-opened");
});

newPostBtn.addEventListener("click", function (event) {
  newPostModal.classList.toggle("modal_is-opened");
});

newPostCloseBtn.addEventListener("click", function (event) {
  newPostModal.classList.toggle("modal_is-opened");
});
