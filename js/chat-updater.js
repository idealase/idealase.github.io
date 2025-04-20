/**
 * Chat History Updater
 * This script helps to automatically update the chat history JSON file
 * with new conversations between the developer and the AI assistant.
 */

class ChatUpdater {
    constructor() {
        this.chatHistoryPath = '../chat-history.json';
        this.chatHistory = [];
        this.initialized = false;
    }
    
    /**
     * Initialize the chat history from the JSON file
     */
    async init() {
        try {
            const response = await fetch(this.chatHistoryPath);
            this.chatHistory = await response.json();
            this.initialized = true;
            console.log('Chat history loaded successfully');
        } catch (error) {
            console.error('Error loading chat history:', error);
            // Initialize with empty array if file doesn't exist
            this.chatHistory = [];
            this.initialized = true;
        }
        
        return this;
    }
    
    /**
     * Add a new message to the chat history
     * @param {string} role - 'user' or 'ai'
     * @param {string} content - The message content
     */
    addMessage(role, content) {
        if (!this.initialized) {
            console.error('ChatUpdater not initialized. Call init() first');
            return;
        }
        
        this.chatHistory.push({
            role: role,
            content: content,
            timestamp: new Date().toISOString()
        });
        
        this.saveHistory();
    }
    
    /**
     * Save the chat history to the JSON file
     * Note: In a real website, this would require server-side code
     * This client-side implementation is for demonstration purposes only
     */
    saveHistory() {
        console.log('In a real implementation, this would save the chat history to the server');
        console.log('Updated chat history:', this.chatHistory);
        
        // In a real implementation, this would be a server endpoint
        // fetch('/api/save-chat', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(this.chatHistory)
        // });
        
        // For now, we'll just store in localStorage for demonstration
        localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
    }
    
    /**
     * Get the current chat history
     */
    getHistory() {
        return this.chatHistory;
    }
}

// Create a global instance for use across the site
window.chatUpdater = new ChatUpdater();

// Self-initialize when the script is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatUpdater.init()
        .then(() => console.log('Chat updater ready'));
});