import React, { useEffect, useState } from "react";
import { Container } from 'react-bootstrap';
import * as constants from "../services/constants";
import axios from "axios";
import ErrorAlert from "./ErrorAlert";

const Faq = () => {

    const [faqs, setfaqs] = useState([]);
    const [showErrorAlert, setShowErrorAlert] = useState("");

    useEffect(() => {
        axios.get(constants.getFaqsUrl)
            .then(apiResponse => {
                setfaqs(apiResponse.data["responseData"]);
            }).catch(err => {
                console.log("something went wrong in fetching faqs");
                if (err.response) {
                    setShowErrorAlert(constants.errorDialogMsg1);
                } else if (err.request) {
                    setShowErrorAlert(constants.errorDialogMsg2);
                } else {
                    setShowErrorAlert(constants.errorDialogMsg1);
                }
            });
    }, []);

    const toggleFAQ = index => {
        setfaqs(faqs.map((faq, i) => {
            if (i === index) {
                faq.open = !faq.open
            } else {
                faq.open = false;
            }

            return faq;
        }))
    }

    if (showErrorAlert) {
        return <ErrorAlert
            show={showErrorAlert !== ""}
            onHide={() => setShowErrorAlert("")}
            message={showErrorAlert}
        />
    }

    return <Container>
        <div className="faqOuterDiv">
            <p className="faqs-heading">Frequently Asked Questions</p>
            <p className="faqs-subheading">If your question is still not answered, please drop us a note using feedback section.</p>
            <hr />
            <div className="faqs">
                {faqs.map((faq, index) => (
                    <div
                        className={"faq " + (faq.open ? 'open' : '')}
                        key={index}
                        onClick={() => toggleFAQ(index)}
                    >
                        <div className="faq-question">
                            {faq.question}
                        </div>
                        <div className="faq-answer">
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </Container>
}

export default Faq;