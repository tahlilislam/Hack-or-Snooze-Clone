"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  //function call isStoryFavorite returns true or false values;
  //identifying if a given story is a favorite story and checking it on the UI
  const isUserLoggedIn = currentUser ? true : false;
  const isChecked =
    isUserLoggedIn && currentUser.isStoryFavorite(story.storyId)
      ? "checked"
      : "";

  // Check if delete button should be visible or not
  const deleteButtonClass = showDeleteBtn ? "" : "invisible";

  //Remove star if user is not looged in
  const favoriteCheckboxClass = isUserLoggedIn ? "" : "invisible";

  return $(`
      <li id="${story.storyId}">
      <i class="fas fa-trash-alt delete-story-btn ${deleteButtonClass}"></i>
      <input type="checkbox" class ="star ${favoriteCheckboxClass}" ${isChecked}>
      <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story, false);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//To put it in the tab for user's own stories
async function putStoriesOnMyStories() {
  console.debug("putStoriesOnMyStories");

  $myStoriesList.empty();

  if (currentUser.ownStories.length === 0) {
    $myStoriesList.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true); //passing true to show delete btn
      $myStoriesList.prepend($story);
    }
  }
  $myStoriesList.show();
}

/** Handle submitting new story form. */
async function addNewStoryOnPage(event) {
  console.debug("addNewStoryOnPage");
  event.preventDefault();

  const title = $("#submit-title").val();
  const author = $("#submit-author").val();
  const url = $("#submit-url").val();

  const newStoryData = { title, author, url };

  const newStory = await storyList.addStory(currentUser, newStoryData);

  // currentUser.ownStories.push(newStory);

  putStoriesOnPage();

  $submitStoryForm.trigger("reset");
  $submitStoryForm.hide();

  return newStory;
}
$submitStoryForm.on("submit", addNewStoryOnPage);

async function deleteStoryClick(evt) {
  console.debug("deleteStory", evt);
  const $tgt = $(evt.target);
  const storyId = $tgt.closest("li").attr("id");

  // Send request to backend to delete the story
  await storyList.removeStory(currentUser, storyId);

  // re-generate story list
  putStoriesOnMyStories();
}
$myStoriesList.on("click", ".delete-story-btn", deleteStoryClick);

// Adds favorited stories on the favorites tab
function addOnFavoritesPage() {
  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h5>No favorites added yet!</h5>");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.prepend($story);
    }
  }
  $favoritedStories.show();
}

// Adds or removes favorites from story instance based on whether it's checked
async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite", evt);

  const $tgt = $(evt.target);
  const storyId = $tgt.closest("li").attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);
  const isChecked = $tgt.prop("checked");

  if (isChecked) {
    await currentUser.addFavorite(story);
  } else {
    await currentUser.removeFavorite(story);
  }
  //This updates the UI by regenerating favorites page immediately as a star is toggled;
  // Otherwise we would have had to change page for UI to be updated
  if ($favoritedStories.is(":visible")) {
    addOnFavoritesPage();
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite);
