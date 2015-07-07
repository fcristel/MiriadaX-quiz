var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var authorController = require('../controllers/author_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz', errors: [] });
});

//Autoload de comandos con :quizId
router.param('quizId', quizController.load); //autoload :quizid

//Definición de rutas de sesion
router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy); //debería ser un DELETE

//Definición de ruta de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
//Definición de ruta de /quizes para la edición de preguntas
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);
//Definición de ruta de /quizes para comments
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);

//Definición de ruta de /author
router.get('/author', authorController.author);

module.exports = router;
