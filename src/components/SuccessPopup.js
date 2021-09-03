import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const SuccessPopup = (props) => {
    return <Modal
        show={props.show} onHide={props.onHide}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        contentClassName="success-modal-content"
    >
        <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter" style={{ color: "#00802b" }}>
                Success! <i class="fas fa-check-circle"></i>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p style={{ color: "#00802b", lineHeight: "30px" }}>
                {props.message}
            </p>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={props.onHide} variant="success" href={props.redirectTo}>Okay</Button>
        </Modal.Footer>
    </Modal>
};

export default SuccessPopup;