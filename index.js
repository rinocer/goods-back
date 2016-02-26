var mongoose = require('mongoose');
var secrets = require('./secret.js');
var models = require('./models.js');
mongoose.connect(secrets.MONGO);


console.log('Loading function');

function createProject(event, context){
  console.log('Create projects');
  var project = new models.Project(event);
  project.save(function (err, doc) {
    if(err){
      console.error(err);
      context.fail(err);
    }
    else context.succeed(doc);
  });
}

function listProject(event, context){
  console.log('List projects');

  var maxDistance = event.distance || 5;
  maxDistance /= 6371;
  var coords = [event.longitude || -3.9265965, event.latitude || 41.752178];

  models.Project.find(
    {
      location: {
        $near: coords,
        $maxDistance: maxDistance
      }
    },
    function(err, projects){
      console.log(err, projects);
      if(err){
        console.error(err);
        context.fail(err);
      }
      else context.succeed(projects);
    });
}

function mainHandler(event, context) {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    var operation = event.operation;
    delete event.operation;

    switch (operation) {
      case 'create':
        createProject(event, context);
        break;
      case 'list':
        listProject(event, context);
        break;
      case 'search':
        break;
      case 'read':
        break;
      case 'join':
      default:
        context.fail(new Error('Unrecognized operation "' + operation + '"'));
    }
};

exports.handler = mainHandler;

//mainHandler({operation:'list', distance:1, latitude:40.452178, longitude:-3.7265965},{});
