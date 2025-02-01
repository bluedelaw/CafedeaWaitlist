'use client'

import React, { useState } from 'react';
import { db, collection, addDoc } from "@/firebaseConfig";

interface FormInputs {
    firstName: string;
    lastName: string;
    phone: string;
    partySize: number;
    errors: {
        firstName: string;
        lastName: string;
        phone: string;
        partySize: string;
    };
}

const AddForm: React.FC = () => {
    const [formInputs, setFormInputs] = useState<FormInputs>({
        firstName: '',
        lastName: '',
        phone: '',
        partySize: 1,
        errors: { firstName: '', lastName: '', phone: '', partySize: '' }
    });

    const isValidPhoneNumber = (phone: string): boolean => {
        const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
        return phoneRegex.test(phone);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        let newValue: string | number = value;
        if (id === "partySize") newValue = Number(value);

        setFormInputs((prev) => {
            const newErrors = { ...prev.errors };

            switch (id) {
                case "firstName":
                    newErrors.firstName = value ? "" : "First Name is required";
                    break;
                case "lastName":
                    newErrors.lastName = value ? "" : "Last Name is required";
                    break;
                case "phone":
                    newErrors.phone = value ? (isValidPhoneNumber(value) ? "" : "Invalid Phone Number") : "Phone Number is required";
                    break;
                case "partySize":
                    newErrors.partySize = Number(value) >= 1 ? "" : "Party Size must be at least 1";
                    break;
                default:
                    break;
            }

            return { ...prev, [id]: newValue, errors: newErrors };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.values(formInputs.errors).some(error => error) ||
            !formInputs.firstName ||
            !formInputs.lastName ||
            !formInputs.phone ||
            formInputs.partySize < 1
        ) {
            alert('Please fix errors before submitting.');
            return;
        }

        try {
            await addDoc(collection(db, "waitlist"), {
                firstName: formInputs.firstName,
                lastName: formInputs.lastName,
                phone: formInputs.phone,
                partySize: formInputs.partySize,
                dateAdded: new Date(),
            });

            alert('Waitlist entry added successfully!');
            setFormInputs({
                firstName: '',
                lastName: '',
                phone: '',
                partySize: 1
                , errors: {
                    firstName: '',
                    lastName: '',
                    phone: '',
                    partySize: ''
                }
            });
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Error adding entry. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-gray-300 p-6 rounded-lg shadow-lg">
            {['firstName', 'lastName', 'phone', 'partySize'].map((field) => (
                <div key={field} className="mb-4">
                    <label htmlFor={field} className="block text-lg font-medium text-gray-700 mb-2">
                        {
                            field === "partySize" ? "Party Size" :
                                field === "phone" ? "Phone Number" :
                                    field === "firstName" ? "First Name" :
                                        field === "lastName" ? "Last Name" : "Unknown"
                        }
                    </label>
                    <input
                        id={field}
                        type={
                            field === "partySize" ? "number" :
                                field === "phone" ? "tel" : "text"
                        }
                        value={formInputs[field as keyof FormInputs] as string}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        min={field === "partySize" ? 1 : undefined}
                        required
                    />
                    {formInputs.errors[field as keyof FormInputs["errors"]] &&
                        <p className="text-red-500 text-sm mt-1">
                            {formInputs.errors[field as keyof FormInputs["errors"]]}
                        </p>}
                </div>
            ))}
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Add to Waitlist
            </button>
        </form>
    );
};

export default AddForm;
