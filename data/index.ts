export const siteTitle = "Waitlist"
export const siteDescription = "Cafe de a waitlisting app."

export interface WaitlistEntry {
    position?: number;
    firstName: string;
    lastName: string;
    phone: string;
    dateAdded: Date;
}

export const dummyQueue: WaitlistEntry[] = [
    {
        firstName: "Jane",
        lastName: "Smith",
        phone: "9876543210",
        dateAdded: new Date(new Date().setHours(14, 30, 0, 0)),
    },
    {
        firstName: "John",
        lastName: "Doe",
        phone: "1234567890",
        dateAdded: new Date(),
    },
    {
        firstName: "Alice",
        lastName: "Brown",
        phone: "5551234567",
        dateAdded: new Date(new Date().setHours(10, 15, 0, 0)),
    },
]