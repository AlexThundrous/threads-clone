import React, { Component } from 'react';
import {
  Box,
  ChakraProvider,
  theme,
  Text,
  Center,
  ModalCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import CommentCard from './commentcard'; // Assuming you have a CommentCard component

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: document.documentElement.classList.contains('dark'),
      showModal: false, // Add this state variable
      selectedReplyId: null, // Add this state variable
    };
  }

  openConfirmationModal = (replyId) => {
    this.setState({
      showModal: true,
      selectedReplyId: replyId,
    });
  };

  // Function to close the confirmation modal
  closeConfirmationModal = () => {
    this.setState({
      showModal: false,
      selectedReplyId: null,
    });
  };

  deletethread = async (replyId) => {
    try {
        const response = await fetch(`http://localhost:3001/thread/${this.props.username}/${this.props.threadId}/${replyId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            window.location.reload();
          } else {
            // Handle error
            console.error('Error deleting thread:', response.statusText);
          }
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  render() {
    const { replies, username } = this.props;
    const { isDarkMode } = this.state;
    const bgColor = isDarkMode ? 'black' : 'white'; // Background color based on mode
    const textColor = isDarkMode ? 'white' : 'black';

    // Check if there are no replies available
    if (!replies || replies.length === 0) {
      return (
        <Box
          p="4"
          bg={bgColor}
          color={textColor}
          fontSize="lg"
          width={{ base: '100%', md: '40%' }}
          mx="auto"
          display="flex"
        >
          <Center flex="1">
            <Text> No replies available </Text>
          </Center>
        </Box>
      );
    }

    return (
      <ChakraProvider theme={theme}>
        <Box width={{ base: '100%', md: '40%' }} mx="auto">
          {replies.map((reply) => (
            <CommentCard
              key={reply.id}
              username={username}
              content={reply.content}
              isDarkMode={isDarkMode}
              deletethread={() => this.openConfirmationModal(reply.id)}
            />
          ))}
        </Box>
        <Modal isOpen={this.state.showModal} onClose={this.closeConfirmationModal}>
          <ModalOverlay />
          <ModalContent bgColor={bgColor} textColor={textColor}>
            <ModalHeader>Confirm Reply Deletion</ModalHeader>
            <ModalCloseButton />
            <ModalBody>Are you sure you want to delete this reply?</ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  this.deletethread(this.state.selectedReplyId);
                  this.closeConfirmationModal();
                }}
              >
                Yes
              </Button>
              <Button variant="ghost" onClick={this.closeConfirmationModal} textColor={textColor}>
                No
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </ChakraProvider>
    );
  }
}

export default Comments;
