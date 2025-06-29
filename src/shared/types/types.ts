export interface Appointment {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  notes?: string;
  patient: string;
  category: string;
  created_at: string;
  updated_at: string;
  completed?: boolean;
}
