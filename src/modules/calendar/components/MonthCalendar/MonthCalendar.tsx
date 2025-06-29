"use client";

import { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isBefore,
  parseISO,
} from "date-fns";
import { generateMonthMatrix } from "@/app/server/api/api";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { deleteAppointment } from "@/app/server/api/api";
import { supabase } from "@/app/server/utils/supabase/supabase";
import { Appointment } from "@/shared/types/types";

export default function MonthCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const weeks = generateMonthMatrix(currentDate);

  useEffect(() => {
    const fetchAppointments = async () => {
      const start = format(weeks[0][0], "yyyy-MM-dd");
      const end = format(weeks[weeks.length - 1][6], "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .gte("start", `${start}T00:00:00`)
        .lte("start", `${end}T23:59:59`);
      if (!error && data) {
        const updatedAppointments = data.map((appointment) =>
          isBefore(parseISO(appointment.start), new Date()) &&
          !appointment.completed
            ? { ...appointment, completed: true }
            : appointment
        );
        setAppointments(updatedAppointments);
      }
    };
    fetchAppointments();
  }, [currentDate]);

  const handlePrev = () => setCurrentDate((prev) => subMonths(prev, 1));
  const handleNext = () => setCurrentDate((prev) => addMonths(prev, 1));

  const handleDelete = async (id: string) => {
    if (confirm("Möchten Sie diesen Termin wirklich löschen?")) {
      try {
        await deleteAppointment(id);
        setAppointments(
          appointments.filter((appointment) => appointment.id !== id)
        );
      } catch (err) {
        console.error("Fehler beim Löschen:", err);
        alert("Fehler beim Löschen des Termins: " + (err as Error).message);
      }
    }
  };

  const appointmentsByDate = appointments.reduce<Record<string, Appointment[]>>(
    (acc, appointment) => {
      const dateKey = format(new Date(appointment.start), "yyyy-MM-dd");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(appointment);
      return acc;
    },
    {}
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Button onClick={handlePrev} variant="outline" size="sm">
          Vorheriger Monat
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Button onClick={handleNext} variant="outline" size="sm">
          Nächster Monat
        </Button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {weeks.flat().map((day, i) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const dayAppointments = appointmentsByDate[dayKey] || [];
          return (
            <div
              key={i}
              className={cn(
                "border rounded h-24 p-1 text-left relative overflow-hidden",
                !isSameMonth(day, currentDate) && "bg-gray-100 text-gray-400",
                isSameDay(day, new Date()) && "border-blue-500"
              )}
            >
              <div className="text-xs font-semibold">{format(day, "d")}</div>
              <div className="flex flex-col gap-0.5 mt-1">
                {dayAppointments.map((appointment) => {
                  const isPast = isBefore(
                    parseISO(appointment.start),
                    new Date()
                  );
                  return (
                    <HoverCard key={appointment.id}>
                      <HoverCardTrigger asChild>
                        <div className="text-[10px] truncate cursor-pointer bg-blue-100 text-blue-800 rounded px-1 relative group">
                          <span className={cn({ "line-through": isPast })}>
                            {appointment.title}
                          </span>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="text-xs">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-4 w-4 p-0 absolute right-1 top-1 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(appointment.id);
                          }}
                        >
                          ✕
                        </Button>
                        <div>
                          <strong className={cn({ "line-through": isPast })}>
                            {appointment.title}
                          </strong>
                        </div>
                        <div className={cn({ "line-through": isPast })}>
                          {format(new Date(appointment.start), "HH:mm")} –{" "}
                          {format(new Date(appointment.end), "HH:mm")}
                        </div>
                        {appointment.notes && (
                          <div
                            className={cn(
                              { "line-through": isPast },
                              "mt-1 text-gray-600"
                            )}
                          >
                            {appointment.notes}
                          </div>
                        )}
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
