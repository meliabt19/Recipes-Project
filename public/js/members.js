const API_KEY = '520acba345fb4fc582e4496d65f38cef';
//const API_KEY = process.env.API_KEY;

$(document).ready(function() {

  $.get('/api/user_data').then(function(data) {
    $('.member-name').text(data.fname);
  });

  $('#global-search').on('submit', function(event) {
    event.preventDefault();
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
  const { id, title, readyInMinutes, servings, sourceUrl } = recipe;

  const image = `${title}-${id}-500x500.jpg`;

  return `<div class="card" style="width: 18rem;">
            <img src="${image}" class="card-img-top" alt="${title}">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <p class="card-text">Prep Time: ${readyInMinutes}</p>
              <p class="card-text">Servings: ${servings}</p>
            </div>
            <div class="card-body">
              <a href="#" id="${id}" addToRecipeBook(id) class="card-link">Add</a>
              <a href="#" class="card-link">Details</a>
              <a href="${sourceUrl}">Source Link</a>
            </div>
          </div>`;

};

const validateSearchInput = input => {
  var rmSp = input.trim();
  var result = rmSp.search(/^[A-Za-z\s']+$/); //check to make sure the input is alphabetical
  return (result === 0 ? true : false); //return true if it is alphabetical, false if not
};
