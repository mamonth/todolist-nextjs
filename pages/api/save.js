import { MongoClient, ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).end(); // Method Not Allowed
  }

  const id = req.query.id;
  const { task } = JSON.parse(req.body);
  console.log("req body", req.body);

  console.log("this is id and task", id, task);
  let client;
  try {
    client = await MongoClient.connect(
      "mongodb+srv://admin:pass@cluster0.fh4xile.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp"
    );
    const db = client.db();
    const taskCollection = db.collection("task");

    const updatedTask = {
      task: task,
    };
    console.log("this is updatedTask", updatedTask);

    await taskCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedTask }
    );

    client.close();

    res.status(200).json({
      message: "Task updated successfully",
      data: { id: id, task: updatedTask.task },
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
