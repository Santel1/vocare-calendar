"use client";
import React, { useState, useEffect } from "react";
import {
  startOfToday,
  format,
  eachDayOfInterval,
  isToday,
  add,
  startOfWeek,
  parseISO,
  isSameDay,
  getHours,
  isBefore,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { supabase } from "@/app/server/utils/supabase/supabase";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import { deleteAppointment } from "@/app/server/api/api";
import { Appointment } from "@/shared/types/types";

export default function WeekCalendar() {
  const today = startOfToday();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [weekStartDate, setWeekStartDate] = useState(
    startOfWeek(today, { weekStartsOn: 1 })
  );
  const week = eachDayOfInterval({
    start: weekStartDate,
    end: add(weekStartDate, { days: 6 }),
  });
  const hours = Array.from({ length: 24 }, (_, i) => i);

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
    };
    fetchAppointments();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Möchten Sie diesen Termin wirklich löschen?")) {
      try {
        await deleteAppointment(id);
        setAppointments(appointments.filter((term) => term.id !== id));
      } catch (err) {
        console.error("Fehler beim Löschen:", err);
        alert("Fehler beim Löschen des Termins: " + (err as Error).message);
      }
    }
  };

  const nextWeek = () => setWeekStartDate((prev) => add(prev, { weeks: 1 }));
  const prevWeek = () => setWeekStartDate((prev) => add(prev, { weeks: -1 }));
  const toCurrentWeek = () =>
    setWeekStartDate(startOfWeek(today, { weekStartsOn: 1 }));

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <Button onClick={prevWeek} variant="outline" size="sm">
          Vorherige Woche
        </Button>
        <Button onClick={toCurrentWeek} variant="outline" size="sm">
          Aktuelle Woche
        </Button>
        <Button onClick={nextWeek} variant="outline" size="sm">
          Nächste Woche
        </Button>
      </div>
      <div className="grid grid-cols-[80px_repeat(7,minmax(150px,1fr))] gap-1">
        <div className="bg-gray-100 p-2 text-sm font-bold border border-gray-300">
          Zeit
        </div>
        {week.map((day) => (
          <div
            key={day.toString()}
            className={clsx(
              "bg-gray-100 p-2 text-sm font-bold border border-gray-300 text-center",
              isToday(day) && "bg-indigo-300"
            )}
          >
            {format(day, "EEEE, dd. MMMM")}
          </div>
        ))}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="border border-gray-200 text-xs p-1 text-right pr-2">{`${hour}:00`}</div>
            {week.map((day) => {
              const appointment = appointments.find(
                (a) =>
                  isSameDay(parseISO(a.start), day) &&
                  getHours(parseISO(a.start)) === hour
              );
              const isPast =
                appointment &&
                isBefore(parseISO(appointment.start), new Date());
              return (
                <div
                  key={day.toString() + hour}
                  className={clsx(
                    "border border-gray-200 min-h-20 p-1 relative",
                    appointment && "bg-blue-100 text-black"
                  )}
                >
                  {appointment && (
                    <div className="text-sm font-medium">
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
                      <span className={cn({ "line-through": isPast })}>
                        {appointment.title}
                      </span>
                      <div className={cn({ "line-through": isPast })}>
                        {format(parseISO(appointment.start), "HH:mm")} –{" "}
                        {format(parseISO(appointment.end), "HH:mm")}
                      </div>
                      {appointment.notes && (
                        <div
                          className={cn({ "line-through": isPast }, "text-xs")}
                        >
                          {appointment.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
