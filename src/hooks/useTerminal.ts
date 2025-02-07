import { useReducer, useState } from "preact/compat";
import taskReducer from "../reducers/taskReducer";
import moment from "moment";
import { HistoryType, TaskType } from "../types";

export const useTerminal = () => {
  const [command, setCommand] = useState<string>("");
  const [history, setHistory] = useState<HistoryType>([]);

  const loadTasks = (): TaskType[] => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  };

  const [tasks, dispatch] = useReducer(taskReducer, [], loadTasks);

  const executeCommand = (command: string) => {
    // "add" command
    if (command.startsWith("add")) {
      const task = command.match(/"([^"]+)"/)?.[1];
      if (!task) {
        return `Invalid command format. Use: add "task name"`;
      }
      dispatch({ type: "ADD_TASK", payload: { name: task } });
      return `Task added: ${task}`;
    }

    if (command.startsWith("check")) {
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

    // "rm" command
    if (command.startsWith("rm")) {
      if (command === "rm -a") {
        localStorage.removeItem("tasks");
        dispatch({ type: "REMOVE_ALL_TASKS" });
        return "All tasks have been removed.";
      }

      const match = command.match(/#(\d+)/);
      if (!match) {
        return `Invalid command format. Use: rm #taskId (e.g., rm #1)`;
      }

      const taskId = parseInt(match[1], 10);
      if (isNaN(taskId)) {
        return `Invalid task ID. Use a valid number with the format: rm #taskId (e.g., rm #1)`;
      }

      const task = tasks.find((task) => task.id === taskId);
      if (!task) {
        return `Task with ID #${taskId} not found.`;
      }

      dispatch({ type: "REMOVE_TASK", payload: { id: taskId } });
      return `Task removed: ${task.name}`;
    }

    // "cat" command
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
        Task ID: ${task.id}\n
        Task name: ${task.name}\n
        Task status: ${task.status}\n
        Date created: ${moment(task.createdAt).format("Do MMM, YYYY")}
        Date completed: ${
          task.completedAt && moment(task.completedAt).format("Do MMM, YYYY")
        }
        `;
    }

    // "ls" command
    if (command === "ls") {
      const listedTasks = tasks
        .map(
          (task) =>
            `${task.id}. [${task.status === "done" ? "x" : " "}] ${task.name}`
        )
        .join("\n");

      if (!listedTasks) {
        return "<empty list>";
      }

      return listedTasks;
    }

    // "help" command
    if (command === "help") {
      return `
        add "task name" - Add a new task\n
        rm #taskId - Remove a task\n
        cat #taskId - Show info about a task\n
        rm -a - Remove all tasks\n
        check #taskId - Mark the task as done\n
        ls - List all the tasks\n
        clear - Clear the terminal display\n
      `;
    }

    // "clear" command
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
