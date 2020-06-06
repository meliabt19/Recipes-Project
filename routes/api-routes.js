// Requiring our models and passport as we've configured it
var db = require('../models');
var passport = require('../config/passport');

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post('/api/login', passport.authenticate('local'), function(req, res) {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post('/api/signup', function(req, res) {
    db.User.create({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, '/api/login');
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  // Route for getting some data about our user to be used client side
  app.get('/api/user_data', function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        fname: req.user.fname,
        lname: req.user.lname,
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  app.get('/api/recipes', function(req, res) {

    db.Recipe.findAll({}).then(function(dbRecipe) {
      res.json(dbRecipe);
    });

  });

  app.get('/api/details/:id', async (req, res) => {
    try {
      const recipe = await db.Recipe.findOne({
        where: {
          id: req.params.id
        }
      });
      res.json(recipe);
    } catch (err) {
      res.json(err);
    }
    
  });

  app.post('/api/add_recipe', function(req, res) {
    db.Recipe.create({
      id: req.body.id,
      title: req.body.title,
      vegetarian: req.body.vegetarian,
      vegan: req.body.vegan,
      veryHealthy: req.body.veryHealthy,
      prepTime: req.body.prepTime,
      servings: req.body.servings,
      cuisines: req.body.cuisines,
      imageUrlLg: req.body.imageUrlLg,
      imageUrlSm: req.body.imageUrlSm,
      imageType: req.body.imageType,
      description: req.body.description,
      diets: req.body.diets,
      ingredients: req.body.ingredients,
      nutrition: req.body.nutrition,
      steps: req.body.steps,
      sourceName: req.body.sourceName,
      sourceUrl: req.body.sourceUrl
    })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

   // Route for deleting recipes from users recipe book
   app.delete('/api/delete_recipe/:id', (req) => {
    db.Recipe.destroy({
      where: {
        id: req.params.id
      }
    });
  });

};
