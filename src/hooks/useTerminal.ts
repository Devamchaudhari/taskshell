import { useReducer, useState } from "preact/compat";
import taskReducer from "../reducers/taskReducer";
import moment from "moment";
import { HistoryType } from "../types";

export const useTerminal = () => {
  const [command, setCommand] = useState<string>("");
  const [history, setHistory] = useState<HistoryType>([]);
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

    if (command.startsWith("mark")) {
      const match = command.match(/#(\d+)/);
      if (!match) {
        return `Invalid command format. Use: check #taskId (e.g., check #1)`;
      }

      const taskId = parseInt(match[1], 10);
      if (isNaN(taskId)) {
        return `Invalid task ID. Use a valid number with the format: check #taskId (e.g., check #1)`;
      }

      const task = tasks.find((task) => task.id === taskId);
      if (!task) {
        return `Task with ID #${taskId} not found.`;
      }

      dispatch({ type: "MARK_DONE", payload: { id: taskId } });
      return `Task marked as done: ${task.name}`;
    }

    if (command.startsWith("cat")) {
      const match = command.match(/#(\d+)/);
      if (!match) {
        return `Invalid command format. Use: cat #taskId (e.g., check #1)`;
      }

      const taskId = parseInt(match[1], 10);
      if (isNaN(taskId)) {
        return `Invalid task ID. Use a valid number with the format: cat #taskId (e.g., cat #1)`;
      }

      const task = tasks.find((task) => task.id === taskId);
      if (!task) {
        return `Task with ID #${taskId} not found.`;
      }

      return `
        Task name: ${task.name}\n
        Task status: ${task.status}\n
        Date created: ${moment(task.createdAt).format("Do MMM, YYYY")}
        Date completed: ${
          task.completedAt && moment(task.completedAt).format("Do MMM, YYYY")
        }
        `;
    }

    if (command === "ls") {
      return tasks
        .map(
          (task) =>
            `${task.id}. [${task.status === "done" ? "x" : " "}] ${task.name}`
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

  return { command, setCommand, history, handleCommand, tasks };
};
