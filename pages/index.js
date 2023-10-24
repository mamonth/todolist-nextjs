import { useState, useEffect } from "react";

export default function Home(props) {
  const [editedTask, setEditedTask] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [tasksArray, setTasksArray] = useState(props.tasks);
  const [task, setTask] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getTasks"); // Create an API endpoint to fetch tasks
        if (response.ok) {
          const data = await response.json();
          setTasksArray(data);
        }
        console.log(
          "this is taskArray coming as response from backend",
          tasksArray
        );
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, []);

  async function deleteIt(item) {
    const id = item.id;
    try {
      const response = await fetch(`/api/delete?id=${id}`, {
        method: "DELETE",
      });
      const updatedArray = tasksArray.filter((task) => task.id !== id);
      setTasksArray(updatedArray);
    } catch (error) {
      console.log(error);
    }
  }

  async function sendItToDb() {
    const response = await fetch("/api/task", {
      method: "POST",
      body: JSON.stringify({ task }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    const updatedTaskArray = [...tasksArray, data.data];
    setTasksArray(updatedTaskArray);
    setTask("");
  }

  async function editIt(item) {
    console.log("this is from editIt", item);
    setEditedTask(item);
    setSelectedItemId(item.id);
  }

  async function saveIt(item) {
    try {
      console.log("this item is from saveIt", item);

      console.log("edited Task", editedTask);
      const response = await fetch(`/api/save?id=${item.id}`, {
        method: "PUT",
        body: JSON.stringify({ _id: editedTask.id, task: editedTask.task }),
      });
      const data = await response.json();
      console.log("this is the response from db after saveIt", data);
      const newArray = tasksArray.map((item) =>
        item.id === data.data.id ? (item = data.data) : item
      );

      setTasksArray(newArray);
      console.log("trying my best", tasksArray, data.data);

      if (response.ok) {
        setSelectedItemId(""); // Reset selectedItemId to exit edit mode
      } else {
        console.error("Error saving task:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }
  }

  function submitHandler(event) {
    event.preventDefault();
    //
    if (task.trim() !== "") {
      sendItToDb(task);
      setTask("");
    }
  }
  return (
    <>
      <div className="bg-gray-100 p-8">
        <div className="max-w-md mx-auto bg-white rounded p-4 shadow-md">
          <h1 className="text-2xl font-semibold mb-4">To-Do List</h1>
          <form onSubmit={submitHandler}>
            <div className="flex mb-4">
              <input
                type="text"
                className="w-2/3 p-2 rounded-l border border-gray-300"
                placeholder="Add a new task"
                name="task"
                id="task"
                value={task}
                onChange={(e) => {
                  setTask(e.target.value);
                }}
              />
              <button
                type="submit"
                className="w-1/3 bg-blue-500 text-white rounded-r p-2 hover:bg-blue-600 rounded-lg"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
      <div>
        <ul className="divide-y divide-gray-300">
          {tasksArray.map((item, key) => (
            <li
              key={key}
              className="flex items-center justify-between py-2 pl-4 pr-1"
            >
              {selectedItemId === item.id ? (
                <input
                  type="text"
                  className="w-2/3 p-2 rounded-l border border-gray-300"
                  name="edit-task"
                  id="edit-task"
                  // value={editedTask === "" ? item.task : editedTask}
                  value={editedTask.task || ""}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, task: e.target.value })
                  }
                  //onChange={(e) => console.log(e.target.value)}
                />
              ) : (
                <p className="text-lg">{item.task}</p>
              )}

              <div className="space-x-2">
                {selectedItemId === item.id ? (
                  <button
                    className="p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
                    onClick={() => saveIt(item)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
                    onClick={() => editIt(item)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="p-2 bg-red-500 text-white hover:bg-red-600 rounded-lg"
                  onClick={() => deleteIt(item)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const {DB} = await import( '@/libs/DB' )

  try {
    const db = await DB.connect();
    const taskCollection = db.collection("task");
    const tasksDB = await taskCollection.find({}).toArray();

    const tasks = tasksDB.map((task) => ({
      task: task.task,
      id: task._id.toString(),
    }));

    return {
      props: {
        tasks: tasks,
      },
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        tasks: [],
      },
    };
  }
}

[
  "SIGHUP",
  "SIGINT",
  "SIGQUIT",
  "SIGILL",
  "SIGTRAP",
  "SIGABRT",
  "SIGBUS",
  "SIGFPE",
  "SIGUSR1",
  "SIGSEGV",
  "SIGUSR2",
  "SIGTERM",
].forEach(function (sig) {
  process.on(sig, function () {
    DB.closeConnection();
  });
});
