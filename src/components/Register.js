import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import styles from './Register.module.css';
import { Button, Container } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import AuthService from "../services/auth-service";
import * as constants from "../services/constants";
import ErrorAlert from "./ErrorAlert";
import SuccessPopup from './SuccessPopup';

const Register = () => {

    const history = useHistory();

    const [fullName, setfullName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const [isValidFullName, setIsValidFullName] = useState(true);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(true);
    const [isDuplicateFound, setIsDuplicateFound] = useState("");

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState("");

    const nameRegex = /^[a-z0-9 ,.'-]+$/;
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9\.]+@asu\.edu$/;
    const passwordRegex = /^([0-9A-z@#%^.\s]{4,30})$/;

    const onChangeFullName = (e) => {
        setfullName(e.target.value);
        setIsValidFullName(true);
        setIsDuplicateFound("");
    };

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
        setIsValidEmail(true);
        setIsDuplicateFound("");
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
        setIsValidPassword(true);
        setIsDuplicateFound("");
    };

    const onChangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        setIsValidConfirmPassword(true);
        setIsDuplicateFound("");
    };

    const handleSignup = (e) => {
        e.preventDefault();

        if (!nameRegex.test(String(fullName).toLowerCase())) {
            setIsValidFullName(false);
            return;
        }

        if (!emailRegex.test(String(email).toLowerCase())) {
            setIsValidEmail(false);
            return;
        }

        if (!passwordRegex.test(String(password))) {
            setIsValidPassword(false);
            return;
        }

        if (String(password) !== String(confirmPassword)) {
            setIsValidConfirmPassword(false);
            return;
        }

        AuthService.register(fullName, String(email).toLowerCase(), password).then(
            () => {
                //console.log("registration successful");
                setShowSuccessPopup("Yay! 🥳 You are almost ready to grab those courses. One last step - we have sent a verification email to the address you provided just now. Please complete the verification and you will be all set. Some new students have their ASU emails redirected to their personal email. So, please also check the inbox and spam folder of your personal email. Cheers!🙌")
            }, (err) => {
                //console.log(err);
                if (err.response) {
                    if ((err.response.status == 400)) {
                        //console.log("bad request");
                        setIsDuplicateFound(err.response.data.message);
                    } else {
                        setShowErrorAlert(constants.errorDialogMsg1);
                    }
                } else if (err.request) {
                    setShowErrorAlert(constants.errorDialogMsg2);
                } else {
                    setShowErrorAlert(constants.errorDialogMsg1);
                }
            }
        );
    }

    const fullnameValidation = isValidFullName ?
        null : (<p class={styles.validationError}> <i class="fas fa-exclamation-triangle"></i> Please provide your full name. Special characters are not allowed.</p>);

    const emailValidation = isValidEmail ?
        null : (<p class={styles.validationError}> <i class="fas fa-exclamation-triangle"></i> Please provide your ASU email id.</p>);

    const passwordValidation = isValidPassword ?
        null : (<p class={styles.validationError}> <i class="fas fa-exclamation-triangle"></i> Requires minimum 4 characters. Some special characters are not allowed.</p>);

    const confirmPasswordValidation = isValidConfirmPassword ?
        null : (<p class={styles.validationError}> <i class="fas fa-exclamation-triangle"></i> Passwords don't match.</p>);

    const duplicateError = (isDuplicateFound !== "") ?
        (<p class={styles.validationError}> <i class="fas fa-exclamation-triangle"></i> {isDuplicateFound} </p>) : null;

    if (showErrorAlert) {
        return <ErrorAlert
            show={showErrorAlert !== ""}
            onHide={() => setShowErrorAlert("")}
            message={showErrorAlert}
        />
    }

    const successPopupComponent = <SuccessPopup
        show={showSuccessPopup !== ""}
        onHide={() => setShowSuccessPopup("")}
        message={showSuccessPopup}
        redirectTo="/login"
    />

    return (
        <div className={styles.registerMainDiv}>
            <Container>
                <div className={styles.registerForm}>
                    <Form>
                        <h2>Let's get you onboard</h2>
                        <p class="text-muted"> Please use your ASU email to register. Also, this password is no way related to your myASU account.</p>
                        <input type="text" onChange={onChangeFullName} placeholder="Full Name" />
                        {fullnameValidation}
                        <input type="text" onChange={onChangeEmail} placeholder="ASURITE User ID@asu.edu" />
                        {emailValidation}
                        <input type="password" onChange={onChangePassword} placeholder="Create new password" />
                        {passwordValidation}
                        <input type="password" onChange={onChangeConfirmPassword} placeholder="Confirm Password" />
                        {confirmPasswordValidation}
                        <Button className={styles.myButton} type="submit" onClick={handleSignup}>
                            <i className="fas fa-user-plus"></i> Register
                        </Button>
                        {duplicateError}
                        <p class="existing-user text-muted">
                            Existing user? <a href="/login">Login now!</a>
                        </p>
                    </Form>
                </div>
                {showSuccessPopup !== "" ? successPopupComponent : null}
            </Container>
        </div>
    );
}

export default Register;