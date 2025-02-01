import { useState } from "react";

interface WaitlistCardProps {
    position?: number;
    firstName: string;
    lastName: string;
    phone: string;
    dateAdded: Date;
    partySize: number;
    id: string;
    onSave: (id: string, updatedFields: any) => void;
    onCancel: () => void;
    onDelete: (id: string) => void; // New prop for delete functionality
}

export const WaitlistCard: React.FC<WaitlistCardProps> = ({
    position,
    firstName,
    lastName,
    phone,
    dateAdded,
    partySize,
    id,
    onSave,
    onCancel,
    onDelete, // Use the new prop
}) => {
    const [editMode, setEditMode] = useState(false);
    const [editFields, setEditFields] = useState({
        firstName,
        lastName,
        phone,
        partySize,
    });

    const handleSave = () => {
        onSave(id, editFields);
        setEditMode(false);
    };

    const handleCancel = () => {
        setEditFields({ firstName, lastName, phone, partySize });
        setEditMode(false);
        onCancel();
    };

    const handleDelete = () => {
        onDelete(id); // Call the delete function when delete button is clicked
    };

    return (
        <div className="bg-blue-700 p-4">
            {position && <p>Position: {position}</p>}

            {editMode ? (
                <div>
                    <div>
                        <span>First Name: </span>
                        <input
                            type="text"
                            value={editFields.firstName}
                            onChange={(e) =>
                                setEditFields({ ...editFields, firstName: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <span>Last Name: </span>
                        <input
                            type="text"
                            value={editFields.lastName}
                            onChange={(e) =>
                                setEditFields({ ...editFields, lastName: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <span>Phone: </span>
                        <input
                            type="text"
                            value={editFields.phone}
                            onChange={(e) =>
                                setEditFields({ ...editFields, phone: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <span>Party Size: </span>
                        <input
                            type="number"
                            value={editFields.partySize}
                            onChange={(e) =>
                                setEditFields({ ...editFields, partySize: Number(e.target.value) })
                            }
                        />
                    </div>

                    <button className="bg-green-700" onClick={handleSave}>
                        Save
                    </button>
                    <button className="bg-gray-700" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            ) : (
                <div>
                    <p>Name: {firstName} {lastName}</p>
                    <p>Phone: {phone}</p>
                    <p>Party Size: {partySize}</p>
                    <p>Added: {dateAdded.toLocaleString()}</p>

                    <button className="bg-yellow-700" onClick={() => setEditMode(true)}>
                        Edit
                    </button>
                    <button className="bg-red-700" onClick={handleDelete}>
                        Delete
                    </button> {/* Delete button */}
                </div>
            )}
        </div>
    );
};
