import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Cookies from 'js-cookie';
import loader from "../../assets/images/loader.gif";
import apiBaseUrl from "../../constants/globaldata";

const AuthWrapper = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const checkAuth = async () => {

            const token = Cookies.get("access_token");
            if (!token) {
                setIsAuthenticated(false);
                navigate("/");
                return;
            }

            try {
                const response = await axios.get(`${apiBaseUrl}verify/`, {
                    headers: {
                        Authorization: token,
                        'bypass-tunnel-reminder': "true"
                    }
                });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    navigate("/");
                }
            } catch (error) {
                console.error('Authentication check failed:', error);

                setIsAuthenticated(false);
                navigate("/");
            }
        };

        checkAuth();
    }, [navigate]);

    if (isAuthenticated === null ) {
        return (
            <div className="loader-overlay">
                <img src={loader} alt="Loading..." className="loader-img" />
            </div>
        );
    }

    return isAuthenticated ? children : null;
};

export default AuthWrapper;