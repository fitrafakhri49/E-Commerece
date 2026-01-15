// middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import { supabase } from "../supabase/client";

export interface AuthRequest extends Request {
  user?: any;
}
export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token && req.query?.access_token) {
      token = String(req.query.access_token);
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = data.user;

    next();
  } catch (err: any) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export function setSessionCookie(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  res.cookie("sb-access-token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600 * 1000, 
    sameSite: "strict",
  });

  res.cookie("sb-refresh-token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 3600 * 1000, 
    sameSite: "strict",
  });
}
export async function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token && req.query?.access_token) {
      token = String(req.query.access_token);
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const role = data.user.app_metadata?.role;

    if (role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access only" });
    }

    // inject user ke request
    req.user = data.user;

    next();
  } catch (err) {
    console.error("RequireAdmin error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}