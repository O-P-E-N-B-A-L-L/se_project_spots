export default class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _request(url, options) {
    return fetch(url, options).then(this._checkResponse);
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  // --- ----------- --- //
  // --- INIT ROUTES --- //
  // --- ----------- --- //

  // Return when all promises are received
  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  // [GET] .../cards
  // Get the current cards
  getInitialCards() {
    return this._request(`${this._baseUrl}/cards`, {
      method: "GET",
      headers: this._headers,
    });
  }

  // --- ----------- --- //
  // --- USER ROUTES --- //
  // --- ----------- --- //

  // [GET] .../users/me
  // Get the current user’s info
  getUserInfo() {
    return this._request(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: this._headers,
    });
  }

  // [PATCH] .../users/me
  // Update your profile information
  editUserInfo({ name, about }) {
    return this._request(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    });
  }

  // [PATCH] .../users/me/avatar
  // Update avatar
  editUserAvatar(avatar) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    });
  }

  // --- ----------- --- //
  // --- CARD ROUTES --- //
  // --- ----------- --- //

  // [GET] .../cards
  // Get all cards
  getCards() {
    return this._request(`${this._baseUrl}/cards`, {
      method: "GET",
      headers: this._headers,
    });
  }

  // [POST] .../cards
  // Create a card
  createCard({ name, link }) {
    return this._request(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    });
  }

  // [DELETE] .../cards/:cardId
  // Delete a card
  deleteCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
      body: JSON.stringify({
        cardId,
      }),
    });
  }

  // [PUT] .../cards/:cardId/likes
  // Like a card
  likeCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers,
      body: JSON.stringify({
        cardId,
      }),
    });
  }

  // [DELETE] .../cards/:cardId/likes
  // Dislike a card
  dislikeCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers,
      body: JSON.stringify({
        cardId,
      }),
    });
  }
}
