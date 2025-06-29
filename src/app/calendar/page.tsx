import { ProtectedRoute } from "@/app/server/utils/auth/ProtectedRoute";
import { CalendarWrapper } from "@/modules/calendarWrapper/components/CalendarWrapper/CalendarWrapper";

import { Navbar } from "@/modules/navBar/components/NavBar/NavBar";
import React from "react";

export default function Page() {
  return (
    <ProtectedRoute>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div className="flex-1">
          <CalendarWrapper />
        </div>
      </div>
    </ProtectedRoute>
  );
}
