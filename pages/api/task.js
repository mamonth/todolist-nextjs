import { DB } from '@/libs/DB';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  let data = req.body;
  console.log("this is the sent task", data);
  try {
    const db = await DB.connect();
    const taskCollection = db.collection("task");
    const result = await taskCollection.insertOne(data);

    console.log("this is the result of inserting task", result);
    res.status(201).json({
      message: "Task inserted",
      data: { task: data.task, id: data._id.toString() },
    });
  } catch (error) {
    console.error("Error while inserting task:", error);
    res
      .status(500)
      .json({ error: "An error occurred while inserting the task" });
  }
}
