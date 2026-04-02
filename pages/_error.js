import Error from 'next/error';

export default function CustomError({ statusCode = 500 }) {
  return <Error statusCode={statusCode} />;
}
