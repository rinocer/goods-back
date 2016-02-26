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

  var maxDistance = event.distance || 10;
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

function searchProject(event, context){
  console.log('Search projects');
  var searchText = event.query || 'givr';
  models.Project.search(searchText, function(err, projects){
    console.log(err, projects);
    if(err){
      console.error(err);
      context.fail(err);
    }
    else context.succeed(projects);
  });
}

function readProject(event, context){
  console.log('Read projects');
  var requiredId = event.id || '';
  models.Project.findById(requiredId, function(err, project){
    console.log(err, project);
    if(err){
      console.error(err);
      context.fail(err);
    }
    else context.succeed(project);
  });
}

function joinProject(event, context){
  console.log('Join projects');
  var projectId = event.project || '';
  var itemId = event.item || '';
  var givr = event.givr || 'Anonymous';
  console.log(projectId, itemId, givr);

  models.Project.findOneAndUpdate(
    { "_id": projectId,
      "items._id": itemId },
    { "$set":
      {
        "items.$.gived": true,
        "items.$.givr": givr
      }
    },
    function(err,project) {
      console.log(project);
      if(err){
        console.error(err);
        context.fail(err);
      }
      else context.succeed(project);
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
        searchProject(event, context);
        break;
      case 'read':
        readProject(event, context);
        break;
      case 'give':
        joinProject(event, context);
        break;
      default:
        context.fail(new Error('Unrecognized operation "' + operation + '"'));
    }
};

exports.handler = mainHandler;
