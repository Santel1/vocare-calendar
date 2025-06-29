"use client";

import { Button } from "@/components/ui/button";
import Calendar from "@/modules/calendar/components/Calendar/Calendar";
import { CreateAppointmentButton } from "@/modules/createAppointment/components/CreateAppointmentButton/CreateAppointmentButton";
import FilterAppoinmentList from "@/modules/filterAppointment/components/FilterAppoinmentList/FilterAppoinmentList";
import { ViewSwitcher } from "@/modules/viewSwitcher/components/ViewSwitcher/ViewSwitcher";
import { useState } from "react";

export const CalendarWrapper = () => {
  const [view, setView] = useState<"month" | "week" | "list">("month");
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Kalender</h1>
      <div className="flex justify-between items-center mb-4">
        <ViewSwitcher currentView={view} onChange={setView} />
        <div className="flex gap-2">
          <CreateAppointmentButton />
          <Button onClick={() => setShowFilter(!showFilter)}>
            {showFilter ? "Filter ausblenden" : "Filter anzeigen"}
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Calendar view={view} />
        </div>
        {showFilter && (
          <div className="w-full md:w-1/3">
            <FilterAppoinmentList showFilter={showFilter} />
          </div>
        )}
      </div>
    </div>
  );
};
