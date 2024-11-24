import React from "preact/compat";
import { HistoryType } from "../types";

type Props = {
  history: HistoryType;
};

const History = ({ history }: Props) => (
  <div className="terminal__history">
    {history.map(({ command, output }, index) => (
      <React.Fragment key={index}>
        <div className="terminal__commandline">
          <span className="terminal__user">~$</span>
          <span className="terminal__command">{command}</span>
        </div>
        <div className="terminal__output">
          {output.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </React.Fragment>
    ))}
  </div>
);

export default History;
