"use client";

import WaitlistCard from "@/components/WaitlistCard";
import { db, collection, getDocs } from "@/firebaseConfig";
import { useEffect, useState } from "react";

export default function page() {
  const [waitlist, setWaitlist] = useState<any[]>([]); // Store data from Firestore

  useEffect(() => {
    // Fetch data from Firestore on component mount
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "waitlist"));
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setWaitlist(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures it runs only once

  return (
    <>
      <div>
        <h1>
          Dashboard
        </h1>
      </div>
      <div>
        <h2>
          Waitlist:
        </h2>
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
