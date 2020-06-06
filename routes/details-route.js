var db = require('../models');

// Routes
// =============================================================
module.exports = function(app) {

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
