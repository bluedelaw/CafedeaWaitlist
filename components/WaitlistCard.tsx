import React from "react";
import { WaitlistEntry } from "@/data";

const WaitlistCard: React.FC<WaitlistEntry> = ({
    position,
    firstName,
    lastName,
    phone,
    dateAdded
}) => {
    return (
        <div className="bg-slate-500">
            {position &&
                <p>Position: {position}</p>
            }
            <p>Name: {firstName} {lastName}</p>
            <p>Phone: {phone}</p>
            <p>Added: {dateAdded.toLocaleString()}</p>
        </div>
    );
};

export default WaitlistCard;
