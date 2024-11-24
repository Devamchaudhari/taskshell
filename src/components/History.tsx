type Props = {
  history: { command: string; output: string }[];
};

const History = ({ history }: Props) => (
  <div className="terminal__history">
    {history.map(({ command, output }, index) => (
      <div key={index}>
        <div className="terminal__commandline">
          <span className="terminal__user">~$</span>
          <span className="terminal__command">{command}</span>
        </div>
        <div className="terminal__output">
          {output.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default History;
