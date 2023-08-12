import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, Button, Text, Icon, Collapse } from '@chakra-ui/react';
import { FiTrash2, FiHeart } from 'react-icons/fi';
import { FaRegComment } from 'react-icons/fa';
import CommentPost from './commentpost'; // Import the Comments component

const ThreadCard = ({ username, content, likes, onLikeClick, isDarkMode, deletethread, replies, id }) => {
  const bgColor = isDarkMode ? 'black' : 'white'; // Background color based on mode
  const textColor = isDarkMode ? 'white' : 'black';

  const [showReplies, setShowReplies] = useState(false); // State for displaying replies

  const toggleReplies = () => {
    setShowReplies((prevShowReplies) => !prevShowReplies);
  };

  return (
    <Box
      p="4"
      bg={bgColor}
      color={textColor}
      fontSize="lg"
      width="100%"
      mx="auto"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between" // Set the alignment to space-between
        width="100%"
      >
        <Text fontWeight="bold">
          {username}
        </Text>
        <Button
          size="lg"
          leftIcon={<Icon as={FiTrash2} />}
          variant="ghost"
          colorScheme={bgColor}
          _hover={{ color: 'red.600' }}
          onClick={deletethread}
        />
      </Box>
      <ReactMarkdown>{content}</ReactMarkdown>
      <Box display="flex" alignItems="center" mt="2">
        <Button
          colorScheme={bgColor}
          size="md"
          onClick={onLikeClick}
          leftIcon={<Icon as={FiHeart} />}
        >
          {likes}
        </Button>
        <Button
          onClick={toggleReplies} // Toggle replies on button click
          colorScheme={bgColor}
          size="md"
          ml="2" // Add margin to separate the comment button
          leftIcon={<Icon as={FaRegComment} />}
        >
          Comment
        </Button>
      </Box>
      {/* Display Replies */}
      <Collapse in={showReplies} mt="3">
        <CommentPost
          replies={replies}
          username={username}
          threadId = {id}
          isDarkMode={isDarkMode}
        />
      </Collapse>
    </Box>
  );
};

export default ThreadCard;


