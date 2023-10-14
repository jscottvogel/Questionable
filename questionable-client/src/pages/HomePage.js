import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router";

import EventList from "../components/EventList";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const userLogin = useSelector( ( state ) => state.login );
  const { userInfo } = userLogin;
  useEffect( () => {
    if ( userInfo ) {
      navigate( "/" );
    } else {
      navigate( "/login" );
    }
  }, [ dispatch, navigate, userInfo ] );


  return (
    <>
      <EventList />
    </>
  );
};

export default HomePage;
