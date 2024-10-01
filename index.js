const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Function to load responses from responses.json
function loadResponses() {
    try {
        // Check if the responses.json file exists
        if (!fs.existsSync('responses.json')) {
            fs.writeFileSync('responses.json', '{}'); // Create an empty file if it doesn't exist
        }
        const data = fs.readFileSync('responses.json', 'utf-8');
        return JSON.parse(data) || {};
    } catch (error) {
        console.error("Error reading or parsing responses.json:", error);
        return {};
    }
}

// Load responses into memory
let responses = loadResponses();

// Function to save responses to responses.json
function saveResponses(responses) {
    try {
        fs.writeFileSync('responses.json', JSON.stringify(responses, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error saving responses.json:", error);
    }
}

// Route to handle teaching new keywords or getting a reply for a message
app.get('/', (req, res) => {
    const keyword = req.query.keyword;
    const reply = req.query.reply;
    const message = req.query.message;

    // Adding a new keyword-reply pair
    if (keyword && reply) {
        const formattedKeyword = keyword.toLowerCase().trim();
        const formattedReply = reply.trim();

        responses[formattedKeyword] = formattedReply;

        saveResponses(responses);

        return res.json({
            status: 'success',
            message: '🤍 | Successfully added new reply'
        });
    }
    // Replying based on message
    else if (message) {
        const formattedMessage = message.toLowerCase().trim();
        let responseText = "I can't understand 😫\n\nPlease Teach Me!🙂🫠\n\nIf any question, contact to admin💚👾Facebook: https://www.facebook.com/id.link.niye.muri.khaw/"; // Default response

        // Look for keyword in the message
        for (const [keyword, response] of Object.entries(responses)) {
            if (formattedMessage.includes(keyword)) {
                responseText = response;
                break;
            }
        }

        return res.json({
            status: 'success',
            response: responseText
        });
    }
    // Error if neither keyword/reply nor message is provided
    else {
        return res.json({
            status: 'error',
            message: '❌ | No message or keyword/reply provided.'
        });
    }
});

// Handle invalid routes or methods
app.use((req, res) => {
    return res.json({
        status: 'error',
        message: '⚠ | Invalid request method. Please use GET.'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Internal Server Error: ", err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ | Server running on port ${PORT}`);
});
