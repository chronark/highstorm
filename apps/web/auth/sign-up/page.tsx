import { SignUp } from "@clerk/nextjs/app-beta";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <SignUp
        path="/auth/sign-up"
        signInUrl="/sign-in"
        afterSignInUrl="/home"
        afterSignUpUrl="/onboarding"
        routing="hash"
      />
      ;
    </div>
  );
}
