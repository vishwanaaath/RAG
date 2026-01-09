import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    if (!isAuthenticated) {
      await loginWithRedirect({
        appState: { returnTo: "/post-login-check" },
      });
      return;
    }

    navigate("/post-login-check");
  };

  if (isLoading) return null;

  return (
    <div className="h-screen w-full bg-[#0f0f0f] text-white flex items-center justify-center">
      {/* Container */}
      <div className="max-w-xl w-full px-6 text-center space-y-8">
        {/* Logo / Title */}
        <div className="space-y-3">
          <h1 className="text-5xl font-semibold tracking-tight">Ops Mind</h1>

          <p className="text-neutral-400 text-base">
            Think. Search. Understand your PDFs.
          </p>
        </div>

        {/* Divider */}
        <div className="mx-auto h-px w-24 bg-white/10" />

        {/* CTA */}
        <div className="space-y-4">
          <button
            onClick={handleGetStarted}
            className="w-full rounded-xl bg-white text-black py-3 text-sm font-medium
                       hover:bg-neutral-200 transition active:scale-[0.98]">
            Get Started
          </button>

          <p className="text-xs text-neutral-500">
            Secure sign-in powered by Auth0
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
