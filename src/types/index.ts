export type HistoryType = {
  command: string;
  output: string;
}[];

export type TaskType = {
  id: number;
  name: string;
  status: "done" | "pending";
  createdAt: Date;
  completedAt: Date | null;
};

export type TasksType = TaskType[];

export type ActionType =
  | { type: "ADD_TASK"; payload: { name: string } }
  | { type: "MARK_DONE"; payload: { id: number } }
  | { type: "REMOVE_TASK"; payload: { id: number } }
  | { type: "REMOVE_ALL_TASKS" };
