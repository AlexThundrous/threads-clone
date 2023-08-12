import React, { useState } from 'react';
import { Box, Avatar, Text, ChakraProvider, theme, Icon, Input, Textarea, Button } from '@chakra-ui/react';
import { FaInstagram } from 'react-icons/fa';
import { FiLogOut, FiEdit, FiSave } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const Profile = ({ name, username, description, imageUrl, isDarkMode, id }) => {
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedUsername, setEditedUsername] = useState(username);
  const [editedDescription, setEditedDescription] = useState(description);

  const bgColor = isDarkMode ? 'black' : 'white';
  const textColor = isDarkMode ? 'white' : 'black';
  const borderColor = isDarkMode ? 'white' : 'black';

  const handleEditClick = () => {
    setEditedName(name);
    setEditedUsername(username);
    setEditedDescription(description);
    setEditing(!editing);
  };

  const handleSaveClick = () => {
    const updatedProfile = {
      name: editedName,
      username: editedUsername,
      description: editedDescription,
    };
    fetch('http://localhost:3001/update', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        googleId: id,
        name: updatedProfile.name,
        username: updatedProfile.username,
        description: updatedProfile.description,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setEditing(false);
        window.location.reload();
      })
      .catch((error) => {
        // Handle error, show an error message or take appropriate action
        console.error('Error updating profile:', error);
      });
  };
  

  return (
    <ChakraProvider theme={theme}>
      <Box
        p="4"
        bg={bgColor}
        color={textColor}
        width={{ base: '100%', md: '40%' }}
        mx="auto"
        display="flex"
        flexDirection="column"
        borderBottom={`2px solid ${borderColor}`}
      >
        <Box
          p="4"
          bg={bgColor}
          color={textColor}
          fontSize="2xl"
          width="100%"
          mx="auto"
          display="flex"
          justifyContent="space-between"
          fontWeight="bold"
        >
          Profile
          <a href={`https://instagram.com/${username}`} target="_blank" rel="noopener noreferrer">
            <Icon as={FaInstagram} boxSize="10" color="pink.500" />
          </a>
          <RouterLink to="/">
            <Icon as={FiLogOut} boxSize="8" color="gray.500" _hover={{ color: 'red.500' }} />
          </RouterLink>
        </Box>
        <Box
          p="4"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bgColor={bgColor}
          color={textColor}
          width="100%"
          mx="auto"
          marginBottom="2"
          position="relative"
        >
          <Box display="flex" flexDirection="column" alignItems="flex-start" marginTop="2">
            {editing ? (
              <>
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  marginBottom="1"
                />
                <Input
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                  marginBottom="1"
                />
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  marginBottom="8"
                />
              </>
            ) : (
              <>
                <Text fontSize="lg" fontWeight="bold" marginBottom="1">
                  {name}
                </Text>
                <Text fontSize="md" color="gray.400" marginBottom="8">
                  {username} &nbsp;
                  <span className="inline-flex items-center rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    threads.net
                  </span>
                </Text>
                <Text>{description}</Text>
              </>
            )}
          </Box>
          <Avatar
            size="xl"
            src={imageUrl}
            alt={`${name}'s profile picture`}
            marginLeft="2"
          />
        </Box>
        <Box textAlign="left" paddingTop="2" paddingLeft="2">
          {editing ? (
            <Button
              leftIcon={<FiSave />}
              colorScheme={bgColor}
              onClick={handleSaveClick}
            >
              Save Changes
            </Button>
          ) : (
            <Button
              leftIcon={<FiEdit />}
              colorScheme={bgColor}
              onClick={handleEditClick}
            >
              Edit Profile
            </Button>
          )}
        </Box>
        <Text marginTop="4" textAlign="center" fontWeight="bold"> Threads </Text>
      </Box>
    </ChakraProvider>
  );
};

export default Profile;

