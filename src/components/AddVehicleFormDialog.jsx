import React, {useRef} from 'react';
import AddVehicleForm from './AddVehicleForm';

const AddVehicleFormDialog = ({ user }) => {
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

    const closeDialogAndReload = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }

        window.location.reload();
    };

    return (
        <>
            <li onClick={openDialog} style={{ cursor: 'pointer' }}>➕ Add New Bus</li>

            <dialog ref={dialogRef} className="bus-dialog">
                <button onClick={closeDialog} className="close-button secondaryButton">✖ Close</button>
                <AddVehicleForm user={ user } onClose={ closeDialogAndReload } />
            </dialog>
        </>
    );
};

export default AddVehicleFormDialog;