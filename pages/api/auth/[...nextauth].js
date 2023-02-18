import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { verifyPassword } from '../../../helpers/auth';
import { connectToDataBase } from '../../../helpers/db';

export default NextAuth({
  sesion: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const client = await connectToDataBase();

        const db = client.db();

        const user = await db
          .collection('users')
          .findOne({ email: credentials.email });

        if (!user) {
          client.close();
          throw new Error('No user found!');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error('Wrong password. Please try again');
        }

        client.close();
        console.log('Succesfully auth!');
        return { email: user.email };
      },
    }),
  ],
});
