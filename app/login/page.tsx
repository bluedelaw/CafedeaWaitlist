"use client";

import { useState } from "react";
import { db } from "@/firebaseConfig"; // Import Firestore instance
import { doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const docRef = doc(db, "config", "password");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const storedPassword = docSnap.data().value;

        if (password === storedPassword) {
          Cookies.set("token", "authenticated", { expires: 1 });
          router.push("/");
        } else {
          setError("Incorrect password");
        }
      } else {
        setError("No password found in database");
      }
    } catch (err) {
      setError("Error checking password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Login</h1>
      <input
        type="password"
        className="border p-2 rounded mt-2 text-black"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        onClick={handleLogin}
      >
        Login
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
