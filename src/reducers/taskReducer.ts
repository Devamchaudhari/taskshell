import { ActionType, TasksType, TaskType } from "../types";

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

    case "MARK_DONE":
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, state: "done", completedAt: new Date() }
          : task
      );

    case "REMOVE_TASK":
      return state.filter((task) => task.id !== action.payload.id);

    default:
      return state;
  }
};

export default taskReducer;
