import React, { Component } from 'react';
import {
  Box, ChakraProvider, theme, Text, Center, ModalCloseButton, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader, ModalBody,
  ModalFooter,
  Button
} from '@chakra-ui/react';
import ThreadCard from './threadCard'; // Import the ThreadCard component

class Threads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      likes: this.props.threads.map(thread => thread.likes),
      isDarkMode: document.documentElement.classList.contains('dark'),
      showModal: false, // Add this state variable
      selectedThreadId: null, // Add this state variable
    };
  }

  handleLikeClick = async (index) => {
    const { threads } = this.props;
    const { likes } = this.state;

    const updatedLikes = likes.map((likeCount, idx) =>
      idx === index ? (likeCount + 1) % 2 : likeCount
    );

    this.setState({ likes: updatedLikes });

    try {
      const response = await fetch(`http://localhost:3001/threads/${threads[index].id}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ likes: updatedLikes[index] }), // Send updated likes
      });

      if (response.ok) {
        // Like updated successfully in the backend
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  openConfirmationModal = (threadId) => {
    this.setState({
      showModal: true,
      selectedThreadId: threadId,
    });
  };

  // Function to close the confirmation modal
  closeConfirmationModal = () => {
    this.setState({
      showModal: false,
      selectedThreadId: null,
    });
  };

  deletethread = async (threadId) => {
    try {
      const response = await fetch(`http://localhost:3001/thread/${this.props.username}/${threadId}`, {
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
      console.error('Error deleting thread:', error);
    }
  };


  render() {
    const { threads, username } = this.props;
    const { likes, isDarkMode } = this.state;
    const bgColor = isDarkMode ? 'black' : 'white'; // Background color based on mode
    const textColor = isDarkMode ? 'white' : 'black';

    // Check if there are no threads available
    if (!threads || threads.length === 0) {
      return (<Box
        p="4"
        bg={bgColor}
        color={textColor}
        fontSize="lg"
        width={{ base: '100%', md: '40%' }}
        mx="auto"
        display="flex"
      >
        <Center flex="1"><Text> No threads available </Text></Center>
      </Box>);
    }

    return (
      <ChakraProvider theme={theme}>
        <Box width={{ base: '100%', md: '40%' }} mx="auto">
          {threads.map((thread, index) => (
            <ThreadCard
              key={thread.id}
              id = {thread.id}
              index={index}
              username={username}
              content={thread.content}
              likes={likes[index]} // Use likes from state
              isDarkMode={isDarkMode}
              replies={thread.replies}
              onLikeClick={() => this.handleLikeClick(index)}
              deletethread={() => this.openConfirmationModal(thread.id)}
              loadUser = {this.props.loadUser}
              googleId = {this.props.googleId}
              threads = {threads}
            />
          ))}
        </Box>
        <Modal isOpen={this.state.showModal} onClose={this.closeConfirmationModal}>
          <ModalOverlay />
          <ModalContent bgColor={bgColor} textColor={textColor}>
            <ModalHeader>Confirm Thread Deletion</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete this thread?
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => {
                this.deletethread(this.state.selectedThreadId);
                this.closeConfirmationModal();
              }}>
                Yes
              </Button>
              <Button variant="ghost" onClick={this.closeConfirmationModal} textColor={textColor}>No</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </ChakraProvider>
    );
  }
}

export default Threads;

