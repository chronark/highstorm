"use client";

import React, { PropsWithChildren } from "react";

import { ToastProvider as Provider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

export const ToastProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Provider>
      <Toaster />
      {children}
    </Provider>
  );
};
