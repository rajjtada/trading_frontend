import React, { useState, useRef } from 'react';
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

export default function KotakOtpModal({ show, setIsKotakIntegrated, onHide }) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpButtonDisable, setOtpButtonDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const otpInputs = useRef([]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    const newOtp = [...otp];

    newOtp[index] = value.replace(/[^0-9]/g, '');

    setOtp(newOtp);

    if (value >= 0 && index < 3) {
      otpInputs.current[index + 1].focus();
    }

    setOtpButtonDisable(newOtp.some(digit => digit === ''));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    setOtpButtonDisable(newOtp.some(digit => digit === ''));
    if (pastedData.length === 4) {
      otpInputs.current[3].focus();
    } else {
      otpInputs.current[pastedData.length].focus();
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
        `${apiBaseUrl}integrations/kotak/auth/verify/`,
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
          const kotak_access_token = {
            Authorization: res.data["Authorization"],
            sid: res.data["sid"],
            auth: res.data["auth"],
            sld: res.data["sld"]
          };
          Cookies.set('kotak_access_token', JSON.stringify(kotak_access_token), { expires: 1 });
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
          }
          else if (error.response.status === 401) {
            try {
              const detail = JSON.parse(error.response.data.detail);
              const { message, flag } = detail;

              console.log(`Message: ${message}, Flag: ${flag}`);

              if (flag === "k") {
                toast.error(message);
              } else {
                navigate("/");
              }
            } catch (e) {
              console.error("Error parsing the detail field", e);
              toast.error('Error: Unable to parse error details.');
            }
          }
          else {
            toast.error(`Error: ${error.response.status} - ${error.response.data.message || 'Something went wrong!'}`);
          }
        }
        else if (error.request) {
          toast.error('No response received from the server.');
        }
        else {
          toast.error('There was an error verifying the OTP!');
        }
      });
  }

  return (
    <>
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
            <div className="d-flex justify-content-center mb-3 otp-input-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => otpInputs.current[index] = el}
                  type="text"
                  maxLength="1"
                  className="form-control text-center otp-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handleOtpPaste}
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
