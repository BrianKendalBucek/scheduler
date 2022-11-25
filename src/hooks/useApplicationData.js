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


  // Function called in book/cancelInterview functions, returns appointments + id and interviewers + name + spots.
  // New variable: Takes the passed in day, and finds all info for it within days.
  // New variable: Save the spots available.
  // Loops through the chosen days appointments and grabs all 5 appointment id's
  // Grabs the info from all 5 appointments attached to that days id and saves as variable
  // If appointment.interview is null, += 1 to spot
  // New variable: Update the spots with the day's info
  // New variable: Created to alter the object that matches the selected day



  const setDay = day => setInterviewState({ ...interviewState, day });
  function spotsRemaining(day, days, appointments) {
    // console.log("0000000000000000", appointments);
    const foundDay = days.find(element => element.name === day);
    // console.log("1111111111111111", foundDay);
    let spots = 0;
    // ???How subtract when appointment deleted???
    for (const appointmentID of foundDay.appointments) {
      // console.log("2222222222222", appointmentID);
      const appointmentsObj = appointments[appointmentID]
      // console.log("3333333333333333333", appointments[appointmentID])
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

      const days = spotsRemaining(interviewState.day, interviewState.days, appointments);

      setInterviewState({
        ...interviewState,
        appointments,
        days
      })
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
