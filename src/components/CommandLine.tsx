import { FormEvent } from "preact/compat";

type Props = {
  command: string;
  setCommand: (cmd: string) => void;
  handleCommand: (cmd: string) => void;
};

const CommandLine = ({ command, setCommand, handleCommand }: Props) => {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleCommand(command);
  };

  return (
    <div className="terminal__commandline">
      <span className="terminal__user">~$</span>
      <form onSubmit={onSubmit} className="terminal__form">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand((e.target as HTMLInputElement).value)}
          className="terminal__input"
        />
      </form>
    </div>
  );
};

export default CommandLine;
