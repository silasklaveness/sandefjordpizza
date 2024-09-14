"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState(false);

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setCreatingUser(true);
    setError(false);
    setUserCreated(false);
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      setUserCreated(true);
    } else {
      setError(true);
    }
    setCreatingUser(false);
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl"
      >
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Registrer deg
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Opprett en ny konto
          </p>
        </div>

        {userCreated && (
          <div className="my-4 text-center text-green-600">
            Bruker opprettet.
            <br />
            Nå kan du{" "}
            <Link className="underline" href={"/login"}>
              Logge inn &raquo;
            </Link>
          </div>
        )}

        {error && (
          <div className="my-4 text-center text-red-600">
            En feil har oppstått.
            <br />
            Vennligst prøv igjen senere
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Label htmlFor="email-address" className="sr-only">
                E-postadresse
              </Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                placeholder="E-postadresse"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                disabled={creatingUser}
              />
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">
                Passord
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                placeholder="Passord"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                disabled={creatingUser}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={creatingUser}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {creatingUser ? "Oppretter bruker..." : "Registrer"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Eller fortsett med
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <Image
                src={"/google.png"}
                alt={""}
                width={24}
                height={24}
                className="mr-2"
              />
              Registrer med Google
            </Button>
          </div>
        </div>

        <div className="text-center mt-4 text-gray-500 border-t pt-4">
          Har du allerede en konto?{" "}
          <Link
            className="underline text-gray-900 hover:text-gray-700"
            href={"/login"}
          >
            Logg inn her &raquo;
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
