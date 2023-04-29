import { Particles } from "@/components/landing/particles";
import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/nextjs/app-beta";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <div className="flex items-center justify-center w-screen h-screen">
          <Particles className="absolute inset-0 -z-10 " />

          <SignIn
            appearance={{
              variables: {
                colorPrimary: "#161616",
                colorText: "#161616",
              },
            }}
            afterSignInUrl={"/overview"}
            afterSignUpUrl={"/overview"}
          />
        </div>
      </SignedOut>
    </ClerkProvider>
  );
}
