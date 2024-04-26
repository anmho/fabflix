import { useAuth } from "~/hooks/auth";

const AuthPage: React.FC = () => {
  const { session } = useAuth();
  return (
    <div className="text-foreground flex justify-center align-center w-screen h-screen dark">
      {JSON.stringify(session)}
    </div>
  );
};

export default AuthPage;
