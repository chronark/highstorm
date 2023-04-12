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
          <SignIn
            appearance={{
              variables: {
                colorPrimary: "#FBBE24",
                colorText: "#161616",
              },
            }}
          />
        </div>
      </SignedOut>
    </ClerkProvider>
  );
}
