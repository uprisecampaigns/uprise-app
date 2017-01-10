const authenticationMiddleware = require('../middlewares/authentication.js'); //todo apply when needed
const userModel = require('../models/User.js');

const setUserRoutes = function(router){

	router.get('/api/v1/users/:id', 
		function (req, res) {
      console.log(userModel);
			const userId = req.params.id;
		  userModel.getUserProfile(userId)
      .then( (result) => {
        console.log(result);
        return res.json(result);
      })
		}
	);
}

module.exports = setUserRoutes;
