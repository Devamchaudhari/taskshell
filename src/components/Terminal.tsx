import CommandLine from "./CommandLine";
import History from "./History";
import { useTerminal } from "../hooks/useTerminal";

const Terminal = () => {
  const { command, setCommand, history, handleCommand } = useTerminal();

  return (
    <div className="terminal-container">
      <History history={history} />
      <CommandLine
        command={command}
        setCommand={setCommand}
        handleCommand={handleCommand}
      />
    </div>
  );
};

export default Terminal;
