import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, Button, Input, Textarea, useToast
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNoteStore } from "../store/note";

export default function EditNoteModal({ note, onClose }) {
  const { updateNote, deleteNote } = useNoteStore();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  if (!note) return null;

  const save = async () => {
    await updateNote(note._id, title, content);
    toast({ title: "Note updated", status: "success" });
    onClose();
  };

  const remove = async () => {
    await deleteNote(note._id);
    toast({ title: "Note deleted", status: "error" });
    onClose();
  };

  return (
    <Modal isOpen={!!note} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Note</ModalHeader>
        <ModalBody>
          <Input mb={3} value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea rows={5} value={content} onChange={(e) => setContent(e.target.value)} />
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <Button colorScheme="red" onClick={remove}>Delete</Button>
          <Button colorScheme="blue" onClick={save}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
