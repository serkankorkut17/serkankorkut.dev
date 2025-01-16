"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Button,
  Label,
  TextInput,
  Textarea,
  Select,
  FileInput,
  Spinner,
  Modal,
} from "flowbite-react";
import { HiMail, HiPlus } from "react-icons/hi";

export default function MailableDetailPage() {
  const { id } = useParams(); // Dynamic route parameter
  const router = useRouter();

  const [mailable, setMailable] = useState(null); // Mailable data
  const [templates, setTemplates] = useState([]); // Templates list
  const [loading, setLoading] = useState(true); // Loading state
  const [templateUrl, setTemplateUrl] = useState(""); // Template URL for iframe
  const [isSending, setIsSending] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false); // Send mail modal
  const [newRecipients, setNewRecipients] = useState(""); // Multiple emails input field value

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Fetch mailable and templates data
  useEffect(() => {
    Promise.all([
      fetch(`/api/mailables?id=${id}`).then((res) => res.json()),
      fetch("/api/templates").then((res) => res.json()),
    ]).then(([mailableData, templatesData]) => {
      setMailable(mailableData[0]);
      setTemplates(templatesData);
      setLoading(false);
    });
  }, [id]);

  // Update the template URL when mailable or templates change
  useEffect(() => {
    if (mailable && templates.length > 0) {
      const template = templates.find((t) => t._id === mailable.templateId);
      if (template) {
        // Convert HTML string to Blob and create a URL
        const blob = new Blob([template.html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        setTemplateUrl(url); // Set the URL to the iframe
      }
    }
  }, [mailable, templates]);

  const updateMailable = () => {
    if (
      !mailable.name ||
      !mailable.subject ||
      !mailable.templateId ||
      mailable.recipients.length === 0
    ) {
      console.log(mailable);
      alert("Please fill in all fields before saving.");
      return;
    }
    // Validate emails
    for (let email of mailable.recipients) {
      if (!isValidEmail(email)) {
        alert(`Invalid email address: ${email}`);
        return;
      }
    }
    const body = {
      id: mailable._id,
      name: mailable.name,
      recipients: mailable.recipients,
      subject: mailable.subject,
      templateId: mailable.templateId,
      attachments: mailable.attachments,
    };

    fetch("/api/mailables", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Mailable updated successfully!");
        router.push("/email/mailables");
      });
  };

  const handleInputChange = (field, value) => {
    setMailable((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRecipientsChange = (e) => {
    setNewRecipients(e.target.value);
  };

  const addRecipients = () => {
    if (newRecipients) {
      const emails = newRecipients
        .split(/[,\n]/) // Split by both commas and newlines
        .map((email) => email.trim()) // Remove leading/trailing spaces
        .filter((email) => isValidEmail(email)); // Filter only valid emails

      if (emails.length > 0) {
        const updatedRecipients = [...(mailable.recipients || []), ...emails];
        handleInputChange("recipients", updatedRecipients);
        setNewRecipients(""); // Clear the input field after adding
      } else {
        alert("Please enter valid email addresses.");
      }
    }
  };

  const sendMail = () => {
    setIsSending(true);
    fetch(`/api/sendMail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mailableId: mailable._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(`Mail sent: ${JSON.stringify(data)}`);
        setIsSending(false);
        setShowSendModal(false);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center py-12 px-6 md:px-16 lg:px-40 bg-gray-50 text-black min-h-screen">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <header className="text-start pb-8">
          <p className="text-orange-500 text-lg font-extrabold uppercase">
            .: Edit Mailable
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-gray-900">
            Edit Your Mailable
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <Label htmlFor="name" className="text-lg font-semibold">
              Name
            </Label>
            <TextInput
              id="name"
              type="text"
              value={mailable.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="recipients" className="text-lg font-semibold">
              Recipients
            </Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {mailable.recipients &&
                mailable.recipients.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-lg shadow-sm"
                  >
                    <span className="text-sm">{email}</span>
                    <button
                      onClick={() => {
                        const updatedRecipients = [...mailable.recipients];
                        updatedRecipients.splice(index, 1);
                        handleInputChange("recipients", updatedRecipients);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Textarea
                id="newRecipients"
                value={newRecipients}
                onChange={handleRecipientsChange}
                placeholder="Enter emails, separated by commas or one per line"
                rows={4}
                className="w-full"
              />
              <Button
                onClick={addRecipients}
                color="success"
                className="flex items-center gap-2"
              >
                <HiPlus className="h-5 w-5 mr-2" /> Add
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="subject" className="text-lg font-semibold">
              Subject
            </Label>
            <TextInput
              id="subject"
              type="text"
              value={mailable.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
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
              value={mailable.templateId}
              onChange={(e) => handleInputChange("templateId", e.target.value)}
              required
              className="mt-2"
            >
              {templates.map((template) => (
                <option key={template._id} value={template._id}>
                  {template.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="attachments" className="text-lg font-semibold">
              Attachments
            </Label>
            <FileInput
              id="attachments"
              multiple
              onChange={(e) =>
                handleInputChange(
                  "attachments",
                  Array.from(e.target.files).map((file) => file.name)
                )
              }
            />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button
            color="primary"
            onClick={updateMailable}
            className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-all"
          >
            Save Changes
          </Button>
          <Button
            onClick={() => router.push("/email/mailables")}
            color="gray"
            className="py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
          >
            Cancel
          </Button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Template Preview</h2>
          {templateUrl && (
            <iframe
              src={templateUrl}
              className="w-full h-80 border rounded-lg shadow-sm"
              frameBorder="0"
            />
          )}
        </div>

        <div className="mt-8">
          <Button
            onClick={() => setShowSendModal(true)}
            color="success"
            className="flex items-center gap-2"
          >
            <HiMail className="h-5 w-5 mr-2" />
            Send Mail
          </Button>
        </div>
      </div>

      <Modal show={showSendModal} onClose={() => setShowSendModal(false)}>
        <Modal.Header>Send Mail</Modal.Header>
        <Modal.Body>
          <p className="text-black">Are you sure you want to send this mail?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={sendMail} disabled={isSending}>
            {isSending ? "Sending..." : "Yes, Send"}
          </Button>
          <Button color="gray" onClick={() => setShowSendModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
