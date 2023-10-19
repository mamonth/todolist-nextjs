import { useState, useEffect } from "react";
import { MongoClient } from "mongodb";
import { useRouter } from "next/router";
export default function Home(props) {
  const router = useRouter();
  const [tasksArray, setTasksArray] = useState(props.tasks);
  const [task, setTask] = useState("");
  //useEffect(() => {}, [tasksArray]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getTasks"); // Create an API endpoint to fetch tasks
        if (response.ok) {
          const data = await response.json();
          setTasksArray(data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, []);

  async function deleteIt(item) {
    console.log("delete task with id: ", item.id);
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
    router.push("/");
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
    console.log("this is the response from api/task", data);

    console.log("");
    //router.push("/");
    const updatedTaskArray = [...tasksArray, data.data];
    console.log("Updated task array:", updatedTaskArray);
    setTasksArray(updatedTaskArray);
    setTask("");
  }

  function submitHandler(event) {
    event.preventDefault();
    console.log("task from handler", task);
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
                  console.log("Updated task:", e.target.value);
                }}
              />
              <button
                type="submit"
                className="w-1/3 bg-blue-500 text-white rounded-r p-2 hover:bg-blue-600"
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
              <p className="text-lg">{item.task}</p>
              <div className="space-x-2">
                <button className="p-2 bg-blue-500 text-white hover:bg-blue-600">
                  Edit
                </button>
                <button
                  className="p-2 bg-red-500 text-white hover:bg-red-600"
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
  try {
    const client = await MongoClient.connect(
      "mongodb+srv://admin:pass@cluster0.fh4xile.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp"
    );
    const db = client.db();
    const taskCollection = db.collection("task");
    const tasksDB = await taskCollection.find({}).toArray();
    client.close();

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
