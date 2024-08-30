import React from 'react';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import finvasiaLogo from "../../../assets/images/finvasia-logo.jpg";
import './finvasia_modal.css';

export default function FinvasiaModal({ show, onHide }) {

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">Finvasia Successfully Integrated</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          
          <FontAwesomeIcon 
            icon={faCheckCircle} 
            size="6x" 
            style={{ color: 'green' }} 
          />
        </Modal.Body>
      </Modal>
    </>
  );
}
