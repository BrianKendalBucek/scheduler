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
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      setInterviewState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, []);
  
  const setDay = day => setInterviewState({ ...interviewState, day });
  
  function bookInterview(id, interview) {
  
    console.log("**********123*");
    return axios.put(`/api/appointments/${id}`, { interview }).then(res => {
      const appointment = {
        ...interviewState.appointments[id],
        interview: { ...interview }
      }
  
      const appointments = {
        ...interviewState.appointments,
        [id]: appointment
      }
      setInterviewState({
        ...interviewState,
        appointments
      })
    });
  };
  
  function cancelInterview(id) {
  
    return axios.delete(`/api/appointments/${id}`)
      .then(res => {
        const appointment = {
          ...interviewState.appointments[id],
          interview: null
        }
  
        const appointments = {
          ...interviewState.appointments,
          [id]: appointment
        }
  
        setInterviewState({
          ...interviewState,
          appointments
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
