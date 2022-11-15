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
import Status from "./Status";
import Confirm from "./Confirm";

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(res => transition(SHOW));
  }

  function cancel() {
    transition(DELETING);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY));
  };

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return <article className="appointment">
    <Header time={props.time} />
    {mode === EMPTY && <Empty
      onAdd={() => { transition(CREATE) }} />}
    {mode === SHOW && <Show
      student={props.interview?.student}
      interviewer={props.interview?.interviewer}
      onDelete={() => { transition(CONFIRM) }}
      onEdit={() => { transition(EDIT)}} />}
    {mode === CREATE && <Form
      interviewers={props.interviewers}
      onCancel={back}
      onSave={save} />}
    {mode === SAVING && <Status
      message={"Saving"} />}
    {mode === DELETING && <Status
      message={"Deleting"} />}
    {mode === CONFIRM && <Confirm
      message={"Are you sure you would like to delete?"}
      onConfirm={cancel}
      onCancel={back}
    />}
    {mode === EDIT && <Form 
      interviewers={props.interviewers}
      interviewer={props.interview.interviewer.id}
      student={props.interview.student}
      onCancel={back}
      onSave={save} />}
  </article>;
}