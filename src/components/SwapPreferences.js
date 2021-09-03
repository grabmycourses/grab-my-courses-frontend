import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { counterActions } from '../store/index';

import styles from './SwapPreferences.module.css';
import { Button, Container } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import AuthService from "../services/auth-service";
import axios from "axios";
import * as constants from "../services/constants";
import { ToastContainer, toast } from "react-toastify";
import ErrorAlert from "./ErrorAlert";
import BootstrapTable from 'react-bootstrap-table-next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import ListGroup from 'react-bootstrap/ListGroup';
import SuccessPopup from './SuccessPopup';
import Alert from 'react-bootstrap/Alert';

const SwapPreferences = () => {

    const currentUser = AuthService.getCurrentUser();
    const classNumberRegex = "regex";

    const history = useHistory();
    const dispatch = useDispatch();

    const [dropOptionToAdd, setDropOptionToAdd] = useState("");
    const [sharingEnabled, setSharingEnabled] = useState(false);
    const [sharingEnabledOriginal, setSharingEnabledOriginal] = useState(false);
    const [userSwapPreferences, setUserSwapPreferences] = useState([]);

    const [dropOtionsToRemove, setDropOptionsToRemove] = useState([]);
    const [selectedDropOptionsToRemove, setSelectedDropOptionsToRemove] = useState([]);

    const animatedComponents = makeAnimated();

    const [showErrorAlert, setShowErrorAlert] = useState("");
    const [showSettingUpdateSuccess, setShowSettingUpdateSuccess] = useState("");
    const [showAddOptionSuccess, setShowAddOptionSuccess] = useState("");
    const [showRemoveOptionSuccess, setShowRemoveOptionSuccess] = useState("");

    const [showEmailPrefInfoBox, setShowEmailPrefInfoBox] = useState(true);
    const [showSwapOptionsInfoBox, setShowSwapOptionsInfoBox] = useState(true);

    useEffect(() => {
        if (currentUser) {
            const authHeader = { Authorization: 'Bearer ' + currentUser.token, userId: currentUser.userId };
            axios.get(constants.dropOptionsUrl, { headers: authHeader })
                .then(apiResponse => {
                    //console.log("response is:" + JSON.stringify(apiResponse.data["responseData"].swapOptions));
                    setSharingEnabled(apiResponse.data["responseData"].sharingEnabled);
                    setSharingEnabledOriginal(apiResponse.data["responseData"].sharingEnabled);
                    setUserSwapPreferences(apiResponse.data["responseData"].swapOptions);
                    setDropOptionsToRemove(apiResponse.data["responseData"].dropOptions);
                }).catch(err => {
                    console.log("something went wrong in fetching user swap preferences");
                    if (err.response) {
                        if (err.response.status == 400) { // validation failed
                            showErrorToast('bottom-center', 15000, err.response.data["message"]);
                        } else if ((err.response.status == 401) || (err.response.status == 403)) {
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
    }, []);

    const mainColumns = [{
        dataField: 'trackedClassNumber',
        text: 'Tracked class number',
        headerStyle: (colum, colIndex) => {
            return { width: '30%' };
        }
    }, {
        dataField: 'dropDetails',
        text: 'Swapping options',
        formatter: (cell, row, rowIndex, extraData) => (
            <div>
                <span>You have {extraData[rowIndex].dropDetails.length} swap options available</span>
                <br />
                <span>Click here to see details <i className="fas fa-chevron-down"></i></span>
            </div>
        ),
        formatExtraData: userSwapPreferences
    }];

    const nestedColumns = [
        {
            dataField: 'dropperDropOptions',
            text: 'swap option detail',
            formatter: (cell, row, rowIndex) => (
                <div>
                    <p>User {row.dropperEmail} can give you this class
                        {row.dropperDropOptions === "" ?
                            (<span> and do not want anything in return. They just want to drop this class.</span>) :
                            (<span> but they want {row.dropperDropOptions} in return.</span>)
                        }</p>
                </div>
            )
        }];

    const expandRowNew = {
        onlyOneExpanding: true,
        renderer: (row, rowIndex) => (
            <div>
                <p><b>Here are your options for class {row.trackedClassNumber}:</b></p>
                <div className={styles.swapOptionsNestedDiv}>
                    <ListGroup variant="flush" className={styles.swapOptionsCard}>
                        {row.dropDetails.map(option =>
                            <ListGroup.Item><div>
                                <p>User <strong>{option.dropperEmail}</strong> can give you this class
                                    {option.dropperDropOptions === "" ?
                                        (<span> and do not want anything in return. They just want to drop this class.</span>) :
                                        (<span> but they want {option.dropperDropOptions} in return.</span>)
                                    }</p>
                            </div></ListGroup.Item>)}
                    </ListGroup>
                </div>

                <p>Thank you for patiently waiting to finally have this swap option open up for you.
                    <b> We urge you to be polite and professional while connecting to your fellow classmates.</b> <br />
                    Go, get that class now and nail the learning.<br />
                    <i class="fas fa-hand-peace"></i> Best wishes! Fork 'em Devils <i class="fas fa-hand-peace"></i></p>
            </div>
        )
    };

    const handleAddDropOptionChange = (e) => {
        setDropOptionToAdd(e.target.value);
    }

    const handleAddDropOption = (e) => {
        e.preventDefault();
        //console.log("class number being added:" + dropOptionToAdd);

        const authHeader = { Authorization: 'Bearer ' + currentUser.token, userId: currentUser.userId };
        axios.post(constants.dropOptionsUrl, { dropOption: dropOptionToAdd }, { headers: authHeader })
            .then((addDropOptionResponse) => {
                //console.log("added user drop option successfully");
                setUserSwapPreferences(addDropOptionResponse.data["responseData"].swapOptions);
                setDropOptionsToRemove(addDropOptionResponse.data["responseData"].dropOptions);
                setShowAddOptionSuccess("Looks perfect! We have now added class " + dropOptionToAdd + " to your \"Willing to drop\" list. You might soon see some swap option avaialable here if someone else is looking for this class and they have any of the classes that you are looking for. Cheers!")
                setDropOptionToAdd("");
            }).catch(err => {
                console.log("something went wrong in adding swap preferences");
                if (err.response) {
                    if (err.response.status == 400) { // validation failed
                        showErrorToast('bottom-center', 15000, err.response.data["message"]);
                    } else if ((err.response.status == 401) || (err.response.status == 403)) {
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

    const saveEmailSharingSetting = (e) => {
        e.preventDefault();
        //console.log("updating user perference:");

        const authHeader = { Authorization: 'Bearer ' + currentUser.token, userId: currentUser.userId };
        axios.post(constants.updateSharingPrferenceUrl, { sharingEnabled: sharingEnabled }, { headers: authHeader })
            .then((apiResponse) => {
                //console.log("updated user sharing preference successfully");
                if (!sharingEnabled) {
                    setUserSwapPreferences([]);
                    setDropOptionsToRemove([]);
                    setSharingEnabledOriginal(false);
                    setShowSettingUpdateSuccess("Alright! We understand your concern for privacy. We would stop showing your email id to others. If there is anything which we could do to provide you a better experience, please drop us a feeback. Cheers!");
                } else {
                    setUserSwapPreferences(apiResponse.data["responseData"].swapOptions);
                    setDropOptionsToRemove(apiResponse.data["responseData"].dropOptions);
                    setSharingEnabledOriginal(true);
                    setShowSettingUpdateSuccess("Great! Thank you for considering to share your \"Willing to drop\" classes with others. We assure you that your privacy will remain our primary concern. Cheers!");
                }
            }).catch(err => {
                console.log("something went wrong in updating user sharing preference");
                if (err.response) {
                    if (err.response.status == 400) { // validation failed
                        showErrorToast('bottom-center', 15000, err.response.data["message"]);
                    } else if ((err.response.status == 401) || (err.response.status == 403)) {
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

    const handleRemoveDropOptionsChange = (selectedOptions) => {
        setSelectedDropOptionsToRemove(selectedOptions);
    }

    const handleRemoveDropOptionSubmit = (e) => {
        e.preventDefault();
        const classesToRemove = selectedDropOptionsToRemove.map(option => option.value);
        //console.log("class numbers being removed from drop options:" + classesToRemove);
        setSelectedDropOptionsToRemove([]);

        const authHeader = { Authorization: 'Bearer ' + currentUser.token, userId: currentUser.userId };
        axios.delete(constants.dropOptionsUrl, { data: { dropOptions: classesToRemove }, headers: authHeader })
            .then((apiResponse) => {
                //console.log("removed user drop option successfully");
                setUserSwapPreferences(apiResponse.data["responseData"].swapOptions);
                setDropOptionsToRemove(apiResponse.data["responseData"].dropOptions);
                setShowRemoveOptionSuccess("Woah! We have now removed the selected classes from your \"Willing to drop\" list. We hope you were able to find some great swapping options for this class. Cheers!");
            }).catch(err => {
                console.log("something went wrong in removing drop options");
                if (err.response) {
                    if (err.response.status == 400) { // validation failed
                        showErrorToast('bottom-center', 15000, err.response.data["message"]);
                    } else if ((err.response.status == 401) || (err.response.status == 403)) {
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

    if (!currentUser) {
        history.push("/login");
    }

    if (showErrorAlert) {
        return <ErrorAlert
            show={showErrorAlert !== ""}
            onHide={() => setShowErrorAlert("")}
            message={showErrorAlert}
        />
    }

    const settingUpdateSuccessComponent = <SuccessPopup
        show={showSettingUpdateSuccess !== ""}
        onHide={() => setShowSettingUpdateSuccess("")}
        message={showSettingUpdateSuccess}
        redirectTo="javascript:void(0);"
    />

    const addOptionSuccessComponent = <SuccessPopup
        show={showAddOptionSuccess !== ""}
        onHide={() => setShowAddOptionSuccess("")}
        message={showAddOptionSuccess}
        redirectTo="javascript:void(0);"
    />

    const removeOptionSuccessComponent = <SuccessPopup
        show={showRemoveOptionSuccess !== ""}
        onHide={() => setShowRemoveOptionSuccess("")}
        message={showRemoveOptionSuccess}
        redirectTo="javascript:void(0);"
    />

    const emailPrefInfoBox = <Alert variant="info" onClose={() => setShowEmailPrefInfoBox(false)} dismissible>
        <Alert.Heading>
            <p className={styles.emailSharingPrefDivText1}><i className="fas fa-info-circle"></i> How it works?</p>
        </Alert.Heading>
        <p className={styles.emailSharingPrefDivText2}>&emsp; &emsp;This setting governs whether your profile email id
            will be shared with other students or not.<b> We show your email id as a swap option to other matching
                students ONLY IF you add some class as "Willing to drop". </b>This implies that if you don't have any
            "Willing to drop" classes added in your profile, this setting remains useless. If you choose not to share
            your email id with others, then you will also not be able to see any swap alternatives for the courses
            you are tracking. <br /> Please refer FAQs and privacy policy for more details.</p>
    </Alert>

    const swapOptionsInfoBox = <Alert variant="info" onClose={() => setShowSwapOptionsInfoBox(false)} dismissible>
        <Alert.Heading>
            <p className={styles.emailSharingPrefDivText1}><i className="fas fa-info-circle"></i> How it works?</p>
        </Alert.Heading>
        <p className={styles.emailSharingPrefDivText2}>
            <b>Short Story:</b> Here, we show you if you can exchange/swap your course with some other fellow student.<br /><br />
            <b>Long story:</b> Say, you have already registered for classes 'A', 'B' and 'C'.
            But you are actually very interested in class 'D' and you are 'willing to drop' any(or some) of the currently registered
            classes if someone can give you class 'D' in return. <br />
            Once you have already started tracking class 'D' on our "Tracked Courses" page, then all you need to do on this page is
            to tell us which classes are you "Willing to drop" if someone can give you class 'D' in return. <br />
            If any other student on
            our platform shows willingness to drop class 'D' (by adding class 'D' to their "Willing to drop" list), we will show you
            the email id of that student and then you can get in touch and do the rest.<br />
            We also show you the options wherein other student just wants to drop the class that you are looking for and doesn't want anything in return.</p>
    </Alert>

    return <div>
        <Container>

            <div className={styles.swapPrefMainDiv}>
                <div className={styles.swapPrefMainDivContent}>
                    <p className={styles.swapPrefMainDivHeader}>Available Swap/exchange options</p>

                    {showSwapOptionsInfoBox ? swapOptionsInfoBox : null}

                    {userSwapPreferences.length == 0 ?
                        (sharingEnabledOriginal === false ?
                            <p>Please enable sharing your email id if you wish to see swap options available for you</p> :
                            <p style={{ textAlign: 'left' }}><b>We don't have any swap options available for your tracked classes yet!</b> <br />
                                But let's be patient. We might be able to grab some great swap options for you as more and more
                                students update their "Willing to drop" classes to our platform. <br />
                                Meanwhile, the best thing you could do is to spread the word about this site among your classmates
                                so that you (and also everyone else indirectly) can get the classes they are looking for.</p>) :
                        (<BootstrapTable
                            keyField='trackedClassNumber'
                            data={userSwapPreferences}
                            columns={mainColumns}
                            expandRow={expandRowNew}
                            bordered={true}
                            classes="swap-pref-table"
                            hover striped bootstrap4 />)}

                </div>
            </div>

            <div className={styles.showDropOptionsDiv}>
                <div className={styles.showDropOptionsDivContent}>
                    <p className={styles.showDropOptionsDivHeader}>Your current "Willing to drop" list</p>

                    {dropOtionsToRemove.length === 0 ?
                        (sharingEnabledOriginal === false ?
                            <p>Please enable sharing your email id if you wish to see your "Willing to drop" classes list.</p> :
                            <p style={{ textAlign: 'left' }}>You don't seem to be willing to drop any classes yet. If you are willing to drop any of the classes
                                which you already have, in return for someone giving you the classes you are tracking/looking for, please
                                add those classes to your "Willing to drop" list below. <br />It helps us to fetch better available swap
                                options for you.</p>) :
                        (<div style={{ maxWidth: '300px', margin: '0 auto' }}>

                            <ListGroup variant="flush" style={{ borderRadius: '20px', fontWeight: 'bold' }}>
                                {dropOtionsToRemove.map(option => <ListGroup.Item>{option.label}</ListGroup.Item>)}
                            </ListGroup>

                        </div>)
                    }

                </div>
            </div>

            <div className={styles.addDropOptionDiv}>
                <div className={styles.addDropOptionDivContent}>
                    <p className={styles.addDropOptionDivHeader}>Add a class to "Willing to drop" list</p>

                    {sharingEnabledOriginal === false ?
                        (<p>Please enable sharing your email id if you wish to add classes to your "Willing to drop" list.</p>) :
                        (<Form>
                            <p className="text-muted" style={{ textAlign: 'justify' }}> Please provide the 5 digit class number that you are willing to drop in return for
                                someone giving you the class you are tracking/looking for. For example: Enter 77562 if you are willing to drop CSE 512; you can find this 5 digit class number in your myASU class search. Even if you don't want any class in return/exchange, you can still share what you are thinking of dropping, so that others can take it directly from you.</p>
                            <input
                                type="text"
                                placeholder="Enter 5 digit class Number"
                                onChange={handleAddDropOptionChange}
                                value={dropOptionToAdd}
                            />
                            <Button
                                className={styles.myButton}
                                type="submit"
                                onClick={handleAddDropOption}
                                disabled={!classNumberRegex.test(dropOptionToAdd)}>
                                <i class="fas fa-cart-plus"></i> I am willing to drop this class
                            </Button>
                            <ToastContainer toastClassName="toast-wrapper-class" style={{ width: "300px", margin: 'auto auto 15% auto', textAlign: 'center' }} />
                        </Form>)
                    }
                </div>
            </div>

            <div className={styles.removeDropOptionsDiv}>
                <div className={styles.removeDropOptionsDivContent}>
                    <p className={styles.removeDropOptionsDivHeader}>Remove classes from "Willing to drop" List</p>

                    {dropOtionsToRemove.length === 0 ?
                        (sharingEnabledOriginal === false ?
                            <p>Please enable sharing your email id if you wish to remove classes from your "Willing to drop" list.</p> :
                            <p>Your don't seem to have added any classes to your "Willing to drop" list yet.</p>) :
                        (<Form>
                            <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti
                                maxMenuHeight={120}
                                options={dropOtionsToRemove}
                                value={selectedDropOptionsToRemove}
                                onChange={handleRemoveDropOptionsChange}
                            />
                            <Button
                                className={styles.removeDropOptionsButton}
                                type="submit"
                                onClick={handleRemoveDropOptionSubmit}
                                disabled={selectedDropOptionsToRemove.length == 0}>
                                <i class="fas fa-trash-alt"></i> I am no longer willing to drop these classes
                            </Button>
                        </Form>)}
                </div>
            </div>

            <div className={styles.emailSharingPrefDiv}>
                <div className={styles.emailSharingPrefDivContent}>
                    <Form>
                        <div className={styles.emailSharingPrefDivHeading}>
                            <p>Email id Visibility preference</p>
                        </div>
                        {showEmailPrefInfoBox ? emailPrefInfoBox : null}

                        <div key="radios" className="mb-3">
                            <p className={styles.emailSharingPrefDivText3}>Please choose if you allow us to share your email id with other matching students or not?</p>
                            <Form.Check type="radio">
                                <Form.Check.Input
                                    type="radio"
                                    id="radioOne"
                                    isValid={sharingEnabled === true}
                                    checked={sharingEnabled === true}
                                    onChange={() => setSharingEnabled(true)} />
                                <Form.Check.Label>Let my email id be visible to other matching students. (Default and Recommended)</Form.Check.Label>
                                <Form.Control.Feedback type="valid">Perfect! You are all set to get the best out of this deal.</Form.Control.Feedback>
                            </Form.Check>

                            <Form.Check type="radio2">
                                <Form.Check.Input
                                    type="radio"
                                    id="radioTwp"
                                    isValid={sharingEnabled === false}
                                    checked={sharingEnabled === false}
                                    onChange={() => setSharingEnabled(false)} />
                                <Form.Check.Label>Nah! I don't share my email id with anyone.</Form.Check.Label>
                                <Form.Control.Feedback type="valid">This will also prevent you from seeing any swap alternatives you may have.</Form.Control.Feedback>
                            </Form.Check>

                            <Button
                                variant="success"
                                onClick={saveEmailSharingSetting}
                                disabled={sharingEnabledOriginal == sharingEnabled}>
                                Apply setting <i class="fas fa-user-cog"></i>
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>

            {showSettingUpdateSuccess !== "" ? settingUpdateSuccessComponent : null}
            {showAddOptionSuccess !== "" ? addOptionSuccessComponent : null}
            {showRemoveOptionSuccess !== "" ? removeOptionSuccessComponent : null}
        </Container>
    </div>
}

export default SwapPreferences;