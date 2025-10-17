"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";

type Toast = {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
};

type ToastContextType = {
  toast: (toast: Toast) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (toast: Toast) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 4000);
  };

  return (
    React.createElement(
      ToastContext.Provider,
      { value: { toast } },
      React.createElement(
        React.Fragment,
        null,
        children,
        React.createElement(
          "div",
          {
            style: {
              position: "fixed",
              top: 20,
              right: 20,
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            },
          },
          toasts.map((t, i) =>
            React.createElement(
              "div",
              {
                key: i,
                style: {
                  background:
                    t.variant === "destructive"
                      ? "#f87171"
                      : t.variant === "success"
                      ? "#4ade80"
                      : "#222",
                  color: "#fff",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  minWidth: "220px",
                  fontWeight: 500,
                },
              },
              React.createElement("div", null, t.title),
              t.description &&
                React.createElement(
                  "div",
                  { style: { fontSize: "0.95em", marginTop: 2 } },
                  t.description
                )
            )
          )
        )
      )
    )
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}