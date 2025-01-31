import React from "react";

interface WaitlistCardProps {
    position?: number;
    firstName: string;
    lastName: string;
    phone: string;
    dateAdded: Date;
    partySize: number;
}

const WaitlistCard: React.FC<WaitlistCardProps> = ({
    position,
    firstName,
    lastName,
    phone,
    dateAdded,
    partySize
}) => {
    return (
        <div className="bg-slate-500">
            {position &&
                <p>Position: {position}</p>
            }
            <p>Name: {firstName} {lastName}</p>
            <p>Party Size: {partySize}</p>
            <p>Phone: {phone}</p>
            <p>Added: {dateAdded.toLocaleString()}</p>
        </div>
    );
};

export default WaitlistCard;
