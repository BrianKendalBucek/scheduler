import React from "react";
import "components/Appointment/styles.scss";
import "components/Appointment/Header";
import "components/Appointment/Show";
import "components/Appointment/Empty";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return <article className="appointment">
    <Header time={props.time} />
    {mode === EMPTY && <Empty onAdd={() => { transition(CREATE) }} />}
    {mode === CREATE && <Form interviewers={props.interviewers} onCancel={() => { back() }} />}
  </article>;
}