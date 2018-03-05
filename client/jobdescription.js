import React from 'react';
import { Session } from 'meteor/session'
import './app.css';
import App from './app';

export default class JobDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      JobDescription: true,
      jobsList: Session.get('jobsList')
    };
    this.ReturnToDescription = this.ReturnToDescription.bind(this);
  }

  componentDidMount(){
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    for (var i = 0; i < this.state.jobsList.length; i++) {
      if(this.state.jobsList[i].id == Session.get('jobId')){
        let newDate = new Date(this.state.jobsList[i].date);
        this.setState({
          id: this.state.jobsList[i].id,
          title: this.state.jobsList[i].title,
          locationName: this.state.jobsList[i].locationName,
          description: this.state.jobsList[i].description,
          month: monthNames[newDate.getMonth()],
          day: newDate.getDate()
        });
      }
    }
  }

  ReturnToDescription(event){
    this.setState({ JobDescription: false });
  }

  render() {
    if(!this.state.JobDescription){
      return( <App/>)
    }

    return (
      <section id="section-c" className="grid">
        <div className="box">
          <div className="content-list">
            <div className="square">
              <div className="day">{this.state.day}</div>
              <div className="month">{this.state.month}</div>
            </div>
            <div className="content-list-title">
              <h2>{this.state.title}</h2>
            </div>
            <div className="content-list-title2">
              <h2>{this.state.locationName}</h2>
            </div>
            <div className="content-list-body">{this.state.description}</div>
          </div>
        </div>
        <button type="button" className="btn" onClick={this.ReturnToDescription}>Return</button>
      </section>
    );
  }
}
