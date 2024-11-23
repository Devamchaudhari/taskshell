import { FormEvent, useReducer, useState } from "preact/compat";

type TaskType = {
  id: number;
  name: string;
  status: "done" | "pending";
  createdAt: Date;
  completedAt: Date | null;
};

type TasksType = TaskType[];

type ActionType =
  | { type: "ADD_TASK"; payload: { name: string } }
  | { type: "MARK_DONE"; payload: { id: number } }
  | { type: "REMOVE_TASK"; payload: { id: number } };

const taskReducer = (state: TasksType, action: ActionType): TasksType => {
  switch (action.type) {
    case "ADD_TASK":
      const newTask: TaskType = {
        id: Date.now(),
        name: action.payload.name,
        status: "pending",
        createdAt: new Date(),
        completedAt: null,
      };

      return [...state, newTask];

    default:
      return state;
  }
};

const App = () => {
  const [command, setCommand] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [history, setHistory] = useState([
    {
      command: `add "Buy groceries"`,
      output: "Task added: Buy groceries",
    },
    {
      command: `add “Update portfolio”`,
      output: "Task added: Update portfolio",
    },
    {
      command: "ls",
      output: `1. [ ] Buy groceries\n  2. [ ] Update portfolio`,
    },
  ]);

  const handleAddTask = (name: string) => {
    dispatch({ type: "ADD_TASK", payload: { name } });
  };

  // const handleMarkDone = (id: number) => {
  //   dispatch({ type: "MARK_DONE", payload: { id } });
  // };

  // const handleRemoveTask = (id: number) => {
  //   dispatch({ type: "REMOVE_TASK", payload: { id } });
  // };

  const commandOutput = (command: string) => {
    if (command.startsWith("add")) {
      const task = command.match(/"([^"]+)"/)?.[1];

      if (!task) {
        setOutput(`Invalid command format. Use: add "task name"`);
        return output;
      }

      handleAddTask(task);
      console.log(tasks);
      setOutput(`Task added: ${task}`);
    }

    console.log(output);
    return output;
  };

  const handleCommand = (e: FormEvent) => {
    e.preventDefault();

    if (command === "clear") {
      setHistory([]);
      setCommand("");
      return;
    }

    const newEntry = {
      command,
      output: commandOutput(command),
    };

    setHistory((prev) => [...prev, newEntry]);
    setCommand("");
  };

  return (
    <div className="terminal-container">
      <div className="terminal__history">
        {history.map(({ command, output }) => (
          <>
            <div className="terminal__commandline">
              <span className="terminal__user">~$</span>
              <span className="terminal__command">{command}</span>
            </div>
            <div className="terminal__output">
              <p>
                {output.split("\n").map((line) => (
                  <>
                    {line}
                    <br />
                  </>
                ))}
              </p>
            </div>
          </>
        ))}
      </div>
      <div className="terminal__commandline">
        <span className="terminal__user">~$</span>
        <form onSubmit={handleCommand} className="terminal__form">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand((e.target as HTMLInputElement).value)}
            className="terminal__input"
          />
        </form>
      </div>
    </div>
  );
};

export default App;
