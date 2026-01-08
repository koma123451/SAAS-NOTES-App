import { useEffect, useState } from "react";
import { useNoteStore } from "../store/note";
import { Box, Button, Spinner, VStack, Text,HStack } from "@chakra-ui/react";
import CreateNoteModal from '../components/CreateNoteModal.jsx';
import EditNoteModal from "../components/EditNoteModal.jsx";
import { useToast } from "@chakra-ui/react";   
import { socket } from "../../realtime/socket.js"  
export default function NotesList() {
  const { notes, loading, getNotes,pagination } = useNoteStore();
  const toast = useToast();
  const [editingNote, setEditingNote] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [page,setPage]=useState(1)

  useEffect(() => {
    getNotes({
      page,
      limit: 3,
      sort: "createdAt:desc"
    });
  }, [page, getNotes]);
  useEffect(()=>{
    const handler = ()=>{
      toast({
        title:"New note created",
        description:"Your notes list has been updated",
        status:"info",
        duration:3000,
        isClosable:true,
      })
    };
    socket.on("note:created",handler)
    return ()=>{
      socket.off("note:created",handler)
    }
  },[])

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
            _hover={{ bg: "gray.500", cursor: "pointer" }}
          >
            <Text fontWeight="bold">{note.title}</Text>
            <Text noOfLines={1}>{note.content}</Text>
          </Box>
        ))}
      </VStack>
{/* Pagination */}
      <HStack mt={6} spacing={4} justify="center">
        <Button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          isDisabled={page === 1}
        >
          Pre
        </Button>

        <Text>Page: {page}/{pagination.totalPages}</Text>

        <Button
          onClick={() => setPage(page+1)}
          isDisabled={page>=pagination.totalPages}
        >
          Next
        </Button>
      </HStack>
      <CreateNoteModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
      <EditNoteModal note={editingNote} onClose={() => setEditingNote(null)} />
    </Box>
  );
}
