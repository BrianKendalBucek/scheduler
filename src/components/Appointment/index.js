import React from "react";
import "components/Appointment/styles.scss";
import "components/Appointment/Header";
import "components/Appointment/Show";
import "components/Appointment/Empty";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";


export default function Appointment(props) {
  console.log("++++++++++++++++++++", props);
  return <article className="appointment">
    <Header time={ props.time } />
    { props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer} /> : <Empty /> }
  </article>;
}

