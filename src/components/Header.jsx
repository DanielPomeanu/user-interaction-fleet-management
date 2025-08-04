import React from 'react';
import '../styles/Header.css'
import AuthForm from "./AuthForm";

import busLogo from '../assets/bus_logo.png';

const Header = ({ setIsLoading  } ) => (
    <header className="Header">
        <img className="Header-logo" src={busLogo} alt="Bus Logo"/>
        <AuthForm setIsLoading={setIsLoading}/>
    </header>
);

export default Header;