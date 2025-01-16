"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, Spinner } from "flowbite-react";
import { FaTrash, FaEye, FaArrowLeft } from "react-icons/fa";

export default function MailablesPage() {
  const [mailables, setMailables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mailableToDelete, setMailableToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/mailables")
      .then((res) => res.json())
      .then((data) => {
        setMailables(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    setDeleting(true);
    fetch("/api/mailables", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).then(() => {
      setMailables((prev) => prev.filter((mailable) => mailable._id !== id));
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
    <section className="flex flex-col py-8 px-8 md:px-16 lg:px-40 bg-white text-black">
      <div className="text-start pb-12">
        <p className="text-orange-500 text-lg font-extrabold">.: MAILABLES</p>
        <h2 className="text-6xl font-extrabold mt-2">Manage Mailables</h2>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="flex justify-start mb-6">
        <Button
          color="primary"
          className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition"
          onClick={() => router.push("/email/mailables/new")}
        >
          New Mailable
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

      {mailables.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left text-sm text-gray-500 border-collapse border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="px-4 py-3 border border-gray-300">Name</th>
                <th className="px-4 py-3 border border-gray-300">Recipients</th>
                <th className="px-4 py-3 border border-gray-300">Subject</th>
                <th className="px-4 py-3 border border-gray-300 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mailables.map((mailable) => (
                <tr
                  key={mailable._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-4 py-4 border border-gray-300 truncate max-w-lg">
                    {mailable.name}
                  </td>
                  <td className="px-4 py-4 border border-gray-300 text-ellipsis overflow-hidden">
                    {mailable.recipients.join(", ")}
                  </td>
                  <td className="px-4 py-4 border border-gray-300 text-ellipsis overflow-hidden">
                    {mailable.subject}
                  </td>
                  <td className="px-4 py-4 border border-gray-300 text-center flex gap-2 justify-center">
                    <Button
                      color="primary"
                      onClick={() =>
                        router.push(`/email/mailables/${mailable._id}`)
                      }
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                    >
                      <FaEye />
                    </Button>
                    <Button
                      color="failure"
                      onClick={() => {
                        setMailableToDelete(mailable);
                        setShowDeleteModal(true);
                      }}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                    >
                      <FaTrash className="text-white" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500">No mailables found.</div>
      )}

      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Delete Mailable</Modal.Header>
        <Modal.Body>
          <p className="text-gray-500">
            Are you sure you want to delete the mailable `&quot;`
            <span className="font-semibold">{mailableToDelete?.name}</span>`&quot;`?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="failure"
            onClick={() => handleDelete(mailableToDelete?._id)}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
          <Button color="gray" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
