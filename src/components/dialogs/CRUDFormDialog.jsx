import React, {forwardRef, useCallback, useImperativeHandle, useRef} from 'react';
import '../../styles/dialogs/CRUDFormDialog.css'
import TicketForm from "../forms/TicketForm";
import VehicleForm from "../forms/VehicleForm";
import StationForm from "../forms/StationForm";

const CRUDFormDialog = forwardRef(({ type, id, title, onCloseDialog, setQuery, setForceCacheReload, deleteRequest, setDeleteRequest }, ref) => {
    console.log('CRUDFormDialog RERENDER');
    const dialogRef = useRef(null);

    useImperativeHandle(ref, () => dialogRef.current);

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
                        <VehicleForm
                            busId={ id }
                            openDialog={ openDialog }
                            onClose={ closeDialog }
                            setQuery={ setQuery }
                            setForceCacheReload={ setForceCacheReload }
                            setDeleteRequest={setDeleteRequest}
                        />
                    ) : type === 'station' ?
                        (
                            <StationForm
                                stationName={ id }
                                openDialog={ openDialog }
                                onClose={ closeDialog }
                                setQuery={ setQuery }
                                setForceCacheReload={ setForceCacheReload }
                                deleteRequest={deleteRequest}
                                setDeleteRequest={setDeleteRequest}
                            />
                        ) :
                            (
                                <TicketForm
                                    ticketId={ id }
                                    openDialog={ openDialog }
                                    onClose={ closeDialog }
                                    setQuery={ setQuery }
                                    setForceCacheReload={ setForceCacheReload } />
                            )
                }
            </dialog>
        </>

    );
});

export default CRUDFormDialog;