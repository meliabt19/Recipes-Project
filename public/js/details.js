const API_KEY = 'ae817b3f66f04aa9b0c8c91f21d78ecd';

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

    const query = `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${API_KEY}`;

    $.ajax({
      url: query,
      success: function(data) {

        console.log(data.length);

        if (data.length > 0) {
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
    });

  });

});

const handleDetailsErr = err => {
  console.log(err);
};
