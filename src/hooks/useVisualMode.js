import { useState } from "react";

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  const transition = (newMode, replace = false) => {

    setMode(newMode)

    if (replace) {
      history[history.length - 1] = newMode;
    } else {
      history.push(newMode);
    }

    setHistory([...history]);
  }

  const back = () => {
    if (history.length > 1) {

      history.pop();
      setHistory([...history]);
      setMode(history[history.length - 1]);
    }
  };

  return { mode, transition, back };
};