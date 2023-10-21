import { ObjectId } from "mongodb";
import {DB} from '@/libs/DB';

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
    const db = await DB.connect();
    const taskCollection = db.collection("task");

    const updatedTask = {
      task: task,
    };
    console.log("this is updatedTask", updatedTask);

    await taskCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedTask }
    );

    res.status(200).json({
      message: "Task updated successfully",
      data: { id: id, task: updatedTask.task },
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
