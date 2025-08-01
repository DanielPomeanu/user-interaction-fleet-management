import React, { useState } from 'react';
import '../styles/Menu.css';
import AddVehicleFormDialog from "./AddVehicleFormDialog"; // for optional styling

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <div className="menu-wrapper">
            <button onClick={toggleMenu} className="menu-button"></button>

            {isOpen && (
                <div className="menu-overlay">
                    <ul>
                        <AddVehicleFormDialog/>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Menu;