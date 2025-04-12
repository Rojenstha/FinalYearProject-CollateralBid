const MessageModel = require("../models/Message");

exports.sendMessage = (req, res) => {
  MessageModel.create(req.body)
    .then(() => res.json({ message: "Message sent successfully!" }))
    .catch(() => res.json({ error: "Failed to send message!" }));
};

exports.allMessage = async(req, res) => {
    try{
        const allmessages = await MessageModel.find();
        res.json(allmessages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
