import React, { useRef } from 'react';
import AddBusForm from './AddVehicleForm';

const AddVehicleFormDialog = () => {
    const dialogRef = useRef(null);

    const openDialog = () => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    };

    const closeDialog = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
    };

    return (
        <>
            <li onClick={openDialog} style={{ cursor: 'pointer' }}>➕ Add New Bus</li>

            <dialog ref={dialogRef} className="bus-dialog">
                <button onClick={closeDialog} className="close-button">✖ Close</button>
                <AddBusForm />
            </dialog>
        </>
    );
};

export default AddVehicleFormDialog;