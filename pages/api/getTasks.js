import { MongoClient } from "mongodb";

export default async (req, res) => {
  if (req.method === "GET") {
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
