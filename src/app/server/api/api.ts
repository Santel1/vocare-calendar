import {
  startOfWeek,
  endOfDay,
  add,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  addDays,
} from "date-fns";
import { supabase } from "@/app/server/utils/supabase/supabase";

export async function getWeeklyAppointments(startDate: Date) {
  const start = startOfWeek(startDate, { weekStartsOn: 1 });
  const ende = endOfDay(add(start, { days: 6 }));

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .gte("start", start.toISOString())
    .lte("start", ende.toISOString());

  if (error) {
    console.error("Fehler beim Laden der Termine:", error);
    return [];
  }

  return data;
}

export async function getAllAppointments() {
  const { data, error } = await supabase.from("appointments").select("*");

  if (error) {
    console.error("Fehler beim Laden der Termine:", error);
    return [];
  }

  return data || [];
}

export function generateMonthMatrix(datum: Date): Date[][] {
  const start = startOfWeek(startOfMonth(datum), { weekStartsOn: 1 }); // Montag
  const ende = endOfWeek(endOfMonth(datum), { weekStartsOn: 1 });

  const wochen: Date[][] = [];
  let aktuell = start;
  while (aktuell <= ende) {
    const woche: Date[] = [];
    for (let i = 0; i < 7; i++) {
      woche.push(aktuell);
      aktuell = addDays(aktuell, 1);
    }
    wochen.push(woche);
  }
  return wochen;
}

export interface AppointmentInput {
  title: string;
  start: Date;
  end: Date;
  location?: string;
  notes?: string;
  patient: string;
  category: string;
}

export async function createAppointment(data: AppointmentInput) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Benutzer nicht authentifiziert");
  }

  const patientId = user.id;
  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .select("id")
    .eq("id", patientId)
    .single();

  if (patientError || !patient) {
    const { error: insertError } = await supabase.from("patients").insert({
      id: patientId,
      created_at: new Date().toISOString(),
      firstname: user.email?.split("@")[0] || "Unbekannt",
      lastname: "",
      birth_date: null,
      care_level: null,
      pronoun: null,
      email: user.email || null,
      phone: null,
      active_since: new Date().toISOString(),
    });
    if (insertError) {
      console.error(
        "Fehler beim Erstellen des Patienten:",
        insertError.message
      );
      throw new Error(insertError.message);
    }
  }

  const categoryId = "4d38eb6d-741e-4611-9b2d-d2a0a23b8727";
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .single();

  if (categoryError || !category) {
    const { error: insertError } = await supabase.from("categories").insert({
      id: categoryId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      label: "Standardkategorie",
      description: "",
      color: "",
      icon: "",
    });
    if (insertError) {
      console.error(
        "Fehler beim Erstellen der Kategorie:",
        insertError.message
      );
      throw new Error(insertError.message);
    }
  }

  const appointmentData = {
    title: data.title,
    start: data.start.toISOString(),
    end: data.end.toISOString(),
    location: data.location || null,
    notes: data.notes || null,
    patient: patientId,
    category: categoryId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("appointments")
    .insert([appointmentData]);

  if (error) {
    console.error("Fehler in Supabase:", error.message);
    if (error.code === "23503") {
      throw new Error(
        "Verstoß gegen Fremdschlüssel: Überprüfen Sie patient oder category"
      );
    }
    throw new Error(error.message);
  }

  return { success: true };
}

export async function deleteAppointment(appointmentId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Benutzer nicht authentifiziert");
  }

  const { data: appointment, error: fetchError } = await supabase
    .from("appointments")
    .select("patient")
    .eq("id", appointmentId)
    .single();

  if (fetchError || !appointment) {
    throw new Error("Termin nicht gefunden");
  }

  if (appointment.patient !== user.id) {
    throw new Error("Sie haben keine Berechtigung, diesen Termin zu löschen");
  }

  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", appointmentId);

  if (error) {
    console.error("Fehler beim Löschen des Termins:", error.message);
    throw new Error(error.message);
  }

  return { success: true };
}
