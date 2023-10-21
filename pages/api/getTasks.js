import {DB} from '@/libs/DB';

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      const db = await DB.connect();
      const taskCollection = db.collection("task");
      const tasksDB = await taskCollection.find({}).toArray();

      const tasks = tasksDB.map((task) => ({
        task: task.task,
        id: task._id.toString(),
      }));

      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error in api/getTasks:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching tasks." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
