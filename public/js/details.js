const API_KEY = '520acba345fb4fc582e4496d65f38cef';

$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  const url = window.location;
  const urlString = url.toString();
  const idIndex = urlString.lastIndexOf('/');
  const id = urlString.substring(idIndex + 1);
  $('#recipe-id').text(id);

  const query = `https://api.spoonacular.com/recipes/${id}/information?addRecipeInformation=true&includeNutrition=true&apiKey=${API_KEY}`;

  $.ajax({
    url: query,
    success: function(data) {

      console.log('Recipe Details: ', data);

      const { title, readyInMinutes, servings,
        vegetarian, vegan,
        veryHealthy, cuisines, image, summary,
        extendedIngredients, diets,
        sourceName, sourceUrl } = data;

      $('#recipe-title').text(title);
      $('#prep-time').text(readyInMinutes);
      $('#servings').text(servings);

      if (cuisines.length > 0) {
        $('#cuisines').show();

        for (let i = 0; i < cuisines.length; i++) {
          $('#cuisines-list').append(`<li>${cuisines[i]}</li>`);
        }
      } else {
        $('#cuisines').hide();
      }

      if (image !== null) {
        $('#recipe-image').show();
        $('#recipe-image').append(`<img src="${image}" alt="${title}" class="img-fluid">`);
      } else {
        $('#recipe-image').hide();
      }

      if (summary !== null) {
        $('#recipe-description').show().append(summary);
      } else {
        $('#recipe-description').hide();
      }

      if (extendedIngredients.length > 0) {
        $('#recipe-ingredients').show();

        for (i = 0; i < extendedIngredients.length; i++) {

          const name = extendedIngredients[i].name;
          const IngredientImage = extendedIngredients[i].image;

          const imagePath = `https://spoonacular.com/cdn/ingredients_100x100/${IngredientImage}`;

          $('#ingredients-list').append(`
              <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <div class="ingredient-item">
                  <img src="${imagePath}" alt="${name}" title="${name}">
                  <p><label>${name}</label><p>
                </div>
              </div>
          `);
        }
      } else {
        $('#recipe-ingredients').hide();
      }

      if (veryHealthy === true) {
        $('#very-healthy').show();
      } else {
        $('#very-healthy').hide();
      }

      if (vegetarian === true) {
        $('#vegetarian').show();
      } else {
        $('#vegetarian').hide();
      }

      if (vegan === true) {
        $('#vegan').show();
      } else {
        $('#vegan').hide();
      }

      if (diets.length > 0) {
        $('#diets').show();

        for (let i = 0; i < diets.length; i++) {
          $('#diets-list').append(`<li>${diets[i]}</li>`);
        }
      } else {
        $('#diets').hide();
      }

      const nutrients = data.nutrition.nutrients;

      for (let i = 0; i < nutrients.length; i++) {

        const { title, amount, unit } = nutrients[i];

        $('#nutrients-table tbody').append(`
          <tr>
            <td>${title}</td>
            <td><span>${amount}</span><span>${unit}</span></td>
          </tr>
        `);
      }

      if (sourceName !== null) {
        $('#source-name').show().text(sourceName).attr('href', sourceUrl);
      } else {
        $('#source-name').hide();
      }

    }
  });

  $('.previous').on('click', function(event) {
    event.preventDefault();
    window.location.replace('/members');
  });

  $('.start-cooking').on('click', function(event) {
    event.preventDefault();

    let stepsArray = [];

    const query = `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${API_KEY}`;

    $.ajax({
      url: query,
      success: function(data) {

        console.log(data);

        if (data.length > 0) {
          console.log('start cooking');

          const stepsList = data[0].steps;

          for (let i = 0; i < stepsList.length; i++) {
            stepsArray.push(stepsList[i]);
          }

          $.get(`/${id}/steps/:steps`).then(() => {
            window.location.replace(`/${id}/steps/1`);
            // If there's an error, log the error
          }).catch(handleDetailsErr);
        } else {
          // If the recipe is not available, alert the user with a modal:
          alert('The recipe for this meal is not available.');
        }

      }
    }).then(() => {

      window.localStorage.setItem(id, JSON.stringify(stepsArray));

    });

  });

});

const handleDetailsErr = err => {
  console.log(err);
};