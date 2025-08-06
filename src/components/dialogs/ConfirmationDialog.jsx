import {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';
import { supabase } from '../../utils/supabase';
import '../../styles/forms/AuthForm.css';
import '../../styles/dialogs/ConfirmationDialog.css';

const ConfirmationDialog = forwardRef(({ id, category, onClose, setQuery, setForceCacheReload, setDeleteRequest, clickedInsideDialogRef }, ref) => {
    const dialogRef = useRef(null);

    // Expose DOM node to parent through ref
    useImperativeHandle(ref, () => dialogRef.current);

    const openDialog = () => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    };

    const closeDialog = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }

        setDeleteRequest(false);
    };

    const handleDeleteClick = () => {
        const performDelete = async () => {
            const table = category === 'bus' ? 'Buses' : 'Stations'
            const identifier = category === 'bus' ? 'id' : 'name'

            const {error } = await supabase
                .from(table)
                .delete()
                .eq(identifier, id || '');

            if (error) {
                alert ('Eroare la ștergere: ' + error);
            } else {
                //alert ('Vehiculul a fost șters cu succes!');
                closeDialog();
                onClose();

                setQuery({ type: '', timestamp: Date.now() });
                setForceCacheReload(true);
            }
        }

        performDelete();
    }

    useEffect(() => {
        openDialog();
    }, []); // run once after mount

    // Set clickedInsideDialogRef true when clicking anywhere inside the dialog,
    // so BusTable's outside click handler will ignore this click
    const handleDialogClick = () => {
        if (clickedInsideDialogRef) {
            clickedInsideDialogRef.current = true;
        }
    };

    return (
        <>
            <dialog
                ref={dialogRef}
                className="confirmation-dialog"
                onClick={handleDialogClick}  // Capture clicks inside dialog
            >
                <div className="confirmation-dialog-header">
                    {
                        category === 'bus' ? (
                                <h3 className="confirmation-dialog-text">Ești sigur că dorești să ștergi vehiculul?</h3>
                            ) :
                            (
                                <h3 className="confirmation-dialog-text">Ești sigur că dorești să ștergi stația?</h3>
                            )
                    }
                </div>
                <div className="confirmation-dialog-buttons">
                    <button type="button" className="deleteButton" onClick={ handleDeleteClick }>Da</button>
                    <button type="button" className="secondaryButton" onClick={ closeDialog }>Nu</button>
                </div>
            </dialog>
        </>
    );
});

export default ConfirmationDialog;