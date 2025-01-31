'use client'

import React, { useState } from 'react';
import { db, collection, addDoc } from "@/firebaseConfig";

interface Errors {
    firstName: string;
    lastName: string;
    phone: string;
    partySize: string;
}

const AddForm: React.FC = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [partySize, setPartySize] = useState<number>(1);
    const [errors, setErrors] = useState<Errors>({ firstName: '', lastName: '', phone: '', partySize: '' });

    const isValidPhoneNumber = (phone: string): boolean => {
        const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
        return phoneRegex.test(phone);
    };

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, firstName: e.target.value ? '' : 'First name is required' }));
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, lastName: e.target.value ? '' : 'Last name is required' }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            phone: !e.target.value ? 'Phone number is required' : isValidPhoneNumber(e.target.value) ? '' : 'Invalid phone number'
        }));
    };

    const handlePartySizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setPartySize(value);
        setErrors((prevErrors) => ({ ...prevErrors, partySize: value >= 1 ? '' : 'Party size must be at least 1' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.values(errors).some(error => error) || !firstName || !lastName || !phone || partySize < 1) {
            alert('Please fix errors before submitting.');
            return;
        }

        try {
            await addDoc(collection(db, "waitlist"), {
                firstName,
                lastName,
                phone,
                partySize,
                dateAdded: new Date(),
            });

            alert('Waitlist entry added successfully!');
            setFirstName('');
            setLastName('');
            setPhone('');
            setPartySize(1);
            setErrors({ firstName: '', lastName: '', phone: '', partySize: '' });
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Error adding entry. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-blue-800">
            <div>
                <label htmlFor="firstName" className="block">First Name</label>
                <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    className="text-black"
                    required
                />
                {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
            </div>

            <div>
                <label htmlFor="lastName" className="block">Last Name</label>
                <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={handleLastNameChange}
                    className="text-black"
                    required
                />
                {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
            </div>

            <div>
                <label htmlFor="phone" className="block">Phone</label>
                <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="text-black"
                    required
                />
                {errors.phone && <p className="text-red-500">{errors.phone}</p>}
            </div>

            <div>
                <label htmlFor="partySize" className="block">Party Size</label>
                <input
                    id="partySize"
                    type="number"
                    value={partySize}
                    onChange={handlePartySizeChange}
                    className="text-black"
                    min="1"
                    required
                />
                {errors.partySize && <p className="text-red">{errors.partySize}</p>}
            </div>

            <button type="submit" className="bg-green-500">
                Add to Waitlist
            </button>
        </form>
    );
};

export default AddForm;
