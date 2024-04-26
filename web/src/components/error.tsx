interface ErrorPageProps {
  error: Error;
}
export function ErrorPage({ error }: ErrorPageProps) {
  return (
    <div className="flex items-center justify-center">
      {JSON.stringify(error)}
    </div>
  );
}
