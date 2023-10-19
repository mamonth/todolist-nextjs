import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  let client;
  if (req.method === "POST") {
    let data = req.body;
    console.log("this is the sent task", data);
    try {
      client = await MongoClient.connect(
        "mongodb+srv://admin:pass@cluster0.fh4xile.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp"
      );
      const db = client.db();
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
    } finally {
      client.close();
    }
  } else {
    res.status(405).end();
  }
}
