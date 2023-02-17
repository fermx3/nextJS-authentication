import { hashPassword } from '../../../helpers/auth';
import { connectToDataBase } from '../../../helpers/db';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const data = req.body;
    const { email, password } = data;

    if (
      !email ||
      !email.includes('@') ||
      !password ||
      password.trim().length < 7
    ) {
      res.status(422).json({
        message:
          'Invalid input - password should be at least 7 characters long.',
      });
      return;
    }

    const client = await connectToDataBase();

    const db = client.db();

    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      res.status(422).json({
        message: 'User already exists! Please login.',
      });
      client.close();
      return;
    }

    const hashedPassword = await hashPassword(password);

    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'User created!',
      user: {
        email,
        password: hashedPassword,
      },
    });

    client.close();
  }
};

export default handler;
