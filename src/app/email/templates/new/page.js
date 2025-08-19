"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextInput, Spinner, Alert } from "flowbite-react";
import { FaUpload, FaSave, FaTimes, FaArrowLeft } from "react-icons/fa";

const EmailEditor = dynamic(() => import("react-email-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[300px]">
      <Spinner size="lg" />
      <p className="ml-4 text-lg">Loading Editor...</p>
    </div>
  ),
});

export default function NewTemplatePage() {
  const emailEditorRef = useRef(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const saveTemplate = async () => {
    if (!name.trim()) {
      alert("Please enter a template name");
      return;
    }

    setIsLoading(true);
    setError(null);

    emailEditorRef.current?.editor.exportHtml(async (data) => {
      const { design, html } = data;

      try {
        // Sending the request to save the template
        const response = await fetch("/api/templates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            design: JSON.stringify(design),
            html,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save template");
        }

        router.push("/email/templates");
      } catch (error) {
        setError(err.message);
        alert("Failed to save template. Please try again.");
      } finally {
        setIsLoading(false);
      }
    });
  };

  const importDesign = () => {
    // Import design from clipboard
    navigator.clipboard.readText().then((text) => {
      try {
        const design = JSON.parse(text);
        emailEditorRef.current?.editor.loadDesign(design);
      } catch (error) {
        alert("Invalid design data in clipboard!");
      }
    });
  };

  const importFromKeyboard = () => {
    // Import design from keyboard
    const design = prompt("Paste your design JSON here:");
    if (design) {
      try {
        const parsedDesign = JSON.parse(design);
        emailEditorRef.current?.editor.loadDesign(parsedDesign);
      } catch (error) {
        alert("Invalid design JSON format!");
      }
    }
  };

  return (
    <section className="flex flex-col py-8 px-8 md:px-40 mb-16 bg-white text-black">
      <div className="text-start pb-12">
        <p className="text-orange-500 text-lg font-extrabold">
          .: CREATE TEMPLATE
        </p>
        <h2 className="text-6xl font-extrabold mt-2">Create Your Template</h2>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert color="failure" className="mb-4" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="mb-4 flex items-center gap-4">
        <TextInput
          id="template-name"
          type="text"
          placeholder="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required={true}
          disabled={isLoading}
          className="border border-gray-300 p-4 rounded-lg flex-1"
        />
        <Button
          color=""
          onClick={() => router.push("/email/templates")}
          className="bg-black text-white hover:bg-gray-900 py-2 px-4 rounded-lg transition flex items-center"
        >
          <FaArrowLeft className="w-5 h-5 mr-2" />
          Go back
        </Button>
      </div>

      <div className="mb-6">
        <EmailEditor
          ref={emailEditorRef}
          options={{
            version: "latest",
            appearance: {
              theme: "modern_light",
            },
          }}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        {/* Left Buttons */}
        <div className="flex gap-4">
          <Button
            className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition"
            onClick={saveTemplate}
            disabled={isLoading}
          >
            <FaSave className="mr-2" />
            {isLoading ? (
            <>
              <Spinner size="sm" light={true} className="mr-2" />
              Saving...
            </>
          ) : (
            "Save Template"
          )}
          </Button>
          <Button
            className="py-2 px-4 rounded-lg transition"
            color="gray"
            onClick={() => router.push("/email/templates")}
          >
            <FaTimes className="mr-2" />
            Cancel
          </Button>
        </div>

        {/* Right Buttons */}
        <div className="flex gap-4">
          <Button
            color="gray"
            className="py-2 px-4 rounded-lg hover:bg-gray-600 transition"
            onClick={importDesign}
          >
            <FaUpload className="mr-2" />
            Import Design from Clipboard
          </Button>
          <Button
            onClick={importFromKeyboard}
            color="gray"
            className="py-2 px-4 rounded-lg hover:bg-gray-600 transition"
          >
            <FaUpload className="mr-2" />
            Import Design from Keyboard
          </Button>
        </div>
      </div>
    </section>
  );
}
