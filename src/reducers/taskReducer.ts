import { ActionType, TaskType } from "../types";

let retrievedId = localStorage.getItem("taskIdCounter");
let taskIdCounter = retrievedId ? parseInt(retrievedId, 10) : 1;

const taskReducer = (state: TaskType[], action: ActionType): TaskType[] => {
  let updatedState = state;

  switch (action.type) {
    case "ADD_TASK":
      const newTask: TaskType = {
        id: taskIdCounter,
        name: action.payload.name,
        status: "pending",
        createdAt: new Date(),
        completedAt: null,
      };

      taskIdCounter++;
      localStorage.setItem("taskIdCounter", JSON.stringify(taskIdCounter));

      updatedState = [...state, newTask];
      break;

    case "MARK_DONE":
      updatedState = state.map((task) =>
        task.id === action.payload.id
          ? { ...task, status: "done", completedAt: new Date() }
          : task
      );
      break;

    case "REMOVE_TASK":
      updatedState = state.filter((task) => task.id !== action.payload.id);

      if (updatedState.length === 0) {
        taskIdCounter = 1;
        localStorage.setItem("taskIdCounter", "1");
      }
      break;

    case "REMOVE_ALL_TASKS":
      updatedState = [];
      taskIdCounter = 1;
      localStorage.setItem("taskIdCounter", "1");
      localStorage.removeItem("tasks");
      break;

    default:
      return state;
  }

  localStorage.setItem("tasks", JSON.stringify(updatedState));
  return updatedState;
};

export default taskReducer;
