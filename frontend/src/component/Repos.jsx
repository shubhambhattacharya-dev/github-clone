import Repo from "./Repo";
import { useAuthContext } from "../context/AuthContext";

const Repos = ({ repos }) => {
  const { authUser } = useAuthContext();

  return (
    <div className="space-y-4">
      {repos.map((repo) => (
        <Repo key={repo.id} repo={repo} />
      ))}
    </div>
  );
};

export default Repos;