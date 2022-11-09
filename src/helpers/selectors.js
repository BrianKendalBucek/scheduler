
export function getAppointmentsForDay(state, day) {

  const dayAppointments = [];

  const filterDay = state.days.find(selectedDay => selectedDay.name === day);

  if (!filterDay) {
    return [];
  }

  for (const appointmentID of filterDay.appointments) {
    if (state.appointments[appointmentID]) {
      dayAppointments.push(state.appointments[appointmentID])
    }
  }
  return dayAppointments; 

}