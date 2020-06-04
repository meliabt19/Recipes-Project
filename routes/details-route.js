var db = require('../models');

module.exports = function(app) {
    
    // Gets details of Recipe
  app.get('/api/recipes/', function(req, res) {
    db.details.findAll({})
      .then(function(dbRecipe) {
        res.json(dbRecipe);
      });
  });
  //  Specific Recipes
  app.get('/api/', function(req, res) {
    db.details.findOne({
      where: {
        id: req.body.id
      }
    })
      .then(function(dbRecipe) {
        res.json(dbRecipe);
      });
  }); 
  
    app.post('/api/', function(req, res) {
    console.log(req.body);
    db.details.create({
      title: req.body.title,
      body: req.body.body,
      category: req.body.category
    })
      .then(function(dbPost) {
        res.json(dbPost);
    });
});