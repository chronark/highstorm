"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

export const Form: React.FC = () => {
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");
  const searchParams = useSearchParams();
  const _to = searchParams?.get("to");

  return (
    <div>
      <div className="flex flex-col items-center justify-center px-12 py-24 text-center space-y-3">
        {/* <Link href="https://planetfall.io">XX</Link> */}
        <h3 className="text-xl font-semibold">Sign In</h3>
        <div className="flex flex-col w-full gap-4">
          <p className="text-sm text-neutral-500">Use your GitHub account to sign in.</p>
          <Button
            size="lg"
            disabled={state === "loading"}
            onClick={async () => {
              setState("loading");
              await signIn("github", { callbackUrl: "/home" });
              setState("idle");
            }}
          >
            <svg
              className="w-6 h-6 mr-4"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                clipRule="evenodd"
              />
            </svg>
            Sign in with GitHub
          </Button>
        </div>
      </div>
    </div>
  );
};
