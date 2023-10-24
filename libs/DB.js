import {MongoClient} from 'mongodb';

export class DB {
  static _client;
  static async connect() {
    if (!DB._client) {
      DB._client = await MongoClient.connect(
        process.env.DB_URL
        // "mongodb+srv://admin:pass@cluster0.fh4xile.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp"
      );
    }

    return DB._client.db();
  }

  static closeConnection() {
    DB._client?.close();
    DB._client = undefined;
  }
}
