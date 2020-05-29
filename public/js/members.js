const API_KEY = 'ae817b3f66f04aa9b0c8c91f21d78ecd';
//const API_KEY = process.env.API_KEY;

$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get('/api/user_data').then(function(data) {
    $('.member-name').text(data.fname);
  });

  $('#global-search').on('submit', function(event) {
    event.preventDefault();

    $('#search-results').empty();

    const searchInput = $('#search-query').val();

    const validInput = validateSearchInput(searchInput);

    if (validInput) {
      hideError('#search-error-alert');

      const searchTrim = searchInput.trim();

      const searchString = searchTrim.replace(/ /g, ',+');

      const query = `https://api.spoonacular.com/recipes/search?query=${searchString}&number=20&apiKey=${API_KEY}`;

      console.log(query);

      $.ajax({
        url: query,
        success: function(data) {

          const results = data.results;

          if (results.length === 0) {
            $('#search-results').html('<div class="col-sm-3"><h4>No results found.</h4></div>');
          } else {

            for (let i = 0; i < results.length; i++) {
              const recipe = createRecipeCard(results[i]);
              $('#search-results').append(recipe);
            }

          }

        }
      });

    } else {
      textInputError('#search-error-alert', '#search-error-msg', 'Invalid search field. Must be alphabetical and cannot contain punctuation marks.');
    }

  });
});

const textInputError = (type, messageContainer, message) => {
  $(type + ' ' + messageContainer).text(message);
  $(type).fadeIn(500);
};

const hideError = type => {
  $(type).hide();
};

const createRecipeCard = recipe => {
  const { id, title, image, readyInMinutes, servings, sourceUrl } = recipe;

  let imgTag;

  if (image !== undefined) {

    const imageTypeIndex = image.lastIndexOf('.', image.length);

    const imageType = image.substring(imageTypeIndex);

    const imageSize = '480x360';

    const imagePath = `https://spoonacular.com/recipeImages/${id}-${imageSize}${imageType}`;

    imgTag = `<img src="${imagePath}" class="card-img-top img-fluid" alt="${title}">`;

  } else {

    imgTag = '<img src="https://via.placeholder.com/480x360.png?text=Image+Not+Available" class="img-fluid" title="Image not available">';

  }

  return `<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
            <div class="card">
              ${imgTag}
              <div class="card-body">
                <h4 class="card-title">${title}</h4>
                <p class="card-text">Prep Time: ${readyInMinutes} minutes</p>
                <p class="card-text">Servings: ${servings}</p>
              </div>
              <div class="card-body">
                <a href="#" name="${id}" onclick="addToRecipeBook(name)" class="btn btn-primary">Add</a>
                <a href="#" name="${id}" onclick="viewRecipeDetails(name)" class="btn btn-primary">Details</a>
                <p><a href="${sourceUrl}">View Source Link</a></p>
              </div>
            </div>
          </div>`;

};

// eslint-disable-next-line no-unused-vars
const addToRecipeBook = id => {
  event.preventDefault();
  console.log(id);
};

// eslint-disable-next-line no-unused-vars
const viewRecipeDetails = id => {
  event.preventDefault();
  console.log(id);

  $.get(`/details/${id}`).then(function() {
    window.location.replace(`/details/${id}`);
    // If there's an error, log the error
  }).catch(handleDetailsErr);

};

const handleDetailsErr = err => {
  console.log(err);
};

const validateSearchInput = input => {
  var rmSp = input.trim();
  var result = rmSp.search(/^[A-Za-z\s']+$/); //check to make sure the input is alphabetical
  return (result === 0 ? true : false); //return true if it is alphabetical, false if not
};
