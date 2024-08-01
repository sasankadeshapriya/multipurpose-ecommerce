const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { User, PasswordReset } = require('../models');
const sendEmail = require('../utils/email');
const validator = require('fastest-validator');
const v = new validator();

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Validate email
  const schema = {
    email: { type: 'email', max: 255 },
  };

  const check = v.validate({ email }, schema);

  if (check !== true) {
    return res.status(400).send({
      message: 'Validation failed',
      errors: check,
    });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Generate a token
    const token = crypto.randomBytes(20).toString('hex');
    const expiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now

    // Store token in the database
    await PasswordReset.create({
      email: user.email,
      token,
      expiry: new Date(expiry),
    });

    // Construct the reset link
    const resetLink = `${process.env.SITE_URL}/password/reset-password?token=${encodeURIComponent(token)}`;

    // Prepare email content
    const emailContent = {
      to: user.email,
      subject: 'Password Reset',
      text: `You requested a password reset. Please use the following link to reset your password: ${resetLink}`,
      html: `<p>You requested a password reset.</p> <p> Please use the following link to reset your password: ${resetLink}</p>`,
    };

    // Send email with the reset link
    await sendEmail(emailContent);

    res.send({ message: 'Password reset link sent' });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  // Validate input
  const schema = {
    token: { type: 'string', min: 1 },
    newPassword: { type: 'string', min: 6, max: 255 },
  };

  const check = v.validate({ token, newPassword }, schema);

  if (check !== true) {
    return res.status(400).send({
      message: 'Validation failed',
      errors: check,
    });
  }

  try {
    const resetRequest = await PasswordReset.findOne({ where: { token } });
    if (!resetRequest || resetRequest.expiry < Date.now()) {
      return res.status(400).send({ message: 'Invalid or expired token' });
    }

    const user = await User.findOne({ where: { email: resetRequest.email } });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Hash the new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Update the user's password
    await user.update({ password: hashedPassword });

    // Delete the password reset request
    await PasswordReset.destroy({ where: { token } });

    const emailContent = {
      to: user.email,
      subject: 'Password Successfully Changed',
      text: `Your password has been successfully changed. If you did not make this change, please contact support immediately.`,
      html: `<p>Your password has been successfully changed.</p><p>If you did not make this change, please contact support immediately.</p>`,
    };    

    await sendEmail(emailContent);

    res.send({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
