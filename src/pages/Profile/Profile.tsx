import { useAuth } from "../../auth/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>{!user ? <p>로그인이 필요함.</p> : <p>로그인 되어 있음.</p>}</div>
  );
}
