import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const PostLoginCheck = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    const checkUser = async () => {
      const auth0Id = user?.sub?.split("|")[1];
      if (!auth0Id) return;

      try {
        // 1️⃣ Check if user exists
        const res = await fetch(`http://localhost:5000/api/users/${auth0Id}`);

        if (res.ok) {
          const userData = await res.json();

          navigate("/chat", {
            state: { user: userData },
          });
          return;
        }

        // 2️⃣ Create user if not exists
        const createRes = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auth0Id,
            name: user.name,
            email: user.email,
            picture: user.picture,
          }),
        });

        const newUser = await createRes.json();

        navigate("/chat", {
          state: { user: newUser },
        });
      } catch (err) {
        console.error("Post login error:", err);
      }
    };

    checkUser();
  }, [isAuthenticated, isLoading, user, navigate]);

  return null;
};

export default PostLoginCheck;
