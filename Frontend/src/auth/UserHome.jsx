import React from 'react';

const UserHome = ({ user }) => {
  return (
    <div className="container">
      <div className="hero">
        <h1 className="hero-title">Welcome {user.email}</h1>
        <div className="dashboard">
          <h2 className="dashboard-title">Your Dashboard</h2>
          <p className="hero-subtitle">Here's your project information:</p>

          <div className="project-list">
            <div className="project-card">
              <h3>Project 1</h3>
              <p>Description of project 1</p>
              <span className="project-status status-in-progress">In Progress</span>
            </div>

            <div className="project-card">
              <h3>Project 2</h3>
              <p>Description of project 2</p>
              <span className="project-status status-planning">Planning</span>
            </div>
          </div>

          <button className="btn btn-primary">Create New Project</button>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
