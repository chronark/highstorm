import { SignIn } from "@clerk/nextjs/app-beta";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <SignIn
        path="/auth/sign-in"
        signUpUrl="/auth/sign-up"
        afterSignInUrl="/home"
        afterSignUpUrl="/home"
        routing="hash"
      />
    </div>
  );
}
