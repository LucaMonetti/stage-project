import { useEffect } from "react";
import { useNavigate } from "react-router";

function HomeView() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");
  }, []);

  return <></>;
}

export default HomeView;
