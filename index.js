require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ | MongoDB connected'))
  .catch(err => console.log('❌ | MongoDB connection error:', err));

// Create a schema for responses
const responseSchema = new mongoose.Schema({
    keyword: String,
    reply: String
});

const Response = mongoose.model('Response', responseSchema);

app.get('/', async (req, res) => {
    const keyword = req.query.keyword;
    const reply = req.query.reply;
    const message = req.query.message;

    if (keyword && reply) {
        const formattedKeyword = keyword.toLowerCase().trim();
        const formattedReply = reply.trim();

        // Save new response to the database
        await Response.findOneAndUpdate(
            { keyword: formattedKeyword },
            { reply: formattedReply },
            { upsert: true }
        );

        return res.json({
            status: 'success',
            message: '🤍 | Successfully added new reply'
        });
    } else if (message) {
        const formattedMessage = message.toLowerCase().trim();

        let responseText = "I can't understand 😫\n\nPlease Teach Me!🙂🫠";

        // Find the response from the database
        const response = await Response.findOne({ keyword: { $regex: formattedMessage, $options: 'i' } });

        if (response) {
            responseText = response.reply;
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

// Start the server
app.listen(PORT, () => {
    console.log(`✅ | Server running on port ${PORT}`);
});
