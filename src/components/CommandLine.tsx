import { FormEvent, useRef } from "preact/compat";

type Props = {
  command: string;
  setCommand: (cmd: string) => void;
  handleCommand: (cmd: string) => void;
};

let showHelperMessage = true;

const CommandLine = ({ command, setCommand, handleCommand }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleCommand(command);
    showHelperMessage = false;

    // keep the input in focus after command submission
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="terminal__commandline">
      <span className="terminal__user">~$</span>
      <form onSubmit={onSubmit} className="terminal__form">
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand((e.target as HTMLInputElement).value)}
          className="terminal__input"
          placeholder={showHelperMessage ? "Type 'help' to get started" : ""} 
        />
      </form>
    </div>
  );
};

export default CommandLine;
