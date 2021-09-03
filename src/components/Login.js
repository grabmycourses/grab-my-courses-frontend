import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { useDispatch } from 'react-redux';
import { counterActions } from '../store/index';

import styles from './Login.module.css';
import { Button, Container } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import AuthService from "../services/auth-service";
import ErrorAlert from "./ErrorAlert";
import * as constants from "../services/constants";

const Login = () => {

    const history = useHistory();

    const dispatch = useDispatch();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isValidUsername, SetIsValidUsername] = useState(true);
    const [isValidPassword, SetIsValidPassword] = useState(true);
    const [authFailed, setAuthFailed] = useState("");
    const [showErrorAlert, setShowErrorAlert] = useState("");

    const emailRegex = "regex";

    const onChangeUsername = (e) => {
        SetIsValidUsername(true);
        setAuthFailed("");
        setUsername(e.target.value);
    };

    const onChangePassword = (e) => {
        SetIsValidPassword(true);
        setAuthFailed("");
        setPassword(e.target.value);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        if (!emailRegex.test(String(username).toLowerCase())) {
            SetIsValidUsername(false);
            return;
        }

        if (!(password.length >= 4)) {
            SetIsValidPassword(false);
            return;
        }

        AuthService.login(String(username).toLowerCase(), password).then(
            responseData => {
                console.log("login successful");
                dispatch(counterActions.login(AuthService.getCurrentUser()));
                history.replace("/mycourses");
            }).catch(err => {
                //console.log(err);
                if (err.response) {
                    if ((err.response.status == 401) || (err.response.status == 403)) {
                        console.log("authorization failed");
                        setAuthFailed(err.response.data["message"]);
                    } else {
                        setShowErrorAlert(constants.errorDialogMsg1);
                    }
                } else if (err.request) {
                    setShowErrorAlert(constants.errorDialogMsg2);
                } else {
                    setShowErrorAlert(constants.errorDialogMsg1);
                }
            });
    }

    const usernameValidation = isValidUsername ?
        null : (<p class={styles.validationError}> <i class="fas fa-exclamation-triangle"></i> Please provide valid email id. </p>);

    const passwordValidation = isValidPassword ?
        null : (<p class={styles.validationError}> <i class="fas fa-exclamation-triangle"></i> Requires minimum 4 characters. Some special characters are not allowed. </p>);

    const authorizationFailed = authFailed !== "" ?
        (<p class={styles.validationError}> <i class="fas fa-exclamation-triangle"></i> {authFailed} </p>) : null;

    if (showErrorAlert) {
        return <ErrorAlert
            show={showErrorAlert !== ""}
            onHide={() => setShowErrorAlert("")}
            message={showErrorAlert}
        />
    }

    return (
        <div className={styles.loginMainDiv} >
            <Container>
                <Form className={styles.loginForm}>
                    <h1>Welcome back!</h1>
                    <p className="text-muted"> Please login using your ASU email id</p>
                    <input type="text" onChange={onChangeUsername} placeholder="ASURITE User ID@asu.edu" />
                    {usernameValidation}
                    <input type="password" onChange={onChangePassword} placeholder="Password" />
                    {passwordValidation}
                    <Button className={styles.myButton} type="submit" onClick={handleLogin}>
                        Login <i className="fas fa-sign-in-alt"></i>
                    </Button>
                    {authorizationFailed}
                    <p className="new-user text-muted">
                        New User? <a href="/register">Signup/Register</a>
                    </p>
                    <p className="forgot-password text-muted">
                        Forgot password? <a href="/reset-password">Reset</a>
                    </p>
                </Form>
            </Container>
        </div>
    );
}

export default Login;