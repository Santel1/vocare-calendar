"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import FilterAppoinmentList from "../FilterAppoinmentList/FilterAppoinmentList";

export function FilterAppointmentsButton() {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="">
      <Button onClick={() => setShowFilter(!showFilter)} className="">
        {showFilter ? "Filter ausblenden" : "Filter anzeigen"}
      </Button>
      <FilterAppoinmentList showFilter={showFilter} />
    </div>
  );
}
