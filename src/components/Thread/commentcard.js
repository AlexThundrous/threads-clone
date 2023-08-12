import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, Button, Text, Icon} from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';

const CommentCard = ({ username, content, isDarkMode, deletethread, addNewComment }) => {

  const bgColor = isDarkMode ? 'black' : 'white'; // Background color based on mode
  const textColor = isDarkMode ? 'white' : 'black';

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
        justifyContent="space-between"
        width="100%"
      >
        <Text fontWeight="bold">{username}</Text>
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
    </Box>
  );
};

export default CommentCard;
