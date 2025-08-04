import React, {useCallback, useEffect, useRef, useState} from 'react';
import '../styles/Menu.css';
import AddVehicleFormDialog from "./AddVehicleFormDialog";

const Menu = ({ setQuery, setIsLoading }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const menuRef = useRef(null);

    const openDialog = () => setShowDialog(true);
    const closeDialog = useCallback(() => { setShowDialog(false) }, []);

    const toggleMenu = () => {
        setIsOpen(prev => !prev);
    };

    // 👇 Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Use mousedown instead of click to catch before focus/blur happens
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="menu-wrapper" ref={menuRef}>
            <button onClick={toggleMenu} className="menu-button"></button>

            {isOpen && (
                <div className="menu-overlay">
                    <ul>
                        <li className="menuItem" onClick={() => {
                            openDialog();
                            toggleMenu();
                        }}
                        >
                            ➕ Adaugă vehicul
                        </li>
                    </ul>
                </div>
            )}
            { showDialog && (
                <AddVehicleFormDialog
                    busId={''}
                    onCloseDialog={closeDialog}
                    setQuery={setQuery}
                    setIsLoading={ setIsLoading }
                />
            )}
        </div>
    );
};

export default Menu;