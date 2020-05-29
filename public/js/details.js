$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  const url = window.location;
  const urlString = url.toString();
  const idIndex = urlString.lastIndexOf('/');
  const id = urlString.substring(idIndex + 1);
  $('#recipe-id').text(id);

  $('#start-cooking').on('click', function(event) {
    event.preventDefault();

    console.log('start cooking');

    $.get(`/${id}/steps/:steps`).then(() => {
      window.location.replace(`/${id}/steps/1`);
      // If there's an error, log the error
    }).catch(handleDetailsErr);

  });

});

const handleDetailsErr = err => {
  console.log(err);
};
