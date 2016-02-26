var mongoose = require('mongoose');

exports.Project = mongoose.model('Project', {
  name: String,
  description: String,
  initiator: String,
  instructions: String,
  date: { type: Date, default: Date.now },
  location: {
    type: [Number],
    index: '2d'
  },
  items: [{
    name: String,
    gived: Boolean,
    givr: String
  }]
});

/*
var project = new models.Project({
  name: 'Givr',
  description: 'An app for social crowdfunding. Give goods and services to people nearby',
  initiator: 'Ovi, Marian y Lore',
  instructions: 'VC',
  location: [-3.7265965,40.452178],
  items: [
    {
      name: 'Office',
      gived: false,
    },
    {
      name: 'Cloud',
      gived: false,
    },
    {
      name: 'Talent',
      gived: false,
    }
  ]
});
*/
