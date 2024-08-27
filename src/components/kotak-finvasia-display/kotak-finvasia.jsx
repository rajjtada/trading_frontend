import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import kotakLogo from "../../assets/images/kotak-logo.png";
import finvasiaLogo from "../../assets/images/finvasia-logo.jpg";

export default function KotakFinvasia() {

    const navigate = useNavigate();
    let KotakCall=()=>{
        navigate('/dashboard');
    }

    let FinvasiaCall=()=>{
        navigate('/dashboard');
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="row w-75">
                <div className="col-24 mb-3 text-center">
                    <h2>Select Trading Platform </h2>
                </div>
                <div className="col-12 col-md-6 mb-3">
                    <button className="btn btn-light w-100 h-100 p-3 shadow-sm" onClick={KotakCall}>
                        <img src={kotakLogo} alt="Kotak Logo" className="img-fluid" style={{ maxHeight: '150px', objectFit: 'contain' }} />
                    </button>
                </div>
                <div className="col-12 col-md-6 mb-3">
                    <button className="btn btn-light w-100 h-100 p-3 shadow-sm" onClick={FinvasiaCall}>
                        <img src={finvasiaLogo} alt="Finvasia Logo" className="img-fluid" style={{ maxHeight: '150px', objectFit: 'contain' }} />
                    </button>
                </div>
            </div>
        </div>
    );
}
