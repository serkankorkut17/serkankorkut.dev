"use client";

import { useState } from "react";
import ContactData from "@/data/contact.json";

export default function ContactForm() {
  const { title, success, error, form } = ContactData.formSection;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(success);
        setFormData({
          name: "",
          email: "",
          subject: "",
          phone: "",
          message: "",
        });
      } else {
        alert(error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <section
      className={`flex flex-col pt-8 pb-16 px-8 md:px-40 text-black bg-white`}
    >
      <h2 className="text-4xl font-bold mb-8">{title}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={form.name.placeholder}
          className="font-medium border border-gray-300 p-4"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={form.email.placeholder}
          className="font-medium border border-gray-300 p-4"
          required
        />
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder={form.subject.placeholder}
          className="font-medium border border-gray-300 p-4"
          required
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder={form.phone.placeholder}
          className="font-medium border border-gray-300 p-4"
          required
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={form.message.placeholder}
          className="font-medium border border-gray-300 p-4 col-span-2"
          rows="4"
          required
        />
        <button
          type="submit"
          className="bg-black text-white font-bold py-2 px-4 mt-4 col-span-2"
        >
          {form.button}
        </button>
      </form>
    </section>
  );
}
