import React from 'react';
import GuestHome from './GuestHome';
 
import IndexPage from "../pages/index";

const Home = ({ user }) => {
  console.log('User:', user); // See what this logs

  return user ? <IndexPage user={user} /> : <GuestHome />;
};



export default Home;
