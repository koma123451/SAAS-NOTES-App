import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import { useUserStore } from "../store/user";
import { useToast } from '@chakra-ui/react'
import { useNavigate } from "react-router";
export default function Register() {
  const register = useUserStore((s) => s.register);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast()
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res=await register(username, email, password);
    if(!res.success){
        toast({
          title: res.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
      })
      }
      else{
      toast({
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 3000,
          isClosable: true,
    })
    navigate("/login")
  }
}

  return (
    <Flex height="100vh" align="center" justify="center">
      <Box p={8} maxWidth="400px" borderWidth={1} borderRadius="lg">
        <Heading mb={6} textAlign="center">
          Register
        </Heading>

        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>Username</FormLabel>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>

          <FormControl mb={6}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>

          <Button colorScheme="green" width="full" type="submit">
            Register
          </Button>
        </form>
      </Box>
    </Flex>
  );
}
