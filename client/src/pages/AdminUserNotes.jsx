import { useEffect,useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Spinner,
} from "@chakra-ui/react";
import {useAdminNoteStore} from '../store/note.admin.js'

export default function AdminUserNotes() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [page,setPage]= useState()

  const {
    notes,
    loading,
    getUserNotes,
    pagination,
  } = useAdminNoteStore();
  console.log("notes",notes)
  useEffect(() => {
    if (userId) {
      getUserNotes(userId,
      { page,
      limit:5,
      sort: "createdAt:desc"});
    }
  }, [userId,page]);

  return (
    <Box p={6}>
      {/* Header */}
      <Flex mb={6} align="center" justify="space-between">
        <Heading size="md">User Notes</Heading>

        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Flex>

      {/* Loading */}
      {loading && (
        <Flex justify="center" py={10}>
          <Spinner />
        </Flex>
      )}

      {/* Empty */}
      {!loading && notes.length === 0 && (
        <Text color="gray.400">No notes found.</Text>
      )}

      {/* Notes list */}
      {!loading &&
        notes.map((note) => (
          <Box
            key={note._id}
            p={4}
            mb={4}
            border="1px solid"
            borderColor="gray.700"
            borderRadius="md"
          >
            <Heading size="sm" mb={2}>
              {note.title || "Untitled"}
            </Heading>

            <Text fontSize="sm" color="gray.300">
              {note.content}
            </Text>

            {note.createdAt && (
              <Text
                mt={2}
                fontSize="xs"
                color="gray.500"
              >
                Created:{" "}
                {new Date(note.createdAt).toLocaleDateString(
                  "en-CA"
                )}
              </Text>
            )}
            
          </Box>
        ))}
        <Flex justify="space-between" mt={6}>
       <Text fontSize="sm" color="gray.400">
             Page {pagination.page} of {pagination.totalPages}
            </Text>

          <Flex gap={2}>
            <Button size="sm"
              onClick={() => setPage((page) => Math.max(1, page - 1))}>Prev</Button>
            <Button size="sm"
            onClick={() => setPage((page) => page + 1)}

            >Next</Button>
          </Flex>
        </Flex>
    </Box>
  );
}
