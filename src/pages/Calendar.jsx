import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import moment from "moment";
import myEventsList from "../components/fakedata";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
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
const test = moment("2023-02-09T11:05:25.549+00:00").add(10, "minutes")
console.log(test)

  const [training, setTraining] = useState([]);

  useEffect(() => {
    getTrainingData();
  }, []);

  const getTrainingData = async () => {
    const getTraining = await axios.get(
      "https://traineeapp.azurewebsites.net/gettrainings"
    );
    const data = getTraining.data;
    setTraining(data);
  };
  const traningEvents = training.map((item) => {
    return {
      id: item.id,
      title: `${item.activity} / ${item.customer.firstname} ${item.customer.lastname}`,
      start: new Date(item.date),
      end: moment(item.date).add(item.duration, "minutes"),
      allDay: false,
    };
  });
  return (
    <Calendar
      localizer={localizer}
      events={traningEvents}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500, margin: "50px" }}
    />
  );
};

export default CalendarPage;
