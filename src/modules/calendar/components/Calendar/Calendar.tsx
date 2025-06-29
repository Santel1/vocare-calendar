import AppointmentsList from "../AppointmentsList/AppointmentsList";
import MonthCalendar from "../MonthCalendar/MonthCalendar";
import WeekCalendar from "../WeekCalendar/WeekCalendar";

export interface CalendarProps {
  view: "month" | "week" | "list";
}

export default function Calendar({ view }: CalendarProps) {
  const renderView = () => {
    switch (view) {
      case "month":
        return <MonthCalendar />;
      case "week":
        return <WeekCalendar />;
      case "list":
        return <AppointmentsList />;
      default:
        return <MonthCalendar />;
    }
  };

  return <div>{renderView()}</div>;
}
