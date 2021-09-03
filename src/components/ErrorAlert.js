import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ErrorAlert = (props) => {
    return <Modal
        show={props.show} onHide={props.onHide}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        contentClassName="error-modal-content"
    >
        <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter" style={{ color: "#CC0000" }}>
                <i class="fas fa-exclamation-triangle"></i> Oh snap! You seem to have hit a block!
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p style={{ color: "#CC0000", lineHeight: "30px" }}>
                {props.message}
            </p>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={props.onHide} variant="danger" href="/home">Okay</Button>
        </Modal.Footer>
    </Modal>
};

export default ErrorAlert;