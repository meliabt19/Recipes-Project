const API_KEY = '520acba345fb4fc582e4496d65f38cef';
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

      const searchTrim = searchInput.trim();

      const searchString = searchTrim.replace(/ /g, ',+');

      const query = `https://api.spoonacular.com/recipes/search?query=${searchString}&number=20&apiKey=${API_KEY}`;

      console.log(query);

      $.ajax({
        url: query,
        success: function(data) {

          const results = data.results;

          console.log(data);

          for (let i = 0; i < results.length; i++) {
            const recipe = createRecipeCard(results[i]);
            $('#search-results').append(recipe);
          }

        }
      });

    } else {
      console.log('Invalid input.');
    }

  });
});

const createRecipeCard = (recipe) => {
  const { id, title, image, readyInMinutes, servings, sourceUrl } = recipe;

  const imageTypeIndex = image.lastIndexOf('.', image.length);

  const imageType = image.substring(imageTypeIndex);

  const imageSize = '480x360';

  const imagePath = `https://spoonacular.com/recipeImages/${id}-${imageSize}${imageType}`;

  return `<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
            <div class="card">
              <img src="${imagePath}" class="card-img-top img-fluid" alt="${title}">
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

const addToRecipeBook = id => {
  event.preventDefault();
  console.log(id);
};

const viewRecipeDetails = id => {
  event.preventDefault();
  console.log(id);
};

const validateSearchInput = input => {
  var rmSp = input.trim();
  var result = rmSp.search(/^[A-Za-z\s']+$/); //check to make sure the input is alphabetical
  return (result === 0 ? true : false); //return true if it is alphabetical, false if not
};
