import {
  Box,
  Flex,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  Spinner,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAdminAuditLogStore } from "../store/auditlog.admin.js";

export default function AuditLog() {
  const logs = useAdminAuditLogStore((s) => s.logs);
  const pagination = useAdminAuditLogStore((s) => s.pagination);
  const loading = useAdminAuditLogStore((s) => s.loading);
  const getAuditLogs = useAdminAuditLogStore((s) => s.getAuditLogs);

  const [page, setPage] = useState(1);

  useEffect(() => {
    getAuditLogs({
      page,
      limit: 10,
    });
  }, [page]);

  return (
    <Box p={8}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Audit Logs</Heading>
          <Text fontSize="sm" color="gray.400">
            System activity history
          </Text>
        </Box>
      </Flex>

      {/* Table */}
      <Box bg="gray.800" borderRadius="md" overflow="hidden">
        {loading ? (
          <Flex justify="center" py={10}>
            <Spinner />
          </Flex>
        ) : (
          <Table size="sm">
            <Thead bg="gray.700">
              <Tr>
                <Th color="gray.300">Time</Th>
                <Th color="gray.300">Actor</Th>
                <Th color="gray.300">Role</Th>
                <Th color="gray.300">Action</Th>
                <Th color="gray.300">Target</Th>
                <Th color="gray.300">Metadata</Th>
              </Tr>
            </Thead>

            <Tbody>
              {logs.map((log) => (
                <Tr key={log._id}>
                  <Td color="gray.200">
                    {new Date(log.createdAt).toLocaleString()}
                  </Td>

                  <Td fontSize="sm" color="gray.200">
                    {log.actorId}
                  </Td>

                  <Td>
                    <Tag
                      size="sm"
                      colorScheme={
                        log.actorRole === "admin"
                          ? "purple"
                          : "gray"
                      }
                    >
                      {log.actorRole}
                    </Tag>
                  </Td>

                  <Td>
                    <Tag size="sm" colorScheme="blue">
                      {log.action}
                    </Tag>
                  </Td>

                  <Td>
                    {log.targetType}
                    {log.targetId && (
                      <Text fontSize="xs" color="gray.400">
                        {log.targetId}
                      </Text>
                    )}
                  </Td>

                  <Td maxW="300px">
                    <Text
                      fontSize="xs"
                      color="gray.400"
                      noOfLines={3}
                    >
                      {log.metadata
                        ? JSON.stringify(log.metadata)
                        : "-"}
                    </Text>
                  </Td>
                </Tr>
              ))}

              {!logs.length && (
                <Tr>
                  <Td colSpan={6}>
                    <Text
                      textAlign="center"
                      py={6}
                      color="gray.400"
                    >
                      No audit logs found
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Pagination */}
      <Flex justify="space-between" mt={6}>
        <Text fontSize="sm" color="gray.400">
          Page {pagination.page} of {pagination.totalPages}
        </Text>

        <Flex gap={2}>
          <Button
            size="sm"
            isDisabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>

          <Button
            size="sm"
            isDisabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
