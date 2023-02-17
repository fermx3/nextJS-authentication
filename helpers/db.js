import { MongoClient } from 'mongodb';

export const connectToDataBase = async () => {
  const url = `mongodb+srv://${process.env.USERNAME}:${process.env.PASS}@${process.env.CLUSTER}.kroh7rd.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;
  const client = await MongoClient.connect(url);

  return client;
};
