"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show Submit Form and all stories on clicking "submit" */
function navSubmitStoryClick(evt) {
  console.debug("navSubmitStoryClick", evt)
  hidePageComponents();
  $allStoriesList.show();
  $submitStoryForm.show();
}
$submitLink.on("click", navSubmitStoryClick)


/** Show My Stories on clicking "my stories" */
function navMyStoryClick(evt) {
  console.debug("navMyStoryClick", evt)
  hidePageComponents();
  putStoriesOnMyStories();
  $myStoriesList.show();
  
}
$body.on("click", "#nav-my-stories", navMyStoryClick);


/** Show Favorites Page on clicking "favorites" */
function favoritesPageClick(evt) {
  console.debug("favoritesPage", evt);
  hidePageComponents();
  addOnFavoritesPage();
}

$body.on("click", "#nav-favorites", favoritesPageClick);

