"use client";
import { FaEdit, FaTrash } from "react-icons/fa";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "flowbite-react";
import { Button } from "flowbite-react";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
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

  const deleteTemplate = async (id) => {
    await fetch(`/api/templates?id=${id}`, { method: "DELETE" });
    setTemplates((prev) => prev.filter((template) => template._id !== id));
  };

  if (loading) {
    return (
      <div className="fixed h-screen inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <section className="flex flex-col py-8 px-8 md:px-40 bg-white text-black">
      <div className="text-start pb-12">
        <p className="text-orange-500 text-lg font-extrabold">.: TEMPLATES</p>
        <h2 className="text-6xl font-extrabold mt-2">Manage Templates</h2>
      </div>

      <div className="flex flex-col xl:flex-row justify-between items-center">
        <div className="w-full">
          <div className="flex justify-end mb-6">
            <Button
              color="primary"
              onClick={() => router.push("/email/templates/new")}
              className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition"
            >
              New Template
            </Button>
          </div>
          {templates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left text-sm text-gray-500 border-collapse border border-gray-200 shadow-md rounded-lg">
                <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                  <tr>
                    <th className="px-6 py-3 border border-gray-300 w-3/4">
                      Name
                    </th>
                    <th className="px-6 py-3 border border-gray-300 w-1/4 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((template) => (
                    <tr
                      key={template._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 border border-gray-300 truncate max-w-lg">
                        {template.name}
                      </td>
                      <td className="px-6 py-4 border border-gray-300 flex justify-center gap-2">
                        <button
                          onClick={() =>
                            router.push(`templates/edit/${template._id}`)
                          }
                          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                        >
                          <FaEdit className="text-white" />
                        </button>
                        <button
                          onClick={() => deleteTemplate(template._id)}
                          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                        >
                          <FaTrash className="text-white" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500">No templates found.</div>
          )}
        </div>
      </div>
    </section>
  );
}
