
const ConvoController = {
    addConversationId: (conversationId, parameter) => {
        if (Array.isArray(parameter)) {
            sessionUserData[conversationId] = {
                payload: Array.from(parameter)
            };
        } else {
            sessionUserData[conversationId] = Object.assign({}, parameter);
        }
    },
    removeConversationId: (conversationId) => {
        delete sessionUserData[conversationId];
    },
    getConversationData: (conversationId) => {
        if (sessionUserData.hasOwnProperty(conversationId)) {
            return sessionUserData[conversationId]
        }
        return null;
    }
}

module.exports = ConvoController