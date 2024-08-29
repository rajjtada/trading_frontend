import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './finvasia.css';  
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiBaseUrl from "../../constants/globaldata";
import loader from "../../assets/images/loader.gif";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import FinvasiaLogo from "../../assets/images/finvasia-logo.jpg";

export default function Finvasia_Auth() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [otpButtonDisable,setOtpButtonDisable] = useState(true);
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
    if(index === 5){
      setOtpButtonDisable(false)
    }
    else{
      setOtpButtonDisable(true)
    }
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const otpValue = otp.join("");

    const otpData = {
        email: "test@example.com",  
        otp: otpValue
    };

    axios
        .post(
            `${apiBaseUrl}integration/finvasia/`,
            otpData,
            {
                headers: {
                    'bypass-tunnel-reminder': "true"
                }
            }
        )
        .then((res) => {
            setLoading(false);
            if (res.status === 200) {
                const accessToken = res.data["access_token"];
                Cookies.set('access_token', accessToken, { expires: 1 }); 
                toast.success("Login Successful");
                navigate("/dashboard");
            }
        })
        .catch((error) => {
            setLoading(false);
            if (error.response) {
                if (error.response.status === 400) {
                    toast.error("OTP Invalid !");
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
    <div className="d-flex justify-content-center align-items-center vh-100 position-relative bg-light">
      <ToastContainer />
      {loading && (
        <div className="loader-overlay d-flex justify-content-center align-items-center">
          <img src={loader} alt="Loading..." className="loader-img" />
        </div>
      )}
      <div className="card shadow-sm p-4 text-center" style={{ width: '400px', borderRadius: '12px' }}>
        <img src={FinvasiaLogo} alt="Kotak Logo" className="img-fluid mx-auto my-3" style={{ maxHeight: '100px', objectFit: 'contain' }} />
        <h3 className="text-center mb-4" style={{ color: '#00457C', fontWeight: 'bold' }}>Enter OTP for Finvasia Auth</h3>
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
          <button type="submit" className="btn btn-primary w-100" disabled={otpButtonDisable} style={{ backgroundColor: '#FF5722', borderColor: '#FF5722', borderRadius: '8px' }}>Verify OTP</button>
        </form>
      </div>
    </div>
  );
}
