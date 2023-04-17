import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
//
import Scrollbar from '../../../components/Scrollbar';
// import LightboxModal from '../../../components/LightboxModal';
import ChatMessageItem from './ChatMessageItem';

// ----------------------------------------------------------------------

ChatMessageList.propTypes = {
  // conversation: PropTypes.object.isRequired,
  messages: PropTypes.array
};

export default function ChatMessageList({ messages }) {
  const scrollRef = useRef(null);

  // const [openLightbox, setOpenLightbox] = useState(false);

  // const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
  }, [messages]);

  // const imagesLightbox = messages
  //   .filter((messages) => messages.contentType === 'image')
  //   .map((messages) => messages.body);

  // const handleOpenLightbox = (url) => {
  //   const selectedImage = imagesLightbox.findIndex((index) => index === url);
  //   setOpenLightbox(true);
  //   setSelectedImage(selectedImage);
  // };

  return (
    <>
      <Scrollbar scrollableNodeProps={{ ref: scrollRef }} sx={{ p: 3, height: 1 }}>
        {messages && messages?.map((message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            // conversation={}
            // onOpenLightbox={handleOpenLightbox}
          />
        ))}
      </Scrollbar>

      {/* <LightboxModal
        images={imagesLightbox}
        mainSrc={imagesLightbox[selectedImage]}
        photoIndex={selectedImage}
        setPhotoIndex={setSelectedImage}
        isOpen={openLightbox}
        onCloseRequest={() => setOpenLightbox(false)}
      /> */}
    </>
  );
}
