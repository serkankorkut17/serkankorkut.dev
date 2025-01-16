"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner, Button, Modal } from "flowbite-react";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
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

  const handleDelete = (id) => {
    setDeleting(true);
    fetch(`/api/templates?id=${id}`, {
      method: "DELETE",
    }).then(() => {
      setTemplates((prev) => prev.filter((template) => template._id !== id));
      setDeleting(false);
      setShowDeleteModal(false);
    });
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
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="justify-start mb-6">
              <Button
                color="primary"
                onClick={() => router.push("/email/templates/new")}
                className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition"
              >
                New Template
              </Button>
            </div>
            <div className="flex justify-end mb-6">
              <Button
                color="primary"
                onClick={() => router.push("/email")}
                className="bg-black text-white hover:bg-gray-700 py-2 rounded-lg transition flex items-center"
              >
                <FaArrowLeft className="w-5 h-5 mr-2" />
                Go back
              </Button>
            </div>
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
                          onClick={() => {
                            setTemplateToDelete(template);
                            setShowDeleteModal(true);
                          }}
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
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Delete Template</Modal.Header>
        <Modal.Body>
          <p className="text-gray-500">
            Are you sure you want to delete the template `&quot;`
            <span className="font-semibold">{templateToDelete?.name}</span>`&quot;`?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="primary"
            onClick={() => setShowDeleteModal(false)}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            color="failure"
            onClick={() => handleDelete(templateToDelete._id)}
            className="bg-red-500 text-white hover:bg-red-600"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
