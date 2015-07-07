var models = require('../models/models.js');
var sequelize = models.sequelize;

//GET /quizes/statistic
exports.index = function(req, res) {
  var Statistics = {};
  getTotalQuizes()
    .then(function(count) {
      Statistics.totalQuizNumber = count;
    })
    .then(getTotalComments)
    .then(function(count) {
      Statistics.totalCommentNumber = count;
    })
    .then(getAverageCommentNumber)
    .then(function(count) {
      Statistics.averageCommentNumber = count;
    })
    .then(getQuizesNoComments)
    .then(function(count) {
      Statistics.totalQuizNoCommentNumber = count;
    })
    .then(getQuizesWithComments)
    .then(function(count) {
      Statistics.totalQuizWithCommentNumber = count;
    })
    .then(function() {
      res.render('statistics/new', {statistics: Statistics, errors: []});
    })
};

//statistics
var getTotalQuizes = function() {
 return models.Quiz.count().then(function(count) {
    return count;
  }).catch(function(error) {console.log(error); return 0;})
};

var getTotalComments = function() {
  return models.Comment.count().then(function(count) {
    return count;
  }).catch(function(error) {console.log(error); return 0;})
};

var getAverageCommentNumber = function() {
  var count = 0;
  var avg = 0;
  return getSubQueryCount().then(function(quizes) {
    quizes.forEach(function(tupla) {
      if (tupla.Comments) {
        avg = avg + tupla.Comments.length;
        count = count + 1;
      }
    });
    if (count == 0) return 0;
    else return Math.floor(avg/count);
  }).catch(function(error) {console.log(error); return 0;});
};

var getQuizesNoComments = function() {
  return getTotalQuizes().then(getQuizesNoCommentSustract);
};

var getQuizesNoCommentSustract = function(totalQuizes) {
  return getQuizesWithComments().then(function(count) {
    return totalQuizes - count;
  }).catch(function(error) {console.log(error); return 0;});
}

var getQuizesWithComments = function() {
  return models.Quiz.count({
    attributes: ['pregunta'],
    include: [{
        model: models.Comment,
        as: "Comments",
        required: true
      }],
      distinct: 'pregunta'
  }).then(function(count) {
    return count;
  }).catch(function(error) {console.log(error); return 0;});
};

var getSubQueryCount = function() {
  return models.Quiz.findAll({
    include: [{
        model: models.Comment,
        as: 'Comments',
        distinct: 'id'
      }],
    distinct: 'id'
  }).then(function(subquery) {
    return subquery;
  }).catch(function(error) {console.log(error); return null;});
}
