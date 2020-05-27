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

          $('#search-results').append('<ul></ul>');

          for (let i = 0; i < results.length; i++) {
            $('#search-results ul').append(`<li>${results[i].title}</li>`);
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

};

const validateSearchInput = input => {
  var rmSp = input.trim();
  var result = rmSp.search(/^[A-Za-z\s']+$/); //check to make sure the input is alphabetical
  return (result === 0 ? true : false); //return true if it is alphabetical, false if not
};
