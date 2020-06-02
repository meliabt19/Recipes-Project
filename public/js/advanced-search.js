const API_KEY = '520acba345fb4fc582e4496d65f38cef';

$(document).ready(() => {

  $('#advanced-search').on('submit', (event) => {

    event.preventDefault();
    $('#advanced-search-results').empty();

    const dishInput = $('#dish').val();

    const validInput = validateSearchInput(dishInput);

    if (validInput) {
      hideError('#search-error-alert');
    } else {
      textInputError('#search-error-alert', '#search-error-msg', 'Invalid search field. Must be alphabetical and cannot contain punctuation marks.');
      return;
    }

    const dishTrimmed = dishInput.trim();
    const dishString = dishTrimmed.replace(/ /g, ',+');

    const prepTimeInput = $('#prep-time').val();

    let prepTime;

    if (prepTimeInput !== 'any') {
      prepTime = prepTimeInput;
    } else {
      prepTime = null;
    }

    console.log('prepTime: ' + prepTime);

    const dietInput = $('input[name=diet]:checked').val();

    const allergyInput = [];
    $.each($('input[name=\'allergy\']:checked'), function(){
      allergyInput.push($(this).val());
    });

    const query = `https://api.spoonacular.com/recipes/complexSearch?query=${dishString}&maxReadyTime=${prepTime}&addRecipeInformation=true&instructionsRequired=true&diet=${dietInput}&intolerances=${allergyInput}&apiKey=${API_KEY}`;

    $.ajax({
      url: query,
      success: (data) => {

        const {length} = data.results;

        if (length === 0) {
          $('#no-recipes').text('No found recipes, try again...');
        } else{
          const results = data.results;

          results.forEach(rec => {
            const recipe = createRecipeCard(rec);
            $('#advanced-search-results').append(recipe);
          });
        }

      }

    });

  });

});

const textInputError = (type, messageContainer, message) => {
  $(type + ' ' + messageContainer).text(message);
  $(type).fadeIn(500);
};

const hideError = type => {
  $(type).hide();
};

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