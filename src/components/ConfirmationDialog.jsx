import {useEffect, useRef} from 'react';
import { supabase } from '../utils/supabase';
import '../styles/AuthForm.css';
import '../styles/ConfirmationDialog.css';

const ConfirmationDialog = ({ busId, onClose, setQuery }) => {
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

        onClose();
    };

    const handleDeleteClick = () => {
        const deleteBus = async () => {
            const {error } = await supabase
                .from('Buses')
                .delete()
                .eq('id', busId || '');

            if (error) {
                alert ('Eroare la ștergerea vehiculului: ' + error);
            } else {
                //alert ('Vehiculul a fost șters cu succes!');
                closeDialog();
                setQuery({ type: '', timestamp: Date.now() });
            }
        }

        deleteBus();
    }

    useEffect(() => {
        openDialog();
    }, []); // run once after mount

    return (
        <>
            <dialog ref={dialogRef} className="confirmation-dialog">
                <div className="confirmation-dialog-header">
                    <h3 className="confirmation-dialog-text">Ești sigur că dorești să ștergi vehiculul?</h3>
                </div>
                <div className="confirmation-dialog-buttons">
                    <button type="button" className="deleteButton" onClick={ handleDeleteClick }>Da</button>
                    <button type="button" className="secondaryButton" onClick={ closeDialog }>Nu</button>
                </div>
            </dialog>
        </>
    );
};

export default ConfirmationDialog;