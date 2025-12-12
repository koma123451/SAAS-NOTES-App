import { useEffect, useState } from "react";
import { useNoteStore } from "../store/note";
import { Box, Button, Spinner, VStack, Text } from "@chakra-ui/react";
import CreateNoteModal from '../components/CreateNoteModal.jsx';
import EditNoteModal from "../components/EditNoteModal.jsx";

export default function NotesList() {
  const { notes, loading, getNotes } = useNoteStore();
  const [editingNote, setEditingNote] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    getNotes();
  }, []);

  if (loading) return <Spinner size="xl" />;

  return (
    <Box p={6}>
      <Button colorScheme="blue" mb={4} onClick={() => setShowCreate(true)}>
        + Create Note
      </Button>

      <VStack spacing={4} align="stretch">
        {notes.map((note) => (
          <Box
            key={note._id}
            p={4}
            border="1px solid #ddd"
            borderRadius="md"
            onClick={() => setEditingNote(note)}
            _hover={{ bg: "gray.100", cursor: "pointer" }}
          >
            <Text fontWeight="bold">{note.title}</Text>
            <Text noOfLines={1}>{note.content}</Text>
          </Box>
        ))}
      </VStack>

      <CreateNoteModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
      <EditNoteModal note={editingNote} onClose={() => setEditingNote(null)} />
    </Box>
  );
}
