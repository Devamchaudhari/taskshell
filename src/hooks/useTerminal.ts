import { useReducer, useState } from "preact/compat";
import taskReducer from "../reducers/taskReducer";

export const useTerminal = () => {
  const [command, setCommand] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [history, setHistory] = useState<{ command: string; output: string }[]>(
    []
  );
  const [tasks, dispatch] = useReducer(taskReducer, []);

  const executeCommand = (command: string) => {
    if (command.startsWith("add")) {
      const task = command.match(/"([^"]+)"/)?.[1];
      if (!task) {
        return `Invalid command format. Use: add "task name"`;
      }
      dispatch({ type: "ADD_TASK", payload: { name: task } });
      return `Task added: ${task}`;
    }

    if (command === "ls") {
      return tasks
        .map(
          (task, index) =>
            `${index + 1}. [${task.status === "done" ? "x" : " "}] ${task.name}`
        )
        .join("\n");
    }

    if (command === "clear") {
      setHistory([]);
      setCommand("");
      return "";
    }

    return "Unknown command.";
  };

  const handleCommand = (cmd: string) => {
    const output = executeCommand(cmd);
    setCommand("");

    if (!output) {
      setHistory([]);
    } else {
      setHistory((prev) => [...prev, { command: cmd, output }]);
    }
  };

  return { command, setCommand, history, handleCommand, tasks, setOutput };
};
