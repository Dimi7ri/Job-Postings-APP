import { Meteor } from 'meteor/meteor';
const _ = require('lodash');

Meteor.methods({
  getAllLocations: function () {
    try {
      var result = HTTP.call('GET', 'https://private-8dbaa-nibdevchallenge.apiary-mock.com/location');
      if (result && result.content) return JSON.parse(result.content);
    } catch (err) {
      throw new Meteor.Error('api error', err);
    }
  },
  getAllJobs: function () {
    const jobs = Assets.getText("jobs.json");
    try {
      let jsonJobs = JSON.parse(jobs);
      return jsonJobs.data;
    } catch (err) {
      throw new Meteor.Error('api error', err);
    }
  },
  getJobsByLocation: function (locationId) {
    const jobs = Assets.getText("jobs.json");
    var filteredJobs = [];
    var locationId = parseInt(locationId)
    try {
      let jsonJobs = JSON.parse(jobs);
      let jsonObject = jsonJobs.data;
      for(let i=0; i<Object.keys(jsonObject).length; i++){
        if(_.includes(jsonObject[i].locations, locationId)){
          filteredJobs.push(jsonObject[i])
        }
      }
      return filteredJobs;
    } catch (err) {
      throw new Meteor.Error('api error', err);
    }
  }
});
