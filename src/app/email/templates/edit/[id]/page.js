"use client";

import dynamic from "next/dynamic";
import { useRef, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, TextInput, Spinner } from "flowbite-react";
import {
  FaDownload,
  FaUpload,
  FaSave,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import { TbReload } from "react-icons/tb";

const EmailEditor = dynamic(() => import("react-email-editor"), { ssr: false });

export default function EditTemplatePage() {
  const emailEditorRef = useRef(null);
  const [name, setName] = useState("");
  const [design, setDesign] = useState({});
  const [unlayerLoaded, setUnlayerLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetch(`/api/templates?id=${id}`)
        .then((res) => res.json())
        .then((template) => {
          console.log("Template data:", template);

          setName(template.name);
          // const design = JSON.parse(template.design);
          setDesign(JSON.parse(template.design));
          emailEditorRef.current?.editor.loadDesign(design);
          setLoading(false);
        });
    }
  }, [id, unlayerLoaded]);

  const updateTemplate = () => {
    emailEditorRef.current?.editor.exportHtml((data) => {
      const { design, html } = data;
      fetch("/api/templates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          update: { name, design: JSON.stringify(design), html },
        }),
      }).then(() => router.push("/email/templates"));
    });
  };

  const exportDesign = () => {
    emailEditorRef.current?.editor.exportHtml((data) => {
      const { design } = data;
      const json = JSON.stringify(design);

      // Copy the design to the clipboard
      navigator.clipboard.writeText(json).then(() => {
        alert("Design copied to clipboard!");
      });
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

  const handleEditorLoad = () => {
    setUnlayerLoaded(true);
  };
  const handleReloadUnlayer = () => {
    // Reload the unlayer editor
    emailEditorRef.current?.editor.loadDesign(design);
  };

  if (loading) {
    return (
      <div className="relative flex items-center justify-center h-screen opacity-10">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <section className="flex flex-col py-8 px-8 md:px-16 lg:px-40 mb-16 bg-white text-black">
      <div className="text-start pb-12">
        <p className="text-orange-500 text-lg font-extrabold">Edit Template</p>
        <h2 className="text-6xl font-extrabold mt-2">Update Your Template</h2>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <TextInput
          id="template-name"
          type="text"
          placeholder="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required={true}
          className="border border-gray-300 p-4 rounded-lg flex-1"
        />
        <Button
          color="primary"
          onClick={() => router.push("/email/templates")}
          className="bg-black text-white hover:bg-gray-700 py-2 rounded-lg transition flex items-center"
        >
          <FaArrowLeft className="w-5 h-5 mr-2" />
          Go back
        </Button>
        <Button
          color="primary"
          onClick={handleReloadUnlayer}
          className="bg-black text-white hover:bg-gray-700 py-2 rounded-lg transition flex items-center"
        >
          <TbReload className="w-5 h-5 mr-2" />
          Reload
        </Button>
      </div>

      <div className="mb-6">
        <EmailEditor
          ref={emailEditorRef}
          onLoad={handleEditorLoad}
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
        <div className="flex gap-4">
          {/* Update Template Button */}
          <Button
            color="primary"
            className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
            onClick={updateTemplate}
          >
            <FaSave className="mr-2" />
            Update Template
          </Button>

          {/* Cancel Button */}
          <Button
            className="py-2 rounded-lg transition"
            color="gray"
            onClick={() => router.push("/email/templates")}
          >
            <FaTimes className="mr-2" />
            Cancel
          </Button>
        </div>

        {/* Copy Design ve Import Design Buttons */}
        <div className="flex gap-4">
          <Button
            color="primary"
            onClick={exportDesign}
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <FaDownload className="mr-2" />
            Copy Design to Clipboard
          </Button>
          <Button
            color="gray"
            className="py-2 rounded-lg hover:bg-gray-600 transition"
            onClick={importDesign}
          >
            <FaUpload className="mr-2" />
            Import Design from Clipboard
          </Button>
        </div>
      </div>
    </section>
  );
}
