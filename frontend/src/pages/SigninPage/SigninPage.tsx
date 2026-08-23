import { Link } from "react-router-dom";
import { SignIn } from "@clerk/clerk-react";
import { Home } from "lucide-react";

export default function SigninPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-6 p-6 rounded-2xl shadow-lg">
        <SignIn routing="path" path="/signin" fallbackRedirectUrl="/dashboard" />
        
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-2 text-sm font-semibold"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
