import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiBaseUrl from "../../constants/globaldata"

export default function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [step, setStep] = useState(1);

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    const emailData = { email: email };

    axios
      .post(
        `${apiBaseUrl}auth/login`,
        emailData
      )
      .then((res) => {
        console.log(res);
        console.log(res.data);
        setStep(2);
      })
      .catch((error) => {
        console.error("There was an error sending the email!", error);
        toast.error('There was an error sending the email!');
      });
  };

  const handleOtpChange = (element, index) => {
    if (/^[0-9]$/.test(element.value)) {
      const newOtp = [...otp];
      newOtp[index] = element.value;
      setOtp(newOtp);

      if (element.nextSibling) {
        element.nextSibling.focus();
      }
    }
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    const otpValue = otp.join("");

    const otpData = {
      email: email,
      otp: otpValue
    };

    axios
      .post(
        `${apiBaseUrl}auth/verify-otp`,
        otpData
      )
      .then((res) => {
        console.log(res);
        console.log(res.data);
        alert('Login successful!');
      })
      .catch((error) => {
        console.error("There was an error verifying the OTP!", error);
        toast.error('here was an error verifying the OTP!');
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <ToastContainer />
      <div className="card shadow-sm p-4">
        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="login-form">
            <h3 className="text-center mb-4">Login</h3>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Send OTP</button>
          </form>
        ) : (
            <form onSubmit={handleOtpSubmit} className="login-form">
              <h3 className="text-center mb-4">Enter OTP</h3>
              <div className="d-flex justify-content-between mb-3 otp-input-container">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="form-control text-center otp-input"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                  />
                ))}
              </div>
              <button type="submit" className="btn btn-primary w-100">Verify OTP</button>
            </form>
          )}
      </div>
    </div>
  );
}
