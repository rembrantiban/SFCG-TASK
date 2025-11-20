import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useState } from "react";
import { Trash } from "lucide-react";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";

const DeleteModal = ({ userId, onDeleteSuccess }) => {
  const [openModal, setOpenModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await axiosInstance.delete(`/auth/delete/${userId}`, {
        withCredentials: true,
      });

      if (onDeleteSuccess) onDeleteSuccess(userId);

      toast.success("User deleted successfully");
      setOpenModal(false);

    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        className="h-10 bg-red-700"
        color="red"
        onClick={() => setOpenModal(true)}
        size="xs"
      >
        <Trash className="mr-2 h-4 w-4" /> Delete
      </Button>

      {/* Enhanced Modal Background & Styling */}
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
        theme={{
          root: {
            base: "fixed inset-0 z-50 flex items-center justify-center",
            show: {
              on: "flex bg-black/60 backdrop-blur-sm transition-all duration-300",
              off: "hidden",
            },
          },
          content: {
            base:
              "relative w-full rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transform transition-all",
          },
        }}
      >
        <ModalHeader />

        <ModalBody>
          <div className="text-center p-3">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500" />

            <h3 className="mb-5 text-lg font-semibold text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this user?
            </h3>

            <div className="flex justify-center gap-4">
              <Button
                className="px-4 bg-red-600 hover:bg-red-700"
                color="red"
                onClick={handleDelete}
                isProcessing={isDeleting}
              >
                Yes, I'm sure
              </Button>

              <Button
                color="gray"
                onClick={() => setOpenModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default DeleteModal;
