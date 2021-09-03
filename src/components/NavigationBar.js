import React from 'react';
import { useHistory } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux';
import { counterActions } from '../store/index';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import AuthService from "../services/auth-service";

const NavigationBar = (props) => {

  const history = useHistory();

  const dispatch = useDispatch();
  const loggedInStatus = useSelector((state) => state.isLoggedIn);
  const actionText = (loggedInStatus ? "Logout" : "Login");
  const currentUser = useSelector((state) => state.userData);

  const loginOrLogoutAction = () => {
    //console.log("logging in or logging out user");
    if (loggedInStatus) { // user was logged in
      AuthService.logout();
      dispatch(counterActions.logout());
      history.replace("/");
    } else { // user was already logged out, so user clicked login now
      history.replace("/login");
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect >
      <Container>
        <Navbar.Brand href="/home">
          <img
            alt=""
            src={props.imgUrl}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          Grab My Courses
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/addcourse">Track a course</Nav.Link>
            <Nav.Link href="/mycourses">Tracked courses</Nav.Link>
            <Nav.Link href="/swap-preferences">Swap preferences</Nav.Link>
            <Nav.Link href="/faqs">FAQs</Nav.Link>
          </Nav>
          <Nav className="justify-content-end" >
            <Nav.Link>{loggedInStatus ? "Welcome " + currentUser.fullname : ""}</Nav.Link>
            <Nav.Link href="/feedback">Feedback</Nav.Link>
            <Nav.Link onClick={loginOrLogoutAction}> {actionText} <i className={loggedInStatus ? "fas fa-sign-out-alt" : "fas fa-sign-in-alt"}></i></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;