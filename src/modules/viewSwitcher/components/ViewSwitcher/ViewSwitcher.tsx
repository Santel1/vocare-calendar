"use client";

import { Calendar, List, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewType = "month" | "week" | "list";

interface Props {
  currentView: ViewType;
  onChange: (view: ViewType) => void;
}

export const ViewSwitcher = ({ currentView, onChange }: Props) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={currentView === "month" ? "default" : "outline"}
        onClick={() => onChange("month")}
      >
        <Calendar className="w-4 h-4 mr-2" /> Monat
      </Button>
      <Button
        variant={currentView === "week" ? "default" : "outline"}
        onClick={() => onChange("week")}
      >
        <LayoutList className="w-4 h-4 mr-2" /> Woche
      </Button>
      <Button
        variant={currentView === "list" ? "default" : "outline"}
        onClick={() => onChange("list")}
      >
        <List className="w-4 h-4 mr-2" /> Liste
      </Button>
    </div>
  );
};
