import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

function objFromArray(array, key = 'id') {
  return array.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
}

const initialState = {
  isLoading: false,
  error: null,
  contacts: { byId: {}, allIds: [] },
  conversations: [],
  nextConversations: null,
  activeConversationId: null,
  participants: [],
  recipients: [],
  currentRoom: null,
};

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET CONTACT SSUCCESS
    getContactsSuccess(state, action) {
      const contacts = action.payload;

      state.contacts.byId = objFromArray(contacts);
      state.contacts.allIds = Object.keys(state.contacts.byId);
    },

    // GET CONVERSATIONS
    getConversationsSuccess(state, action) {
      state.conversations = action.payload;
      // const conversations = action.payload;

      // state.conversations.byId = objFromArray(conversations);
      // state.conversations.allIds = Object.keys(state.conversations.byId);
      state.isLoading = false;
    },

    setNextConversations(state, action) {
      state.nextConversations = action.payload;
    },

    getMoreConversationsSuccess(state, action) {
      const newConversations = [...state.conversations, ...action.payload];
      state.conversations = newConversations;
      state.isLoading = false;
    },

    pushConversationToTop(state, action) {
      let newConversations = state.conversations.filter((item) => item.id !== action.payload.id);
      newConversations = [action.payload, ...newConversations];
      state.conversations = newConversations;
    },

    // GET CONVERSATION
    getConversationSuccess(state, action) {
      const conversation = action.payload;

      if (conversation) {
        state.conversations.byId[conversation.id] = conversation;
        state.activeConversationId = conversation.id;
        if (!state.conversations.allIds.includes(conversation.id)) {
          state.conversations.allIds.push(conversation.id);
        }
      } else {
        state.activeConversationId = null;
      }
    },

    getRoomChat(state, action) {
      state.currentRoom = action.payload;
    },

    getRoomMessages(state, action) {
      state.currentRoom = {...state.currentRoom, messages: action.payload};
    },

    addRoomMessage(state, action) {
      state.currentRoom.messages = [...state.currentRoom.messages, action.payload];
    },

    // ON SEND MESSAGE
    onSendMessage(state, action) {
      const conversation = action.payload;
      const { conversationId, messageId, message, contentType, attachments, createdAt, senderId } = conversation;

      const newMessage = {
        id: messageId,
        body: message,
        contentType,
        attachments,
        createdAt,
        senderId,
      };

      state.conversations.byId[conversationId].messages.push(newMessage);
    },

    markConversationAsReadSuccess(state, action) {
      const { conversationId } = action.payload;
      const conversation = state.conversations.byId[conversationId];
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },

    // GET PARTICIPANTS
    getParticipantsSuccess(state, action) {
      const participants = action.payload;
      state.participants = participants;
    },

    // RESET ACTIVE CONVERSATION
    resetActiveConversation(state) {
      state.activeConversationId = null;
    },

    addRecipients(state, action) {
      const recipients = action.payload;
      state.recipients = recipients;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { addRecipients, onSendMessage, resetActiveConversation, pushConversationToTop } = slice.actions;

// ----------------------------------------------------------------------

export function getContacts() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/chat/contacts');
      dispatch(slice.actions.getContactsSuccess(response.data.contacts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getConversations() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/market/chatrooms/');
      dispatch(slice.actions.getConversationsSuccess(response.data.results));
      if (response.data.next) {
        dispatch(slice.actions.setNextConversations(response.data.next));
      }
      else {
        dispatch(slice.actions.setNextConversations(''));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getNextConversations(url) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(url);
      dispatch(slice.actions.getMoreConversationsSuccess(response.data.results));
      if (response.data.next) {
        dispatch(slice.actions.setNextConversations(response.data.next));
      }
      else {
        dispatch(slice.actions.setNextConversations(''));
      }
    }
    catch (error) {
      console.log(error);
    }
  }
}

// ----------------------------------------------------------------------

export function getConversation(conversationKey) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/chat/conversation', {
        params: { conversationKey },
      });
      dispatch(slice.actions.getConversationSuccess(response.data.conversation));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
};

export function getMessagesOfRoom(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/market/chatrooms/${id}/messages/`);
      dispatch(slice.actions.getRoomMessages(response.data.results));
    }
    catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}

export function getRoomChat(roomInfo) {
  dispatch(slice.actions.getRoomChat(roomInfo));
}

// ----------------------------------------------------------------------

export function markConversationAsRead(conversationId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.get('/api/chat/conversation/mark-as-seen', {
        params: { conversationId },
      });
      dispatch(slice.actions.markConversationAsReadSuccess({ conversationId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getParticipants(conversationKey) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/chat/participants', {
        params: { conversationKey },
      });
      dispatch(slice.actions.getParticipantsSuccess(response.data.participants));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
