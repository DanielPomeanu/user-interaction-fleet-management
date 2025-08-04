import React, {useCallback, useRef} from 'react';
import AddVehicleForm from './AddVehicleForm';
import '../styles/AddVehicleFormDialog.css'

const AddVehicleFormDialog = ({ busId, onCloseDialog, setQuery, setIsLoading }) => {
    console.log('AddVehicleFormDialog RERENDER');
    const dialogRef = useRef(null);

    const openDialog = useCallback(() => {
        if (dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal();
        }
    }, []);

    const closeDialog = useCallback(() => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }

        onCloseDialog();
    }, [onCloseDialog]);

    return (
        <>
            <dialog ref={dialogRef} className="bus-dialog">
                <div className="bus-dialog-header">
                    <h3 className="bus-dialog-title">{busId ? "Modifică vehicul" : "Adaugă vehicul"}</h3>
                    <button onClick={closeDialog} className="close-button secondaryButton">✖ Închide</button>
                </div>
                <AddVehicleForm busId={ busId } openDialog={ openDialog } onClose={ closeDialog } setQuery={ setQuery } setIsLoading = { setIsLoading } />
            </dialog>
        </>

    );
};

export default AddVehicleFormDialog;