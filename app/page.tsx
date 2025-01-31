import WaitlistCard from "@/components/WaitlistCard";
import { dummyQueue } from "@/data";

export default function page() {
  return (
    <>
      <div>
        <h1>
          Dashboard
        </h1>
      </div>
      <div>
        <h2>
          Queue:
        </h2>
        <div className="space-y-4">
          {dummyQueue.length > 0 ? (
            dummyQueue
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
            <p>No entries in the waitlist.</p>
          )}
        </div>
      </div>
    </>
  );
}
