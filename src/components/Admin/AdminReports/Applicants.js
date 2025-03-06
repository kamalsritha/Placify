import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCompanies } from "../../../redux/companySlice.jsx";
import './Applicant.css';
import AdminHome from '../AdminHome.js';
import Footer from '../AdminReusableComponents/AdminFooter.js';

function Applicants() {
    const dispatch = useDispatch();
    const companies = useSelector((state) => state.companies.companies);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3001/auth/getCompanies");
                dispatch(getCompanies(response.data));
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [dispatch]);

    return (
        <>
         <AdminHome />
        <div className="applicants-wrapper">
            <h1 className="heading">Companies</h1>
            <div className="company-container">
                {companies.map((company, index) => (
                    <Link
                        key={index}
                        to={`/scheduledInterviewData/${company.id}`} 
                        className="company-box"
                    >
                        {company.companyname}
                    </Link>
                ))}
            </div>
        </div>
        <Footer/>
        </>
    );
}

export default Applicants;
