const ContactMessage = require('../models/ContactMessage');

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = new ContactMessage({
      name,
      email,
      subject,
      message,
    });

    await contact.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitContactMessage,
  getContactMessages,
};
