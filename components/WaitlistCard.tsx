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
    onDelete: (id: string) => void;
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
    onDelete,
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
        onDelete(id);
    };

    return (
        <div className="bg-gray-800 text-white shadow-lg p-6 rounded-lg mb-4">
            {position && <p className="text-gray-400">Position: {position}</p>}

            {editMode ? (
                <div className="space-y-4">
                    <div className="flex items-center">
                        <span className="w-28 text-gray-300">First Name: </span>
                        <input
                            type="text"
                            value={editFields.firstName}
                            onChange={(e) =>
                                setEditFields({ ...editFields, firstName: e.target.value })
                            }
                            className="p-2 border rounded bg-gray-600 text-white"
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-28 text-gray-300">Last Name: </span>
                        <input
                            type="text"
                            value={editFields.lastName}
                            onChange={(e) =>
                                setEditFields({ ...editFields, lastName: e.target.value })
                            }
                            className="p-2 border rounded bg-gray-600 text-white"
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-28 text-gray-300">Phone: </span>
                        <input
                            type="text"
                            value={editFields.phone}
                            onChange={(e) =>
                                setEditFields({ ...editFields, phone: e.target.value })
                            }
                            className="p-2 border rounded bg-gray-600 text-white"
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-28 text-gray-300">Party Size: </span>
                        <input
                            type="number"
                            value={editFields.partySize}
                            onChange={(e) =>
                                setEditFields({ ...editFields, partySize: Number(e.target.value) })
                            }
                            className="p-2 border rounded bg-gray-600 text-white"
                        />
                    </div>

                    <div className="space-x-2 mt-4">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <p className="text-xl font-semibold">Name: {firstName} {lastName}</p>
                    <p>Phone: {phone}</p>
                    <p>Party Size: {partySize}</p>
                    <p>Added: {dateAdded.toLocaleString()}</p>

                    <div className="space-x-2 mt-4">
                        <button
                            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                            onClick={() => setEditMode(true)}
                        >
                            Edit
                        </button>
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
