import { Request, Response } from "express";
import { supabase } from "../supabase/client";
import { prisma } from "../prisma/client";

/**
 * REGISTER
 */
export async function register(req: Request, res: Response) {
  try {
    const { email, password, name, full_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email dan password wajib diisi" });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name ?? "",
          full_name: full_name ?? "",
          role: "USER", // default role
        },
      },
    });

    if (error || !data.user) {
      return res.status(400).json({ error: error?.message });
    }

    const supabaseUser = data.user;

    // simpan ke database sendiri
    await prisma.user.upsert({
      where: { id: supabaseUser.id },
      update: {},
      create: {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: name ?? "",
        full_name: full_name ?? "",
        role: "USER",
      },
    });

    await prisma.cart.upsert({
      where: { userId: supabaseUser.id },
      update: {},
      create: {
        userId: supabaseUser.id,
      },
    });

    return res.json({
      message: "User berhasil didaftarkan",
      user: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name,
        full_name,
        role: "USER",
      },
    });
  } catch (error: any) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}


export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email dan password wajib diisi" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return res.status(400).json({ error: error?.message });
    }

    const supabaseUser = data.user;
    console.log("APP META:", supabaseUser.app_metadata);

    const role =
      supabaseUser.email === "admin@gmail.com" ? "ADMIN" : "USER";
      console.log(`User logged in: ${supabaseUser.email} | Role: ${role}`);

    await prisma.user.upsert({
      where: { id: supabaseUser.id },
      update: {},
      create: {
        id: supabaseUser.id,
        email: supabaseUser.email!,
      },
    });

    await prisma.cart.upsert({
      where: { userId: supabaseUser.id },
      update: {},
      create: {
        userId: supabaseUser.id,
      },
    });

    return res.json({
      message: "Login berhasil",
      session: data.session,
    });
  } catch (error:any) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
