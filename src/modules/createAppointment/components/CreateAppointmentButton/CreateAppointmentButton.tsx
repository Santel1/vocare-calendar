"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateAppointmentModal } from "../CreateAppointmentModal/CreateAppointmentModal";
import { useState } from "react";

export function CreateAppointmentButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="mb-4">
        <Plus className="mr-2 h-4 w-4" /> Termin hinzufügen
      </Button>
      <CreateAppointmentModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
