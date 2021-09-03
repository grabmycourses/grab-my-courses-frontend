import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import styles from './ResetPassword.module.css';
import SuccessPopup from './SuccessPopup';
import * as constants from "../services/constants";
import ErrorAlert from "./ErrorAlert";
import axios from "axios";

const ResetPassword = () => {

    const [email, setEmail] = useState("");
    const [sentOtp, setSentOtp] = useState(false);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showErrorAlert, setShowErrorAlert] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState("");
    const [resetFailed, setResetFailed] = useState("");

    const updateEmail = (e) => {
        setEmail(e.target.value);
        setResetFailed("");
    }

    const updateOtp = (e) => {
        setResetFailed("");
        setOtp(e.target.value);
    }

    const updateNewPassword = (e) => {
        setResetFailed("");
        setNewPassword(e.target.value);
    }

    const updateConfirmPassword = (e) => {
        setResetFailed("");
        setConfirmPassword(e.target.value);
    }

    const resetForm = () => {
        setSentOtp(false);
        setEmail("");
        setResetFailed("");
    }

    const sendForgotPasswordOtp = (e) => {
        e.preventDefault();
        axios.post(constants.requestForgotPasswordUrl, { email: email })
            .then(() => {
                console.log("sent otp for forgot password");
                setSentOtp(true);
                setResetFailed("");
            }).catch(err => {
                console.log("something went wrong in sending otp for forgot password");
                if (err.response) {
                    if ((err.response.status == 400)) {
                        console.log("reset password failed");
                        setResetFailed(err.response.data["message"]);
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

    const resetPassword = (e) => {
        e.preventDefault();

        if (String(newPassword) !== String(confirmPassword)) {
            setResetFailed("Passwords do not match.");
            return;
        }

        axios.post(constants.resetPasswordUrl, { otp: otp, newPassword: newPassword })
            .then((apiResponse) => {
                setShowSuccessPopup(apiResponse.data["message"]);
            }).catch(err => {
                console.log("something went wrong in sending otp for forgot password");
                if (err.response) {
                    if ((err.response.status == 400)) {
                        console.log("reset password failed");
                        setResetFailed(err.response.data["message"]);
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

    const successPopupComponent = <SuccessPopup
        show={showSuccessPopup !== ""}
        onHide={() => setShowSuccessPopup("")}
        message={showSuccessPopup}
        redirectTo="/login"
    />

    if (showErrorAlert) {
        return <ErrorAlert
            show={showErrorAlert !== ""}
            onHide={() => setShowErrorAlert("")}
            message={showErrorAlert}
        />
    }

    const resetFailedMessage = resetFailed !== "" ?
        (<p class={styles.validationError}> <i class="fas fa-exclamation-triangle"></i> {resetFailed} </p>) : null;

    const emailInput = <div className={styles.emailInputDiv}>
        <p className={styles.divHeading}>Please provide your registered email address to reset your password.</p>
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter ASU email id"
                    value={email}
                    onChange={updateEmail} />
                <Form.Text className="text-muted">
                    If above email is registered with us, we will send an OTP on this email address to help you reset your password.
                </Form.Text>
            </Form.Group>
            <Button
                variant="primary"
                type="submit"
                className={styles.divSubmitBtn}
                onClick={sendForgotPasswordOtp}>
                Submit
            </Button>

            {resetFailedMessage}
        </Form>
    </div>

    const resetPasswordInput = <div className={styles.resetPasswordDiv}>
        <p className={styles.divHeading}>Reset your password using the OTP sent on your email - {email}</p>
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>OTP</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={updateOtp} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Create new password"
                    onChange={updateNewPassword} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    onChange={updateConfirmPassword} />
            </Form.Group>
            <Button
                variant="primary"
                type="submit"
                className={styles.divSubmitBtn}
                onClick={resetPassword}>
                Submit
            </Button>

            {resetFailedMessage}

            <Button
                variant="info"
                type="submit"
                style={{ marginTop: '3%' }}
                className={styles.divSubmitBtn}
                onClick={resetForm}>
                Retry forgot password
            </Button>
        </Form>
    </div>

    return <Container>
        {sentOtp ? resetPasswordInput : emailInput}

        {showSuccessPopup !== "" ? successPopupComponent : null}
    </Container>
}

export default ResetPassword;