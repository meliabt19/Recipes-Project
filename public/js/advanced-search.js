const API_KEY = 'e88644c6c9354e7795a330f1d321bc90';

$(document).ready(() => {

  $('#advanced-search').on('submit', (event) => {

    event.preventDefault();
    $('advanced-search-results').empty();

    // Query string
    const dishInput = $('#dish').val();
    const dishTrimmed = dishInput.trim();
    const dishString = dishTrimmed.replace(/ /g, ',+');

    // Cuisine
    const cuisine = $('#cuisine').val();
    console.log(cuisine);

    // Diet
    const dietInput = $('input[name=diet]:checked').val();

    // Intolorances
    const allergyInput = [];
    $.each($('input[name=\'allergy\']:checked'), function(){
      allergyInput.push($(this).val());
    });

    const prepTime = 15;
    const maxCalories = 1000;
    const maxCarbs = 150;
    const maxFat = 600;
    const maxSaturatedFat = 500;
    const maxCholesterol = 1000;
    const maxFiber = 1000;
    const maxSodium = 500;
    const maxSugar = 100;

    const query = `https://api.spoonacular.com/recipes/complexSearch?query=${dishString}&cuisine=${cuisine}&maxReadyTime=${prepTime}&diet=${dietInput}&maxCalories=${maxCalories}&maxSugar=${maxSugar}&intolerances=${allergyInput}&maxFat${maxFat}&maxSaturatedFat=${maxSaturatedFat}&maxCholestero=${maxCholesterol}&maxFiber=${maxFiber}&maxCarbs${maxCarbs}&maxSodium=${maxSodium}&instructionsRequired=true&addRecipeInformation=true&sort=popularity&sort=desc&number=20&apiKey=${API_KEY}`;

    console.log(query);

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

});