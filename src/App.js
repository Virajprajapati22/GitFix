import React, { useEffect } from 'react';
import AppRoutes from './AppRoutes';
import './App.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jsonToObj } from './utils/json-utils';
import { getToken } from './utils/accessToken';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const authBypass = ['/support/contactus', '/support/qa']
  // const storageListener = () => {
  //   try {
  //     const user = jsonToObj(localStorage.getItem("user"))
  //     if(user) {
  //       navigate('/repositories')
  //     }
  //     // if (!authBypass.includes(location.pathname) && !user) {
  //     //   if (location.state?.skipAuth) {

  //     //   } else {
  //     //     navigate('/login')
  //     //   }
  //     // }
  //   } catch (e) {
  //     console.log(e, "ERROR");
  //   }
  // };

  // useEffect(() => {
  //   // check if user did authentication with Github;
  //   window.addEventListener("storage", storageListener)
  //   return () => {
  //     window.removeEventListener("storage", storageListener)
  //   }
  // }, []);

  return (
    <>
      <div className="App">
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
