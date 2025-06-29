"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/app/server/utils/supabase/supabase";

export function Navbar() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setEmail(user?.email ?? null);
      } catch (error) {
        console.error("Fehler beim Abrufen des Benutzers:", error);
      }
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setEmail(session?.user?.email ?? null);
      }
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Fehler beim Ausloggen:", error);
    }
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow-sm">
      <h1 className="text-lg font-semibold">Vocare Panel</h1>
      <div className="flex items-center gap-4">
        {email && <span className="text-sm text-gray-700">{email}</span>}
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Abmelden
        </button>
      </div>
    </header>
  );
}
