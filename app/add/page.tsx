"use client"

import AddForm from "@/components/AddForm";

export default function Page() {
    return (
        <>
            <div className="bg-blue-900 text-white py-6">
                <h1 className="text-3xl font-semibold text-center">
                    Title
                </h1>
            </div>

            <div className="max-w-lg mx-auto mt-8 p-4 bg-slate-400 shadow-lg rounded-lg">
                <AddForm />
            </div>
        </>
    );
}
