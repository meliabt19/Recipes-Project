const API_KEY = '520acba345fb4fc582e4496d65f38cef';

$(document).ready(() => {








  $('#advanced-search').on('submit', (event) => {

    event.preventDefault();

    const dishInput = $('#dish').val();
    const dishTrimmed = dishInput.trim();
    const dishString = dishTrimmed.replace(/ /g, ',+');

    const dietInput = $('input[name=diet]:checked').val();

    const allergyInput = [];
    $.each($('input[name=\'allergy\']:checked'), function(){
      allergyInput.push($(this).val());
    });

    const query = `https://api.spoonacular.com/recipes/complexSearch?query=${dishString}&diet=${dietInput}&intolerances=${allergyInput}&apiKey=${API_KEY}`;

    $.ajax({
      url: query,
      success: (data) => {
        console.log(data);
        console.log(query);
      }
    });

  });

});