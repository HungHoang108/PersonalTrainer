import { useContext } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import moment from "moment";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { TrainingContext } from "../context/TrainingContext";

import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

moment.locale();

const CalendarPage = () => {
  const { training } = useContext(TrainingContext);
  // const formats = {
  //   dateFormat: "1",
  //   dayHeaderFormat: "2",
  //   eventTimeRangeFormat: ({ start, end }) =>
  //     `${moment(start).format("h:mm A")} - ${moment(end).format("h:mm A")}`,
  // };
  const traningEvents = training.map((item) => {
    return {
      id: item.id,
      title: item.customer
        ? `${item.activity} / ${item.customer.firstname} ${item.customer.lastname}`
        : "null",
      start: new Date(item.date),
      end: new Date(moment(item.date).add(item.duration, "minutes")),
      allDay: false,
    };
  });
  return (
    <Calendar
      // titleAccessor={"hello"}
      // formats={formats}
      localizer={localizer}
      events={traningEvents}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500, margin: "50px" }}
    />
  );
};

export default CalendarPage;
