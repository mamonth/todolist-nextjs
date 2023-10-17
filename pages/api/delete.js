// import { MongoClient, ObjectId } from "mongodb";

// export default async function handler(req, res) {
//   let client;
//   if (req.method === "DELETE") {
//     const data = req.body;
//     console.log("this is data from handler", data);
//     const id = data.id;

//     try {
//       client = await MongoClient.connect(
//         "mongodb+srv://admin:pass@cluster0.fh4xile.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp"
//       );
//       const db = client.db();
//       const collection = db.collection("task");

//       const result = await collection.deleteOne({ _id: new ObjectId(id) });
//       console.log("deleted", result);
//     } catch (error) {
//       console.error("Error while finding document:", error);
//     }
//     if (result.deletedCount === 1) {
//       res.status(200).json({ message: "Booking deleted successfully." });
//     } else {
//       res.status(404).json({ message: "Booking not found." });
//     }
//     client.close();
//   } else {
//     res.status(405).end(); // Method Not Allowed
//   }
// }

import { MongoClient, ObjectId } from "mongodb";

export default async function handler(req, res) {
  let client;
  if (req.method === "DELETE") {
    const data = req.query;
    console.log("this is data from handler", data);
    const id = data.id;

    try {
      client = await MongoClient.connect(
        "mongodb+srv://admin:pass@cluster0.fh4xile.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp"
      );
      const db = client.db();
      const collection = db.collection("task");

      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      console.log("deleted", result);

      if (result.deletedCount === 1) {
        res.status(200).json({ message: "Booking deleted successfully." });
      } else {
        res.status(404).json({ message: "Booking not found." });
      }
    } catch (error) {
      console.error("Error while finding document:", error);
      res.status(500).json({ message: "Internal server error" }); // Handle the error and return an appropriate response
    } finally {
      client.close();
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
