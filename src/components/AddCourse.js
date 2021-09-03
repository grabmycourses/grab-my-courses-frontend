import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { useDispatch } from 'react-redux';
import { counterActions } from '../store/index';

import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Select from 'react-select';
import axios from "axios";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import CoursesTable from "./CoursesTable";
import AuthService from "../services/auth-service";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import * as constants from "../services/constants";
import ErrorAlert from "./ErrorAlert";
import SuccessPopup from './SuccessPopup';
import { Row, Col } from "react-bootstrap";
import Alert from 'react-bootstrap/Alert';

const sessions = [
    { value: "N", label: "Any Session" },
    { value: "C", label: "C" },
    { value: "B", label: "B" },
    { value: "A", label: "A" },
    { value: "DYN", label: "Dynamic" }
];

const courseSuffixRegex = "regex";

const AddCourse = () => {

    const currentUser = AuthService.getCurrentUser();
    const history = useHistory();
    const dispatch = useDispatch();

    const [showErrorAlert, setShowErrorAlert] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState("");

    const [subjects, setSubjects] = useState(() => {
        const cachedSubjects = localStorage.getItem('subjects');
        return cachedSubjects !== null ? JSON.parse(cachedSubjects) : [];
    });

    const [selectedSubject, setSelectedSubject] = useState();
    const [selectedCourseCodePrefix, setSelectedCourseCodePrefix] = useState("");
    const [selectedCourseCodeSuffix, setSelectedCourseCodeSuffix] = useState("");
    const [selectedSession, setSelectedSession] = useState();

    const [fetchedSearchResults, SetFetchedSearchResults] = useState(false);
    const [catalogCourses, setCatalogCourses] = useState([]);
    const [selectedClass, setSelectedClass] = useState([]);

    const [showInfoAlert, SetShowInfoAlert] = useState(true);

    useEffect(() => {
        if (subjects.length == 0) {
            // if no subjects data was found in localStorage, get it from API
            axios.get(constants.fetchSubjectsUrl).then((subjects) => {
                //console.log("data is:" + subjects.data);
                if (subjects.data["responseData"].length > 0) {
                    localStorage.setItem('subjects', JSON.stringify(subjects.data["responseData"]));
                    setSubjects(subjects.data["responseData"]);
                } else {
                    setShowErrorAlert(true);
                }
            }).catch(err => {
                console.log("something went wrong in fetching subjects info");
                if (err.response) {
                    setShowErrorAlert(constants.errorDialogMsg1);
                } else if (err.request) {
                    setShowErrorAlert(constants.errorDialogMsg2);
                } else {
                    setShowErrorAlert(constants.errorDialogMsg1);
                }
            });
        }
    }, []);

    const showErrorToast = (position, timeMillis, message) => {
        toast.error(message, {
            position: position,
            autoClose: timeMillis,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    const selectSubject = (event) => {
        //console.log("selected subject is:", event)
        setSelectedSubject(event);
        setSelectedCourseCodePrefix(event.label.substring(0, 3));
    }

    const changeCourseCodeSuffix = (event) => {
        setSelectedCourseCodeSuffix(event.target.value);
    }

    const fetchSearchResults = (event) => {
        event.preventDefault();

        const requestBody = { subjectId: parseInt(selectedSubject.value), courseNumber: selectedCourseCodeSuffix };
        if (selectedSession !== null) {
            requestBody['session'] = selectedSession;
        }

        axios.post(constants.searchSearchResultsUrl, requestBody)
            .then(searchResponse => {
                setCatalogCourses(searchResponse.data["responseData"]);
                SetFetchedSearchResults(true);
                SetShowInfoAlert(false);
                if (searchResponse.data["responseData"].length == 0) {
                    showErrorToast('bottom-center', 20000, searchResponse.data["message"]);
                }
            }).catch(err => {
                console.log("something went wrong in fetching search results");
                if (err.response) {
                    setShowErrorAlert(constants.errorDialogMsg1);
                } else if (err.request) {
                    setShowErrorAlert(constants.errorDialogMsg2);
                } else {
                    setShowErrorAlert(constants.errorDialogMsg1);
                }
            });
    };

    const selectSession = (event) => {
        //console.log("selected session:", event.value);
        if (event.value !== "N") {
            setSelectedSession(event.value);
        }
    }

    const handleOnSelect = (row, isSelect, rowIndex, e) => {
        //console.log("selected row:" + row);
        if (isSelect) {
            setSelectedClass([row["classNumber"]]);
        } else {
            setSelectedClass([]);
        }
    };

    const addTracking = () => {
        if (currentUser) {
            const authHeader = { Authorization: 'Bearer ' + currentUser.token, userId: currentUser.userId };

            axios.post(constants.trackingsUrl, { classNumber: selectedClass[0] },
                { headers: authHeader })
                .then((apiResponse) => {
                    setShowSuccessPopup("All set! 🎉 We are now tracking class number " + selectedClass + " for you. You can focus on your other priorities now and we will try to notify you as soon as a seat opens up in this class. Please make sure that you have your ASU email notifications enabled on your phone. Cheers!")
                }).catch(err => {
                    console.log("something went wrong in adding tracking");
                    if (err.response) {
                        if (err.response.status == 400) { // add tracking validation failed
                            showErrorToast('bottom-center', 15000, err.response.data["message"]);
                        } else if ((err.response.status == 401) || (err.response.status == 403)) { // login required
                            //console.log("authorization failed");
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
        } else {
            history.push("/login");
        }
    }

    const handleSelectRow = {
        mode: "radio",
        clickToSelect: true,
        //bgColor: 'LightPink',
        classes: 'selected-row',
        selected: selectedClass,
        onSelect: handleOnSelect
    };

    const successPopupComponent = <SuccessPopup
        show={showSuccessPopup !== ""}
        onHide={() => setShowSuccessPopup("")}
        message={showSuccessPopup}
        redirectTo="/mycourses"
    />

    if (showErrorAlert) {
        return <ErrorAlert
            show={showErrorAlert !== ""}
            onHide={() => setShowErrorAlert("")}
            message={showErrorAlert}
        />
    }

    const searchResultsMsg = <div className="searchResultsMsgDiv">
        <p>Showing {catalogCourses.length} matching results for Fall 2021 term <i class="fas fa-arrow-circle-down"></i></p>
    </div>

    const showInfoBox = <Alert variant="info" onClose={() => SetShowInfoAlert(false)} dismissible>
        <Alert.Heading><i className="fas fa-info-circle"></i> How it works?</Alert.Heading>
        <p>
            Tell us what classes you are still waiting to find a seat in and we will then start tracking
            open seats in those classes for you. You will be notified about the open seat via your registered email within minutes
            of a new seat freeing up.
        </p>
    </Alert>


    // Following constant div is used for displaying search box fields
    const searchCoursesDiv = <div id="search-container-div">
        <p id="search-box-title">Let's grab those classes for you ...</p>

        {showInfoAlert ? showInfoBox : null}

        <Form noValidate>
            <Form.Label>Subject *</Form.Label>
            <Select
                options={subjects}
                placeholder="Type to search and select"
                maxMenuHeight={160}
                onChange={(e) => selectSubject(e)}
            />

            <Row>
                <Col xs="12" md="12" lg="6" xl="6">
                    <Form.Label style={{ paddingTop: '2%' }}>Course Code *</Form.Label>
                    <InputGroup className="mb-3">
                        <InputGroup.Text> {selectedCourseCodePrefix} </InputGroup.Text>
                        <FormControl
                            placeholder="e.g. 537 OR 53* OR 5**"
                            disabled={selectedSubject == null ? true : false}
                            required
                            onChange={changeCourseCodeSuffix}
                        />
                        <Form.Control.Feedback type="invalid"> Please provide 3 digit course code or pattern </Form.Control.Feedback>
                    </InputGroup>
                </Col>
                <Col xs="12" md="12" lg="6" xl="6">
                    <Form.Label style={{ paddingTop: '2%' }}>Choose session</Form.Label>
                    <Select
                        options={sessions}
                        onChange={(e) => selectSession(e)}
                        maxMenuHeight={100} autoFocus />
                </Col>
            </Row>

            <div id="search-class-button">
                <Button
                    size="lg"
                    style={{ marginTop: '5%' }}
                    disabled={!courseSuffixRegex.test(selectedCourseCodeSuffix)}
                    onClick={(event) => fetchSearchResults(event)}>
                    Search course(s) <i className="fas fa-search-plus"></i>
                </Button>
            </div>
            {catalogCourses.length > 0 ? searchResultsMsg : null}
        </Form>
    </div>;

    // Following is the case when there are valid search results to display
    if (fetchedSearchResults && catalogCourses.length > 0) {
        return <Container>
            <div className="seach-container-outer-div">
                {searchCoursesDiv}
            </div>
            <ToastContainer toastClassName="toast-wrapper-class" style={{ width: "300px", margin: 'auto auto 15% auto', textAlign: 'center' }} />

            <div id="search-results-div">
                <p id="search-result-table-title">Matching classes</p>
                <CoursesTable coursesData={catalogCourses} handleSelectRow={handleSelectRow} />

                <Button
                    variant="success"
                    style={{ marginTop: '2%', marginBottom: '60px' }}
                    size="lg"
                    onClick={addTracking}
                    disabled={selectedClass.length == 0 ? true : false}>
                    <i className="fas fa-plus"></i> Track this course
                </Button> {' '}
            </div>
            {showSuccessPopup !== "" ? successPopupComponent : null}
        </Container>
    }

    // Following is the default case - only display search container
    return <Container>
        <div className="seach-container-outer-div">
            {searchCoursesDiv}
        </div>
        <ToastContainer toastClassName="toast-wrapper-class" style={{ width: "300px", margin: 'auto auto 15% auto', textAlign: 'center' }} />
    </Container>
}

export default AddCourse;