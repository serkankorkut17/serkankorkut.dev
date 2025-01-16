"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Label,
  TextInput,
  Textarea,
  Select,
  Spinner,
} from "flowbite-react";

export default function NewMailablePage() {
  const [templates, setTemplates] = useState([]);
  const [name, setName] = useState("");
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
        setLoading(false);
      });
  }, []);

  const validateEmails = (emails) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emails.every((email) => emailRegex.test(email));
  };

  const saveMailable = () => {
    const recipientList = recipients
      .split(/[\n,]+/) // Split by new line or comma
      .map((email) => email.trim()) // Trim whitespace
      .filter((email) => email); // Remove empty strings

    // Validate form fields
    if (!name.trim()) {
      alert("Name field cannot be empty.");
      return;
    }
    if (!subject.trim()) {
      alert("Subject field cannot be empty.");
      return;
    }
    if (!templateId.trim()) {
      alert("Please select a template.");
      return;
    }

    // Validate email addresses
    if (!validateEmails(recipientList)) {
      alert(
        "One or more recipients have an invalid email address. Please check and try again."
      );
      return;
    }

    fetch("/api/mailables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        recipients: recipientList,
        subject,
        templateId,
      }),
    }).then(() => router.push("/email/mailables"));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center py-12 px-6 md:px-16 lg:px-40 bg-gray-50 text-black min-h-screen">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
        <div className="text-start pb-8">
          <p className="text-orange-500 text-lg font-extrabold uppercase">
            .: Create Mailable
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-gray-900">
            New Mailable
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <Label htmlFor="name" className="text-lg font-semibold">
              Name
            </Label>
            <TextInput
              id="name"
              type="text"
              placeholder="Enter mailable name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="recipients" className="text-lg font-semibold">
              Recipients (comma-separated or line-separated)
            </Label>
            <Textarea
              id="recipients"
              placeholder="Enter recipients (e.g., email1@example.com, email2@example.com or one per line)"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              required
              rows={4}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="subject" className="text-lg font-semibold">
              Subject
            </Label>
            <TextInput
              id="subject"
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="template" className="text-lg font-semibold">
              Template
            </Label>
            <Select
              id="template"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              required
              className="mt-2"
            >
              <option value="">Select Template</option>
              {templates.map((template) => (
                <option key={template._id} value={template._id}>
                  {template.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              color="primary"
              onClick={saveMailable}
              className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-all"
            >
              Save
            </Button>
            <Button
              onClick={() => router.push("/email/mailables")}
              color="gray"
              className="py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
