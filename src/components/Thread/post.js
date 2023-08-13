import React, { Component } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Textarea,
  Input,
  Image,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  IconButton,
  Spacer
} from '@chakra-ui/react';
import { FiImage, FiSmile, FiPlus } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import Threads from './threads';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      image: null,
      isModalOpen: false,
    };
  }

  handleContentChange = (event) => {
    this.setState({ content: event.target.value });
  };

  handleImageChange = (event) => {
    this.setState({ image: event.target.files[0] });
  };

  uploadImageToRemoteService = async () => {
    const { image } = this.state;

    if (!image) {
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await axios.post('http://localhost:3001/upload', formData);

      if (response.status === 200) {
        const imageUrl = response.data.imageUrl;
        return imageUrl;
      }

      return null;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  handlePostSubmit = async () => {
    const { content } = this.state;

    try {
      if (!content) {
        return;
      }

      // Assuming you have a method to upload the image to a remote service and get the URL
      const imageUrl = await this.uploadImageToRemoteService();

      const fullContent = imageUrl ? `${content} \n\n![Image](${imageUrl})` : content;

      const response = await axios.post('http://localhost:3001/post', {
        content: fullContent,
        googleId: this.props.id
      });

      const user = response.data.user;

      // Assuming you have a method to update the threads array in your parent component
      // Update the threads array in your parent component with the new post
      this.props.loadUser(user);
      this.setState({ content: '', image: null, isModalOpen: false });
      window.location.reload();
    } catch (error) {
      console.error(error);
      // Handle error here if necessary
    }
  };


  handleOpenModal = () => {
    this.setState({ isModalOpen: true });
  };

  handleToggleEmojiPicker = () => {
    this.setState((prevState) => ({ isEmojiPickerOpen: !prevState.isEmojiPickerOpen }));
  };

  handleEmojiSelect = (emojiObject) => {
    const emoji = emojiObject.emoji;
    this.setState((prevState) => ({
      content: prevState.content + emoji,
      isEmojiPickerOpen: false,
    }));
  };


  render() {
    const { content, image, isModalOpen, isEmojiPickerOpen } = this.state;
    const modalBgColor = this.props.isDarkMode ? 'black' : 'white'; // Adjust background color based on color mode
    const modalTextColor = this.props.isDarkMode ? 'white' : 'gray.900';

    return (
      <Box position="relative">
        <Flex direction="column" alignItems="center">
        <Threads isDarkMode={this.props.isDarkMode} threads={this.props.threads} username={this.props.username} googleId={this.props.id} loadUser={this.props.loadUser}/>
          <Spacer /> {/* Add spacer to push Post button to the right */}
          <Button
            colorScheme={modalBgColor}// Set your preferred color here
            textColor={modalTextColor} // Text color
            onClick={this.handleOpenModal}
            mt={2}
            ml={2}
            px={6}
            _hover={{
              bgColor: 'black', textDecoration: 'none', transform: 'scale(1.05)', // Scale up on hover
              transition: 'transform 0.2s ease'
            }} // Hover styles
            leftIcon={<FiPlus />} // Add plus icon on the left
          >
            New Thread
          </Button>
        </Flex>

        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => this.setState({ isModalOpen: false })} size="xl">
            <ModalOverlay />
            <ModalContent bg={modalBgColor}>
              <ModalHeader textColor={modalTextColor}>Create a Post</ModalHeader>
              <ModalCloseButton color={this.props.isDarkMode ? 'white' : 'gray.700'} />
              <ModalBody>
                <Textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={this.handleContentChange}
                  mb={2}
                  bg={modalBgColor}
                  textColor={modalTextColor}
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={this.handleImageChange}
                  display="none"
                  id="image-input"
                />
                <Flex justify="flex-start" align="center" mb={2} ml={-4}>
                  <Box>
                    <label htmlFor="image-input">
                      <Button
                        as="span"
                        variant="ghost"
                        colorScheme="blue"
                        _hover={{ color: 'blue.600' }}
                      >
                        <FiImage size={20} />
                      </Button>
                    </label>
                  </Box>
                  <Box ml={-4}>
                    <IconButton
                      icon={<FiSmile size={20} />}
                      variant="ghost"
                      colorScheme="blue"
                      _hover={{ color: 'blue.600' }}
                      onClick={this.handleToggleEmojiPicker}
                    />
                  </Box>
                </Flex>
                {image && <Image src={URL.createObjectURL(image)} alt="Uploaded" mb={2} />}
                {isEmojiPickerOpen && (
                  <EmojiPicker onEmojiClick={this.handleEmojiSelect} pickerStyle={{ position: 'absolute', bottom: '70px' }} />
                )}
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" onClick={this.handlePostSubmit}>
                  Post
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Box>
    );
  }
}

export default Post;



