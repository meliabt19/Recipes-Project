const API_KEY = '520acba345fb4fc582e4496d65f38cef';

$(document).ready(() => {

  const dish = $('#dish').val();

  const diet = '';

  const intolerances = ['peanut'];
  intolOptions = 'soy';
  intolerances.push(intolOptions);


  const query = `https://api.spoonacular.com/recipes/complexSearch?query=${dish}&diet=${diet}&intolerances=${intolerances}&apiKey=${API_KEY}`;


  console.log(query);
  console.log(dish);
});