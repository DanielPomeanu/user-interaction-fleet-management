import {useEffect, useId, useState} from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import {supabase} from "../utils/supabase";
import {useUser} from "./UserContext";
import {useImageUploader} from "./ImageUploader";
import "../styles/Form.css"
import "../styles/TicketForm.css"

const baseFormData = {
    created_at: '',
    category: 'bus',
    reporter_name: '',
    reporter_email: '',
    details: '',
    image_url: '',
    status: 'open',
    bus_id: '',
    station_id: ''
};

const TicketForm = ({ ticketId, openDialog, onClose, setQuery, setForceCacheReload }) => {
    const { user } = useUser();
    const { uploadToCloudinary } = useImageUploader();
    console.log("RERENDER TicketForm:", { ticketId, user });

    const [formData, setFormData] = useState(baseFormData);
    //const [deleteRequest, setDeleteRequest] = useState(false);

    // const handleClickOnDelete = () => {
    //     setDeleteRequest(true);
    // }

    useEffect(() => {
        console.log("Use-effect:", { ticketId, user });
        let isCancelled = false;

        const fetchTicket = async () => {
            try {
                const { data, error } = await supabase
                    .from('Tickets')
                    .select('*')
                    .eq('id', ticketId);

                if (error) {
                    console.error('Error fetching tickets:', error);
                } else if (data && data.length > 0 && !isCancelled) {
                    setFormData(prev => {
                        const newData = {
                            ...baseFormData,
                            ...data[0],
                            created_at: new Date().toISOString()
                        };
                        return JSON.stringify(prev) !== JSON.stringify(newData) ? newData : prev;
                    });
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                if (!isCancelled) {
                    openDialog();
                }
            }
        };

        if (ticketId) {
            fetchTicket();
        } else {
            openDialog(); // create mode, no fetch
        }

        return () => {
            isCancelled = true;
        };
    }, [ticketId, openDialog, user]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const submissionData = {
            ...formData,
            created_at: new Date().toISOString(),
            bus_id: !formData.bus_id ? null : formData.bus_id,
            station_id: !formData.station_id ? null : formData.station_id
        };

        const { error } =
            ticketId ?
                await supabase.from('Tickets')
                    .update([submissionData])
                    .eq('id', ticketId) :
                await supabase.from('Tickets').insert([submissionData]);

        if (error) {
            ticketId ?
                console.log('Eroare la modificarea tichetului: ' + error.message) :
                console.log('Eroare la adăugarea tichetului: ' + error.message);
        } else {
            ticketId ?
                console.log('Tichetul a fost modificat cu succes!') :
                console.log('Tichetul a fost adăugat cu succes!');

            setQuery({ type: '', timestamp: Date.now() });
            setForceCacheReload(true);
            setFormData(baseFormData);
            onClose(); // 👈 closes dialog from parent
        }
    };

    // const handleConfirmationClose = () => {
    //     setDeleteRequest(false);
    //     onClose();
    // }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const imageUrl = await uploadToCloudinary(file);
            console.log('Image uploaded:', imageUrl);

            // ➕ Now save `imageUrl` to Supabase (example)
            setFormData(prev => ({ ...prev, image_url: imageUrl }));

        } catch (err) {
            console.error(err);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="add-ticket-form custom-form">
            <div className="form-row first">
                <label>
                    Tip sesizare
                    <select
                        name="category"
                        value={formData.category || ''}
                        onChange={handleChange}
                    >
                        <option value="bus">Autovehicul</option>
                    </select>
                </label>
            </div>
            <div className="form-row">
                <label>
                    Nr. parc vehicul
                    <input
                        type="text"
                        name="bus_id"
                        value={formData.bus_id}
                        required
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    Nume
                    <input
                        type="text"
                        name="reporter_name"
                        value={formData.reporter_name || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    E-mail
                    <input
                        type="text"
                        name="reporter_email"
                        value={formData.reporter_email || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row full-width">
                <label>
                    Detalii
                    <textarea
                        name="details"
                        rows="4"
                        value={formData.details || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row full-width">
                <label>
                    Încarcă o imagine
                    <input type="file" accept="image/*" onChange={handleFileChange}/>
                </label>
            </div>
            <div className="form-row full-width buttons">
                <button type="submit" className="primaryButton">{ticketId ? "Modifică" : "Adaugă"}</button>
                {/*{ticketId ?*/}
                {/*    <button type="button" className="deleteButton" onClick={handleClickOnDelete}>Șterge</button> : ''}*/}
            </div>

            {/*{deleteRequest &&*/}
            {/*    <ConfirmationDialog*/}
            {/*        busId={busId}*/}
            {/*        onClose={handleConfirmationClose}*/}
            {/*        setQuery={setQuery}*/}
            {/*        setForceCacheReload={setForceCacheReload}*/}
            {/*    />*/}
            {/*}*/}
        </form>
    );
};

export default TicketForm;