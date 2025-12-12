import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, Button, Input, Textarea, useToast
} from "@chakra-ui/react";
import { useState } from "react";
import { useNoteStore } from "../store/note";

export default function CreateNoteModal({ isOpen, onClose }) {
  const { createNote } = useNoteStore();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submit = async () => {
    await createNote(title, content);
    toast({ title: "Note created", status: "success" });
    setTitle("");
    setContent("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Note</ModalHeader>
        <ModalBody>
          <Input placeholder="Title" mb={3} value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Content" rows={5} value={content} onChange={(e) => setContent(e.target.value)} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={submit} colorScheme="blue">Create</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
