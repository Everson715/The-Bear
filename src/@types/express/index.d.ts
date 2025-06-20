// src/@types/express/index.d.ts
import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        isAdmin: boolean;
      };
    }
  }
}

export {};
