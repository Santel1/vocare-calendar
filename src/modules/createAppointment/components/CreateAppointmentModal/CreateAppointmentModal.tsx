"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createAppointment } from "@/app/server/api/api";
import { supabase } from "@/app/server/utils/supabase/supabase";

export function CreateAppointmentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Bitte melden Sie sich an");
      return;
    }
    if (!title || !date || !startTime || !endTime) {
      alert("Bitte füllen Sie die Pflichtfelder aus");
      return;
    }

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    try {
      await createAppointment({
        title,
        start,
        end,
        location,
        notes,
        patient: user.id,
        category: "4d38eb6d-741e-4611-9b2d-d2a0a23b8727",
      });

      setTitle("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setLocation("");
      setNotes("");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Fehler beim Erstellen des Termins: " + (err as Error).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terminverwaltung</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="flex gap-2">
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <Input
          placeholder="Ort"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Textarea
          placeholder="Notizen"
          value={notes}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setNotes(e.target.value)
          }
        />
        <Button onClick={handleSubmit} className="w-full mt-4">
          Erstellen
        </Button>
      </DialogContent>
    </Dialog>
  );
}
