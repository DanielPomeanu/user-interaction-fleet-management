import React, {useCallback, useEffect, useRef, useState} from 'react';
import '../../styles/layout/Menu.css';
import CRUDFormDialog from "../dialogs/CRUDFormDialog";

const Menu = ({ setQuery, setIsLoading, setForceCacheReload }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showVehicleDialog, setShowVehicleDialog] = useState(false);
    const [showTicketDialog, setShowTicketDialog] = useState(false);
    const [showStationDialog, setShowStationDialog] = useState(false);
    const menuRef = useRef(null);

    const openVehicleDialog = () => setShowVehicleDialog(true);
    const closeVehicleDialog = useCallback(() => { setShowVehicleDialog(false) }, []);

    const openTicketDialog = () => setShowTicketDialog(true);
    const closeTicketDialog = useCallback(() => { setShowTicketDialog(false) }, []);

    const openStationDialog = () => setShowStationDialog(true);
    const closeStationDialog = useCallback(() => { setShowStationDialog(false) }, []);

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

            <div className={`menu-overlay ${isOpen ? 'open' : ''}`} tabIndex={0}>
                <ul>
                    <li className="menuItem" onClick={() => {
                        openVehicleDialog();
                        toggleMenu();
                    }}
                    >
                        ➕ Adaugă vehicul
                    </li>
                    <li className="menuItem" onClick={() => {
                        openStationDialog();
                        toggleMenu();
                    }}
                    >
                        ➕ Adaugă stație
                    </li>
                    <li className="menuItem" onClick={() => {
                        openTicketDialog();
                        toggleMenu();
                    }}
                    >
                        ➕ Adaugă sesizare
                    </li>
                </ul>
            </div>

            {
                showVehicleDialog && (
                    <CRUDFormDialog
                        type={'bus'}
                        id={''}
                        title={'Adaugă vehicul'}
                        onCloseDialog={closeVehicleDialog}
                        setQuery={setQuery}
                        setIsLoading={setIsLoading}
                        setForceCacheReload={setForceCacheReload}
                    />
                )
            }

            {
                showTicketDialog && (
                    <CRUDFormDialog
                        type={'ticket'}
                        id={''}
                        title={'Adaugă sesizare'}
                        onCloseDialog={closeTicketDialog}
                        setQuery={setQuery}
                        setIsLoading={setIsLoading}
                        setForceCacheReload={setForceCacheReload}
                    />
                )
            }

            {
                showStationDialog && (
                    <CRUDFormDialog
                        type={'station'}
                        id={''}
                        title={'Adaugă stație'}
                        onCloseDialog={closeStationDialog}
                        setQuery={setQuery}
                        setIsLoading={setIsLoading}
                        setForceCacheReload={setForceCacheReload}
                    />
                )
            }
        </div>
    );
};

export default Menu;