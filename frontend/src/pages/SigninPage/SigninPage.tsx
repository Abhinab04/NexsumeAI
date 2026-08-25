import { Link } from "react-router-dom";
import { SignIn } from "@clerk/clerk-react";
import { Home } from "lucide-react";

export default function SigninPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-6 rounded-2xl p-6 shadow-lg">
        <SignIn
          routing="path"
          path="/signin"
          forceRedirectUrl="/dashboard"
        />

        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-2 text-sm font-semibold"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
