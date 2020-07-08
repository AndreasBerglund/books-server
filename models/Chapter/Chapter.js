const mongoose = require('mongoose');

const ChapterSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    book_id: {
        type: String,
        required: true
    },
    previous_chapter: {
        type: String
    },
    next_chapter: {
        type: Array
    },
    choice: {
        type: String
    }
});

module.exports = mongoose.model("Chapter", ChapterSchema);
