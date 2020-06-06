const API_KEY = 'ae817b3f66f04aa9b0c8c91f21d78ecd';

$(document).ready(function() {

  const url = window.location;
  const urlString = url.toString();
  const idIndex = urlString.lastIndexOf('/');
  const id = urlString.substring(idIndex + 1);

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

          let ingredientImage = '';
          let imagePath = '';
          let imageTag = '';
          if (extendedIngredients[i].image !== null && extendedIngredients[i].image !== 'no.jpg') {
            ingredientImage = extendedIngredients[i].image;
            imagePath = `https://spoonacular.com/cdn/ingredients_100x100/${ingredientImage}`;
            imageTag = `<img src="${imagePath}" alt="${name}" title="${name}">`;

          } else {
            imageTag = `<img src="https://via.placeholder.com/100x100.png/eee/?text=Image+Not+Available" class="img-fluid" title="Image not available">
                        <br><label>(Image not available)</label>`;
          }

          imagePath = `https://spoonacular.com/cdn/ingredients_100x100${ingredientImage}`;

          $('#ingredients-list').append(`
              <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <div class="ingredient-item">
                  ${imageTag}
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

    const query = `https://api.spoonacular.com/recipes/${id}/information?instructionsRequired=true&addRecipeInformation=true&includeNutrition=true&apiKey=${API_KEY}`;

    let recipe = {};

    let title, vegetarian, vegan, veryHealthy, prepTime,
      servings, description, imageType, cuisines,
      diets, ingredients, steps, imageUrlLg, imageUrlSm,
      nutrition, sourceName, sourceUrl;

    $.ajax({
      url: query,
      success: function(data) {

        console.log('Recipe Details: ', data);

        title = data.title;
        vegetarian = data.vegetarian;
        vegan = data.vegan;
        veryHealthy = data.veryHealthy;
        prepTime = data.readyInMinutes;
        servings = data.servings;
        description = data.summary;
        sourceName = data.sourceName;
        sourceUrl = data.sourceUrl;

        cuisines = JSON.stringify(data.cuisines);
        diets = JSON.stringify(data.diets);

        ingredients = JSON.stringify(data.extendedIngredients);

        if (data.analyzedInstructions.length > 0) {

          const allSteps = data.analyzedInstructions;

          steps = [];

          for (let i = 0; i < allSteps.length; i++) {
            for (let j = 0; j < allSteps[i].steps.length; j++) {
              //console.log('step added: ', allSteps[i].steps[j]);
              steps.push(allSteps[i].steps[j]);
            }
          }

          //change the step number to sequence 1 - total:
          for (let i = 0; i < steps.length; i++) {
            steps[i].number = (i + 1);
          }

          steps = JSON.stringify(steps);

        } else {
          steps = null;
        }
        //large image (on details page):
        imageUrlLg = data.image;

        //small image (on search page):
        imageUrlSm = imageUrlLg.replace('556x370', '480x360');

        imageType = data.imageType;

        nutrition = JSON.stringify(data.nutrition.nutrients);

        if (data) {
          console.log('start cooking');

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

      // Create recipe object:
      recipe = {
        id: id,
        title: title,
        vegetarian: vegetarian,
        vegan: vegan,
        veryHealthy: veryHealthy,
        prepTime: prepTime,
        servings: servings,
        cuisines: cuisines,
        imageUrlLg: imageUrlLg,
        imageUrlSm: imageUrlSm,
        imageType: imageType,
        description: description,
        diets: diets,
        ingredients: ingredients,
        nutrition: nutrition,
        steps: steps,
        sourceName: sourceName,
        sourceUrl: sourceUrl
      };

      // add recipe to localStorage:
      window.localStorage.setItem(id, JSON.stringify(recipe));

    });

  });

});

const handleDetailsErr = err => {
  console.log(err);
};