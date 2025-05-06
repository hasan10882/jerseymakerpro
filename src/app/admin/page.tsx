"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (loggedInUser) => {
      if (loggedInUser) {
        const tokenResult = await getIdTokenResult(loggedInUser, true); // force refresh
        const claims = tokenResult.claims;

        if (claims.admin === true) {
          setIsAdmin(true);
          setUser(loggedInUser);
        } else {
          alert("You are not authorized to access the admin panel.");
          window.location.href = "/";
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <main className="p-6">Checking access...</main>;
  }

  if (!user || !isAdmin) {
    return <main className="p-6 text-red-500">Access Denied.</main>;
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">✅ Admin Access Granted</h1>
      {/* your admin dashboard code here */}
    </main>
  );
}
