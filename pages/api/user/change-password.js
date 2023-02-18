import { getSession } from 'next-auth/client';
import { hashPassword, verifyPassword } from '../../../helpers/auth';
import { connectToDataBase } from '../../../helpers/db';

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getSession({ req });

  //Check if a user is authenticated
  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' });
    return;
  }
  // end of authentication check

  const userEmail = session.user.email;
  const { oldPassword, newPassword } = req.body;

  const client = await connectToDataBase();

  const usersCollection = client.db().collection('users');

  const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: 'User not found!' });
    client.close();
    return;
  }

  const currentPassword = user.password;

  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

  if (!passwordsAreEqual) {
    res.status(403).json({ message: "Old password doesn't match" });
    client.close();
    return;
  }

  if (!newPassword || newPassword.trim().length < 7) {
    res.status(422).json({
      message: 'Invalid input - password should be at least 7 characters long.',
    });
    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );

  res.status(200).json({
    message: 'Password changed!',
  });

  client.close();
}

export default handler;
