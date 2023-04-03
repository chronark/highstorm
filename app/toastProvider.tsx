"use client";

import { ToastProvider as Provider} from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import React, { PropsWithChildren } from "react";

export const ToastProvider: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <Provider>
            <Toaster />
            {children}
        </Provider>
    );
};