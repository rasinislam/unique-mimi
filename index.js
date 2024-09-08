const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

function loadResponses() {
    try {
        const data = fs.readFileSync('responses.json', 'utf-8');
        return JSON.parse(data) || {};
    } catch (error) {
        console.error("Error reading or parsing responses.json:", error);
        return {};
    }
}

let responses = loadResponses();

function saveResponses(responses) {
    fs.writeFileSync('responses.json', JSON.stringify(responses, null, 2), 'utf-8');
}

app.get('/', (req, res) => {
    const keyword = req.query.keyword;
    const reply = req.query.reply;
    const message = req.query.message;

    if (keyword && reply) {
        const formattedKeyword = keyword.toLowerCase().trim();
        const formattedReply = reply.trim();

        responses[formattedKeyword] = formattedReply;

        saveResponses(responses);

        return res.json({
            status: 'success',
            message: '🤍 | Successfully added new reply"'
        });
    } else if (message) {
        const formattedMessage = message.toLowerCase().trim();
        let responseText = "I can't understand 😫\n\nPlease Teach Me!\n {prefix}mayabi teach Jaan = Bolo Jaan\n\nIf any question, contact to admin\n\nFacebook: https://www.facebook.com/id.link.niye.muri.khaw/"; // Default response


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
    } else {
        return res.json({
            status: 'error',
            message: '❌ | No message or keyword/reply provided.'
        });
    }
});

app.use((req, res) => {
    return res.json({
        status: 'error',
        message: '⚠ | Invalid request method. Please use GET.'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ | Server running on port ${PORT}`);
});
