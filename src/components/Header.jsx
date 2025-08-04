import React from 'react';
import '../styles/Header.css'
import AuthForm from "./AuthForm";

const Header = ({ user, setUser, setIsLoading  } ) => (
    <header className="Header">
        <h1 className="Header-logo">UI Fleet Management</h1>
        <AuthForm setIsLoading={ setIsLoading } />
    </header>
);

export default Header;