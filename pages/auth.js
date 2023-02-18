import { getSession, useSession } from 'next-auth/client';
import AuthForm from '../components/auth/auth-form';

function AuthPage() {
  return <AuthForm />;
}

export default AuthPage;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: '/profile',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
