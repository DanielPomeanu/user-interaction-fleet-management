import React, {useCallback, useRef} from 'react';
import AddVehicleForm from './VehicleForm';
import '../styles/CRUDFormDialog.css'
import TicketForm from "./TicketForm";

const CRUDFormDialog = ({ type, id, title, onCloseDialog, setQuery, setForceCacheReload }) => {
    console.log('CRUDFormDialog RERENDER');
    const dialogRef = useRef(null);

    const openDialog = useCallback(() => {
        if (dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal();
            document.body.style.overflow = 'hidden'; // Disable scroll
        }
    }, []);

    const closeDialog = useCallback(() => {
        if (dialogRef.current) {
            dialogRef.current.close();
            document.body.style.overflow = ''; // Re-enable scroll
        }

        onCloseDialog();
    }, [onCloseDialog]);

    return (
        <>
            <dialog ref={dialogRef} className="crud-dialog">
                <div className="crud-dialog-header">
                    <h3 className="crud-dialog-title">{title}</h3>
                    <button onClick={closeDialog} className="close-button secondaryButton">✖ Închide</button>
                </div>
                {
                    type === 'bus' ? (
                        <AddVehicleForm busId={ id } openDialog={ openDialog } onClose={ closeDialog } setQuery={ setQuery } setForceCacheReload={ setForceCacheReload } />
                    ) : (
                        <TicketForm ticketId={ id } openDialog={ openDialog } onClose={ closeDialog } setQuery={ setQuery } setForceCacheReload={ setForceCacheReload } />
                    )
                }
            </dialog>
        </>

    );
};

export default CRUDFormDialog;