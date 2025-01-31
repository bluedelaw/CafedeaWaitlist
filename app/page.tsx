"use client"

import WaitEstimatesAdjuster from "@/components/WaitEstimatesAdjuster";
import WaitlistCard from "@/components/WaitlistCard";
import { db, collection, getDocs, doc, updateDoc } from "@/firebaseConfig";
import { useEffect, useState } from "react";

export default function Page() {
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [waitEstimates, setWaitEstimates] = useState<any | null>(null);

  useEffect(() => {
    const fetchWaitlistData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "waitlist"));
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          dateAdded: doc.data().dateAdded.toDate(),
        }));
        setWaitlist(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    const fetchSettingsData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "settings"));
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setWaitEstimates(data.find(s => s.id === "waitEstimates"));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchSettingsData();
    fetchWaitlistData();
  }, []);

  const handleSaveWaitEstimates = async (newValues: { waitFor2: number; waitFor4: number }) => {
    if (!waitEstimates) return;

    try {
      const settingsRef = doc(db, "settings", waitEstimates.id);
      await updateDoc(settingsRef, {
        waitFor2: newValues.waitFor2,
        waitFor4: newValues.waitFor4,
      });
      setWaitEstimates({ ...waitEstimates, ...newValues });
    } catch (error) {
      console.error("Error saving settings: ", error);
      alert("Failed to save settings.");
    }
  };

  return (
    <>
      <div className="bg-red-800">
        <h1>Title</h1>
      </div>

      <div className="bg-green-800">
        <h2>Settings</h2>
        <div className="space-y-4">
          {waitEstimates ? (
            <WaitEstimatesAdjuster
              waitFor2={waitEstimates.waitFor2}
              waitFor4={waitEstimates.waitFor4}
              onSave={handleSaveWaitEstimates}
            />
          ) : (
            <p>Loading settings...</p>
          )}
        </div>
      </div>

      <div className="bg-blue-800">
        <h2>Waitlist:</h2>
        <div className="space-y-4">
          {waitlist.length > 0 ? (
            waitlist
              .sort((a, b) => a.dateAdded.getTime() - b.dateAdded.getTime())
              .map((entry, index) => (
                <WaitlistCard
                  key={index}
                  position={index + 1}
                  firstName={entry.firstName}
                  lastName={entry.lastName}
                  phone={entry.phone}
                  dateAdded={entry.dateAdded}
                  partySize={entry.partySize}
                />
              ))
          ) : (
            <p>No entries.</p>
          )}
        </div>
      </div>
    </>
  );
}
