import React from 'react';
import { Session } from 'meteor/session'
import './app.css';
import JobDescription from './jobdescription';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    let selectValue = Session.get("locationId")
    let locationName = Session.get("locationName")
    this.state = {
      jobsList: [],
      locations: [],
      selectValue: (selectValue)?selectValue:0,
      locationName:(locationName)?locationName:"All Locations"
    };
    this.changeLocation = this.changeLocation.bind(this);
    this.SeeJobDescription = this.SeeJobDescription.bind(this);
  }

  componentDidMount(){
    Meteor.call('getAllLocations', function(error, results) {
      if (error) {
        console.log(error);
      }
      if (results) {
        this.setState({ locations: results });
      }
    }.bind(this));
    Meteor.call('getAllJobs',function(error, results) {
      if (error) {
        console.log(error);
      }
      if (results) {
        this.setState({ jobsList: results });
      }
    }.bind(this));
  }

  changeLocation(event){
    var locationName;
    if(event.target.value == 0){
      this.setState({
        selectValue: event.target.value,
        locationName:"All Locations"
      });
      Meteor.call('getAllJobs',function(error, results) {
        if (error) {
          console.log(error);
        }
        if (results) {
          this.setState({ jobsList: results });
        }
      }.bind(this));
    }else {
      if(event.target.value != 0)
      for (var i = 0; i < this.state.locations.length; i++) {
        if(this.state.locations[i].id == event.target.value){
          locationName = this.state.locations[i].name;
        }
      }
      this.setState({
        selectValue: event.target.value,
        locationName:locationName
      });
      Meteor.call('getJobsByLocation', event.target.value, function(error, results){
        if (error) {
          console.log(error);
        }
        if (results) {
          this.setState({ jobsList: results });
        }
      }.bind(this));
    }
  }
  SeeJobDescription(event){
    this.setState({ JobDescription: true });
    Session.set('jobsList', this.state.jobsList);
    Session.set('locationId', this.state.selectValue);
    Session.set('locationName', this.state.locationName);
    Session.set('jobId', event.currentTarget.dataset.id);
  }

  render() {
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    var jobs = [];
    for (var i = 0; i < this.state.jobsList.length; i++) {
      let newDate = new Date(this.state.jobsList[i].date);
      jobs.push({
        id: this.state.jobsList[i].id,
        title: this.state.jobsList[i].title,
        locationName: this.state.jobsList[i].locationName,
        description: this.state.jobsList[i].description.slice(0,130).concat("..."),
        month: monthNames[newDate.getMonth()],
        day: newDate.getDate()
      })
    }
    if(this.state.JobDescription === true){
      return( <JobDescription/>)
    }
    if(jobs.length > 0){
      return (
        <section id="section-c" className="grid">
          <div className="box">
            <h1 className="content-title">Our Vacancies</h1>
            <div className="select-container">
              <div className="styled-select">
                <select onChange={this.changeLocation} value={this.state.selectValue}>
                  <option value="0">All Locations</option>
                  {this.state.locations.map(location =>
                    <option key={location.id} value={location.id}>{location.name}</option>
                  )}
                </select>
              </div>
            </div>
            <hr></hr>
            {jobs.map(job =>
              <div key={job.id} className="content-list"  onClick={this.SeeJobDescription} data-id={job.id}>
                <div className="square">
                  <div className="day">{job.day}</div>
                  <div className="month">{job.month}</div>
                </div>
                <div className="content-list-title">
                  <h2>{job.title}</h2>
                </div>
                <div className="content-list-title2">
                  <h2>{this.state.locationName}</h2>
                </div>
                <div className="content-list-body">{job.description}</div>
              </div>
            )}
          </div>
        </section>
      );
    }else {
      return(
        <section id="section-c" className="grid">
          <div className="box">
            <h1 className="content-title">Our Vacancies</h1>
            <div className="select-container">
              <div className="styled-select">
                <select onChange={this.changeLocation} value={this.state.selectValue}>
                  <option value="0">All Locations</option>
                  {this.state.locations.map(location =>
                    <option key={location.id} value={location.id}>{location.name}</option>
                  )}
                </select>
              </div>
            </div>
            <hr></hr>
            <div className="content-list">
              <div className="content-list-title">
                <h2>There are no open positions in {this.state.locationName}</h2>
              </div>
              <div className="content-list-title2">
              </div>
              <div className="content-list-body"> </div>
            </div>
          </div>
        </section>
      );
    }
  }
}
