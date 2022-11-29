import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {

  const [interviewState, setInterviewState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setInterviewState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, []);

  const setDay = day => setInterviewState({ ...interviewState, day });
  function spotsRemaining(day, days, appointments) {

    const foundDay = days.find(element => element.name === day);

    let spots = 0;

    for (const appointmentID of foundDay.appointments) {

      const appointmentsObj = appointments[appointmentID]

      if (!appointmentsObj.interview) {
        spots += 1;
      }
    }
    let newDayObj = { ...foundDay, spots }
    let newDaysArray = days.map(element => element.name === day ? newDayObj : element);

    return newDaysArray;
  }

  function bookInterview(id, interview) {

    const appointment = {
      ...interviewState.appointments[id],
      interview: { ...interview }
    }

    const appointments = {
      ...interviewState.appointments,
      [id]: appointment
    }

    return axios.put(`/api/appointments/${id}`, { interview }).then(res => {

      // if (res) {
        const days = spotsRemaining(interviewState.day, interviewState.days, appointments);
  
        setInterviewState({
          ...interviewState,
          appointments,
          days
        })
      // }
    });
  };

  function cancelInterview(id) {

    const appointment = {
      ...interviewState.appointments[id],
      interview: null
    }

    const appointments = {
      ...interviewState.appointments,
      [id]: appointment
    }

    return axios.delete(`/api/appointments/${id}`)

      .then(res => {

        const days = spotsRemaining(interviewState.day, interviewState.days, appointments);

        setInterviewState({
          ...interviewState,
          appointments,
          days
        });
      });
  };

  return {
    interviewState,
    setDay,
    bookInterview,
    cancelInterview
  }
}
