const API_KEY = '520acba345fb4fc582e4496d65f38cef';

$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  const url = window.location;
  const urlString = url.toString();
  const idIndex = urlString.lastIndexOf('/');
  const id = urlString.substring(idIndex + 1);
  $('#recipe-id').text(id);

  $('#previous').on('click', function(event) {
    event.preventDefault();
    window.location.replace('/members');
  });

  $('#start-cooking').on('click', function(event) {
    event.preventDefault();

    //If recipe is not stored in localStorage, retrieve it:
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