import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiBaseUrl from "../../../constants/globaldata";
import loader from "../../../assets/images/loader.gif";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import kotakLogo from "../../../assets/images/kotak-logo.png";
import './kotak_otp.css';

export default function KotakOtpModal({ show,setIsKotakIntegrated, onHide }) {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [otpButtonDisable, setOtpButtonDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOtpChange = (element, index) => {
    if (/^[0-9]$/.test(element.value)) {
      const newOtp = [...otp];
      newOtp[index] = element.value;
      setOtp(newOtp);

      if (element.nextSibling && element.value) {
        element.nextSibling.focus();
      }
    } else if (element.value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (element.previousSibling) {
        element.previousSibling.focus();
      }
    }
    if (index === 3) {
      setOtpButtonDisable(false);
    } else {
      setOtpButtonDisable(true);
    }
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const otpValue = otp.join("");

    const otpData = {
      access_token: localStorage.getItem('access_token'),
      sid: localStorage.getItem('sid'),
      user_id: localStorage.getItem('user_id'),
      view_token: localStorage.getItem('view_token'),
      otp: otpValue
    };

    axios
      .post(
        `${apiBaseUrl}integrations/kotak/verify/`,
        otpData,
        {
          headers: {
            Authorization: Cookies.get("access_token"),
            'bypass-tunnel-reminder': "true"
          }
        }
      )
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          Cookies.set('kotak_access_token', res.data, { expires: 1 });
          toast.success("Kotak Integrated Successfully");
          onHide(); 
          setIsKotakIntegrated(true);
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          if (error.response.status === 400) {
            toast.error("OTP Invalid!");
          } else {
            toast.error(`Error: ${error.response.status} - ${error.response.data.message || 'Something went wrong!'}`);
          }
        } else if (error.request) {
          toast.error('No response received from the server.');
        } else {
          toast.error('There was an error verifying the OTP!');
        }
      });
  };

  return (
    <>
      <ToastContainer />
      {loading && (
        <div className="loader-overlay d-flex justify-content-center align-items-center">
          <img src={loader} alt="Loading..." className="loader-img" />
        </div>
      )}
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Kotak OTP Authentication</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img src={kotakLogo} alt="Kotak Logo" className="img-fluid mx-auto my-3" style={{ maxHeight: '100px', objectFit: 'contain' }} />
          <h3 className="text-center mb-4" style={{ color: '#00457C', fontWeight: 'bold' }}>Enter OTP</h3>
          <form onSubmit={handleOtpSubmit} className="login-form">
            <div className="d-flex justify-content-between mb-3 otp-input-container">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="form-control text-center otp-input"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  style={{ width: '40px', height: '40px', fontSize: '20px', margin: '0 5px', borderRadius: '8px' }}
                />
              ))}
            </div>
            <Button type="submit" variant="primary" className="w-100" disabled={otpButtonDisable}>
              Verify OTP
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
