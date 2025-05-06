"use client";

import { useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "../../firebaseConfig";

export default function LoginPage() {
  const [user, setUser] = useState<any>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true); // delay until mounted (fix hydration)
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  if (!hasMounted) return null;

  return (
    <main className="p-6">
      {user ? (
        <>
          <p className="mb-4">Welcome, {user.displayName}</p>
          <button
            onClick={() => signOut(auth)}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => signInWithPopup(auth, provider)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login with Google
        </button>
      )}
    </main>
  );
}
