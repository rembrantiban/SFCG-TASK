import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useState } from "react";
import { Trash  } from "lucide-react";
import axiosInstance from "../../lib/axios";
import { toast } from 'react-hot-toast'


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
       setOpenModal(false)
       setTimeout(() => {
          window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    } finally {
      setIsDeleting(false);
      setOpenModal(false);
    }
  };

  return (
    <>
      <Button className="h-10 bg-red-700" color="red" onClick={() => setOpenModal(true)} size="xs">
        <Trash className="mr-2 h-4 w-4" />
        Delete
      </Button>

      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={handleDelete} isProcessing={isDeleting}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)} disabled={isDeleting}>
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
