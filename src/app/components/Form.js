"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Form() {
    const [participants, setParticipants] = useState([
        { role: "SELLER", name: "", email: "", order: 1 },
        { role: "BUYER", name: "", email: "", order: 2 },
    ]);
    const [templateId, setTemplateId] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isMounted, setIsMounted] = useState(false);


    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const handleParticipantChange = (index, field, value) => {
        const updatedParticipants = [...participants];
        updatedParticipants[index][field] =
            field === "order" ? parseInt(value, 10) : value;
        setParticipants(updatedParticipants);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const hasDuplicates = participants
            .map((p) => p.role)
            .some((v, i, arr) => arr.indexOf(v) !== i);
        if (hasDuplicates) {
            setMessage("Duplicate roles are not allowed.");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                templateId,
                participants: participants.map((participant) => ({
                    role: participant.role.toUpperCase(),
                    name: participant.name.trim(),
                    email: participant.email.trim(),
                    order: participant.order,
                })),
                test_mode: 1,
            };

            const response = await axios.post("https://dropsignappbackend.onrender.com", payload);

            if (response.status === 200) {
                setMessage("Template sent successfully ");
            } else {
                setMessage("Template sent successfully ");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <main className="flex-grow flex justify-center items-center w-full bg-gradient-to-tl from-gray-100 to-white py-6">
                <form
                    className="w-full max-w-lg bg-white p-6 rounded-xl shadow-xl border border-gray-300"
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                        Send Template for Signature
                    </h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Template ID
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Template ID"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            value={templateId}
                            onChange={(e) => setTemplateId(e.target.value)}
                            required
                        />
                    </div>

                    {participants.map((participant, index) => (
                        <div key={index} className="flex flex-col gap-3 mb-4">

                            <input
                                type="text"
                                placeholder={`${participant.role === "SELLER" ? "Seller" : "Buyer"} Name`}
                                className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-gray-100 text-gray-800"
                                value={participant.name}
                                onChange={(e) =>
                                    handleParticipantChange(index, "name", e.target.value)
                                }
                                required
                            />
                            <input
                                type="email"
                                placeholder={`${participant.role === "SELLER" ? "Seller" : "Buyer"} Email`}
                                className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-gray-100 text-gray-800"
                                value={participant.email}
                                onChange={(e) =>
                                    handleParticipantChange(index, "email", e.target.value)
                                }
                                required
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className={`w-full p-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send "}
                    </button>

                    {message && (
                        <p className="text-sm text-center mt-4 text-green-600">{message}</p>
                    )}
                </form>
            </main>
        </div>
    );
}
