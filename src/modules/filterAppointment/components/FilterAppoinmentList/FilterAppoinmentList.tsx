"use client";

import { deleteAppointment } from "@/app/server/api/api";
import { supabase } from "@/app/server/utils/supabase/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, isBefore, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Appointment } from "@/shared/types/types";

export interface FilterAppoinmentListProps {
  showFilter: boolean;
}

export default function FilterAppoinmentList({
  showFilter,
}: FilterAppoinmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data, error } = await supabase.from("appointments").select("*");
      if (!error && data) setAppointments(data);
    };
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((app) => {
    const startDate = new Date(app.start);
    const matchesDateFrom =
      !filterDateFrom || startDate >= new Date(filterDateFrom);
    const matchesDateTo = !filterDateTo || startDate <= new Date(filterDateTo);
    return matchesDateFrom && matchesDateTo;
  });

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

  return (
    <div>
      {showFilter && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              type="date"
              placeholder="Datum von"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
            <Input
              type="date"
              placeholder="Datum bis"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
            />
          </div>
          <ul className="space-y-2">
            {filteredAppointments.map((a) => {
              const isPast = isBefore(parseISO(a.start), new Date());
              return (
                <li
                  key={a.id}
                  className="border border-gray-300 rounded p-2 flex justify-between items-center"
                >
                  <div>
                    <div
                      className={cn("font-semibold", isPast && "line-through")}
                    >
                      {a.title}
                    </div>
                    <div
                      className={cn(
                        "text-sm text-gray-600",
                        isPast && "line-through"
                      )}
                    >
                      {format(parseISO(a.start), "dd.MM.yyyy HH:mm")} –{" "}
                      {format(parseISO(a.end), "HH:mm")}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(a.id)}
                  >
                    ✕
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
