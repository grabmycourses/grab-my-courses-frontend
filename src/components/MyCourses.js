import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { useDispatch } from 'react-redux';
import { counterActions } from '../store/index';

import Container from 'react-bootstrap/Container';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import ErrorAlert from "./ErrorAlert";
import CoursesTable from "./CoursesTable";
import AuthService from "../services/auth-service";
import * as constants from "../services/constants";
import SuccessPopup from './SuccessPopup';

const MyCourses = () => {

    const currentUser = AuthService.getCurrentUser();
    const history = useHistory();
    const dispatch = useDispatch();

    const [userCourses, setUserCourses] = useState([]);
    const [selectedClassNumbers, setSelectedClassNumbers] = useState([]);
    const [showErrorAlert, setShowErrorAlert] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState("");

    useEffect(() => {
        if (currentUser) {
            fetchUserTrackings(currentUser.userId);
        }
    }, []);

    const fetchUserTrackings = (loggedInUserId) => {
        const authHeader = { Authorization: 'Bearer ' + currentUser.token, userId: loggedInUserId };
        axios.get(constants.trackingsUrl, { headers: authHeader })
            .then(coursesResponse => {
                setUserCourses(coursesResponse.data["responseData"]);
            }).catch(err => {
                console.log("something went wrong in fetching trackings");
                if (err.response) {
                    if ((err.response.status == 401) || (err.response.status == 403)) {
                        console.log("authorization failed");
                        AuthService.logout();
                        dispatch(counterActions.logout());
                        history.replace("/login");
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

    const handleOnSelect = (row, isSelect, rowIndex, e) => {
        if (isSelect) {
            setSelectedClassNumbers(selectedClassNumbers => [...selectedClassNumbers, row["classNumber"]]);
        } else {
            setSelectedClassNumbers(selectedClassNumbers => selectedClassNumbers.filter(x => x !== row["classNumber"]));
        }
    };

    const handleOnSelectAll = (isSelect, rows, e) => {
        const ids = rows.map(row => row["classNumber"]);
        if (isSelect) {
            setSelectedClassNumbers(ids);
        } else {
            setSelectedClassNumbers([]);
        }
    };

    const removeTracking = () => {
        const authHeader = { Authorization: 'Bearer ' + currentUser.token, userId: currentUser.userId };
        axios.delete(constants.trackingsUrl, { params: { classNumber: selectedClassNumbers.join() }, headers: authHeader })
            .then((coursesResponse) => {
                setSelectedClassNumbers([]);
                fetchUserTrackings(currentUser.userId);
                setShowSuccessPopup("Alright! 😊 We got you. We are no more tracking the selected course(s) for you. You can add tracking for them again, if required. \nCheers!")
            }).catch(err => {
                console.log("something went wrong in removing trackings");
                if (err.response) {
                    if ((err.response.status == 401) || (err.response.status == 403)) {
                        console.log("authorization failed");
                        AuthService.logout();
                        dispatch(counterActions.logout());
                        history.replace("/login");
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

    const handleSelectRow = {
        mode: "checkbox",
        clickToSelect: true,
        bgColor: 'LightPink',
        selected: selectedClassNumbers,
        onSelect: handleOnSelect,
        onSelectAll: handleOnSelectAll
    };

    if (!currentUser) {
        history.push("/login");
    }

    const successPopupComponent = <SuccessPopup
        show={showSuccessPopup !== ""}
        onHide={() => setShowSuccessPopup("")}
        message={showSuccessPopup}
        redirectTo="javascript:void(0);"
    />

    if (showErrorAlert) {
        return <ErrorAlert
            show={showErrorAlert !== ""}
            onHide={() => setShowErrorAlert("")}
            message={showErrorAlert}
        />
    }

    if (userCourses.length > 0) {
        return <Container className="container table-page-container">
            <p className="table-title">Your tracked classes</p>
            <CoursesTable coursesData={userCourses} handleSelectRow={handleSelectRow} />

            <div className="stop-tracking-button">
                <Button
                    variant="danger"
                    size="lg"
                    onClick={removeTracking}
                    disabled={selectedClassNumbers.length == 0 ? true : false}>
                    <i className="far fa-hand-paper"></i> Stop tracking
                </Button> {' '}
                <Button
                    variant="success"
                    size="lg"
                    href="/addcourse"
                    style={{ margin: '2%' }}
                    disabled={(userCourses.length >= 5 || selectedClassNumbers > 0) ? true : false}>
                    <i className="fas fa-eye"></i> Track another class
                </Button> {' '}
                <Button
                    variant="info"
                    size="lg"
                    href="/swap-preferences"
                    className="see-swap-options-button">
                    <i class="fas fa-exchange-alt"></i> See Swap Options available
                </Button> {' '}
            </div>
            {showSuccessPopup !== "" ? successPopupComponent : null}
        </Container>

    } else {
        return <Container className="container table-page-container">
            <p className="no-tracking-found">Oh! You don't seem to be tracking any courses yet!</p>
            <div className="start-tracking-button">
                <Button variant="success" size="lg" href="/addcourse"> Start tracking now <i className="far fa-paper-plane"></i></Button> {' '}
            </div>
            {showSuccessPopup !== "" ? successPopupComponent : null}
        </Container>
    }
}

export default MyCourses;