"use client";

import { useState, useEffect } from "react";
import { format, parseISO, isBefore } from "date-fns";
import { Button } from "@/components/ui/button";
import { deleteAppointment } from "@/app/server/api/api";
import { supabase } from "@/app/server/utils/supabase/supabase";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Appointment } from "@/shared/types/types";

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data, error } = await supabase.from("appointments").select("*");
      if (!error && data) {
        const updatedAppointments = data.map((app) =>
          isBefore(parseISO(app.start), new Date()) && !app.completed
            ? { ...app, completed: true }
            : app
        );
        setAppointments(updatedAppointments);
      }
      setLoading(false);
    };
    fetchAppointments();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Möchten Sie diesen Termin wirklich löschen?")) {
      try {
        await deleteAppointment(id);
        setAppointments(appointments.filter((app) => app.id !== id));
      } catch (err) {
        console.error("Fehler beim Löschen:", err);
        alert("Fehler beim Löschen des Termins: " + (err as Error).message);
      }
    }
  };

  const toggleCompleted = async (id: string, completed: boolean) => {
    try {
      await supabase
        .from("appointments")
        .update({ completed: !completed })
        .eq("id", id);
      setAppointments(
        appointments.map((app) =>
          app.id === id ? { ...app, completed: !completed } : app
        )
      );
    } catch (err) {
      console.error("Fehler beim Aktualisieren:", err);
      alert("Fehler beim Markieren des Termins: " + (err as Error).message);
    }
  };

  if (loading) return <div>Lädt...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Alle Termine</h2>
      <ul className="space-y-2">
        {appointments.map((a) => (
          <li
            key={a.id}
            className={cn(
              "border border-gray-300 rounded p-2 shadow-sm flex justify-between items-center",
              a.completed && "bg-green-100"
            )}
          >
            <div>
              <div
                className={cn("font-semibold", a.completed && "line-through")}
              >
                {a.title}
              </div>
              <div
                className={cn(
                  "text-sm text-gray-600",
                  a.completed && "line-through"
                )}
              >
                {format(parseISO(a.start), "dd.MM.yyyy HH:mm")} –{" "}
                {format(parseISO(a.end), "HH:mm")}
              </div>
              {a.notes && (
                <div className={cn("text-sm", a.completed && "line-through")}>
                  {a.notes}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCompleted(a.id, !!a.completed)}
              >
                <Check
                  className={cn("h-4 w-4", a.completed && "text-green-500")}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(a.id)}
              >
                ✕
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
