"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/server/utils/supabase/supabase";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Fehler beim Überprüfen der Session:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/calendar");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">Laden...</div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Willkommen bei Vocare!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Organisieren Sie Ihre Termine einfach und effizient. Möchten Sie unser
          Kalender-Tool ausprobieren?
        </p>
        <div className="space-x-4">
          <Button
            onClick={() => router.push("/login")}
            className="bg-blue-400 text-white"
          >
            Einloggen
          </Button>
          <Button onClick={() => router.push("/register")} variant="outline">
            Registrieren
          </Button>
        </div>
      </div>
    </div>
  );
}
