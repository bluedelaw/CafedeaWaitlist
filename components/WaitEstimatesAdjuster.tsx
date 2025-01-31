"use client";

import React, { useState } from "react";

interface WaitEstimatesAdjusterProps {
    waitFor2: number;
    waitFor4: number;
    onSave: (newValues: { waitFor2: number; waitFor4: number }) => void;
}

const WaitEstimatesAdjuster: React.FC<WaitEstimatesAdjusterProps> = ({
    waitFor2,
    waitFor4,
    onSave,
}) => {
    const [newWaitFor2, setNewWaitFor2] = useState<number>(waitFor2);
    const [newWaitFor4, setNewWaitFor4] = useState<number>(waitFor4);

    const handleSave = () => {
        onSave({ waitFor2: newWaitFor2, waitFor4: newWaitFor4 });
    };

    return (
        <>
            <div>
                <label htmlFor="waitFor2">Wait Time for 2 People:</label>
                <input
                    type="number"
                    id="waitFor2"
                    value={newWaitFor2}
                    onChange={(e) => setNewWaitFor2(Number(e.target.value))}
                    className="text-black"
                />
            </div>
            <div>
                <label htmlFor="waitFor4">Wait Time for 4 People:</label>
                <input
                    type="number"
                    id="waitFor4"
                    value={newWaitFor4}
                    onChange={(e) => setNewWaitFor4(Number(e.target.value))}
                    className="text-black"
                />
            </div>
            <button onClick={handleSave} className="bg-green-600">
                Save Changes
            </button>
        </>
    );
};

export default WaitEstimatesAdjuster;
