import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import styles from './Feedback.module.css';
import SuccessPopup from './SuccessPopup';
import * as constants from "../services/constants";
import ErrorAlert from "./ErrorAlert";
import axios from "axios";

const emailRegex = "regex";
const commentRegex = "regex";

const Feedback = () => {

    const [type, setType] = useState("others");
    const [email, setEmail] = useState("");
    const [comment, setComment] = useState("");
    const [showErrorAlert, setShowErrorAlert] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState("");

    const selectType = (e) => {
        //console.log("selected value:",e.value);
        setType(e.value);
    };

    const updateEmail = (e) => {
        setEmail(e.target.value);
    }

    const updateComment = (e) => {
        setComment(e.target.value);
    }

    const submitFeedback = (e) => {
        e.preventDefault();

        axios.post(constants.sendFeedbackUrl, { type: type, email: email, comment: comment })
            .then((apiResponse) => {
                setShowSuccessPopup("Your feedback has been submitted successfully. We will reach out to you using the email you provided, if required. Cheers!")
            }).catch(err => {
                console.log("something went wrong in adding tracking");
                if (err.response) {
                    setShowErrorAlert(constants.errorDialogMsg1);
                } else if (err.request) {
                    setShowErrorAlert(constants.errorDialogMsg2);
                } else {
                    setShowErrorAlert(constants.errorDialogMsg1);
                }
            });
    }

    const isValidFeedback = (e) => {
        if (type !== "" && emailRegex.test(String(email).toLowerCase) && commentRegex.test(comment)) {
            console.log("valid feedback");
            return true;
        } else {
            console.log("invalid feedback");
        }
        return false;
    }

    const successPopupComponent = <SuccessPopup
        show={showSuccessPopup !== ""}
        onHide={() => setShowSuccessPopup("")}
        message={showSuccessPopup}
        redirectTo="/home"
    />

    if (showErrorAlert) {
        return <ErrorAlert
            show={showErrorAlert !== ""}
            onHide={() => setShowErrorAlert("")}
            message={showErrorAlert}
        />
    }

    const feedbackTypes = [
        { value: 'reportIssue', label: 'Report an issue' },
        { value: 'others', label: 'Others' }
    ];

    return <Container>
        <p className={styles.feedbackHeading}>Your feedback is valuable!</p>
        <p className={styles.feedbackConcludingText}>
            You can also connect to us directly via email on "feedback@grabmycourses.com".
        </p>
        <hr />
        <div className={styles.feedbackOuterDiv}>
            <div className={styles.feedbackFormDiv}>
                <Form>

                    <Form.Label>Feedback type</Form.Label>
                    <Select
                        options={feedbackTypes}
                        onChange={(e) => selectType(e)}
                    />

                    <Form.Group className={styles.feedbackEmail}>
                        <Form.Label>Communication email address *</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={updateEmail} />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className={styles.feedbackComment}>
                        <Form.Label>Your feedback *</Form.Label>
                        <Form.Control as="textarea" rows={4} onChange={updateComment} />
                        <Form.Text className="text-muted">
                            Some special characters are not allowed in feedback comment.
                        </Form.Text>
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className={styles.feedbackSubmitBtn}
                        onClick={submitFeedback}
                        disabled={!emailRegex.test(String(email).toLowerCase()) || !commentRegex.test(comment)}>
                        Submit Feedback <i className="fas fa-paper-plane"></i>
                    </Button>

                </Form>
            </div>
        </div>

        {showSuccessPopup !== "" ? successPopupComponent : null}
    </Container>
}

export default Feedback;