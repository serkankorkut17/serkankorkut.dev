"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";

// This page is about managing email templates and mailables.
const EmailsPage = () => {
  const router = useRouter();

  return (
    <section className="flex flex-col py-16 px-8 md:px-40 bg-white text-black min-h-screen">
      <div className="text-start pb-16">
        <p className="text-orange-500 text-xl font-extrabold">.: EMAIL MANAGEMENT</p>
        <h2 className="text-7xl font-extrabold mt-4">Manage Your Email Templates and Mailables</h2>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-8">
        <Button
          color="primary"
          className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition"
          onClick={() => router.push("/email/templates")}
        >
          Templates
        </Button>

        <Button
          color="primary"
          className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition"
          onClick={() => router.push("/email/mailables")}
        >
          Mailables
        </Button>
      </div>
    </section>
  );
};

export default EmailsPage;
