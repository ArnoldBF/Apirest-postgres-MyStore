const UserService = require('./user.service');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');
const nodemailer = require('nodemailer');
const config = require('./../config/config');

const service = new UserService();
class AuthService {
  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password;

    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    const token = jsonwebtoken.sign(payload, config.jwtSecret, {
      expiresIn: '2hrs',
    });
    return {
      user,
      token,
    };
  }

  async sendMail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: config.userMail,
        pass: config.userPass,
      },
    });

    await transporter.sendMail(infoMail);
    return {
      message: 'Email sent',
    };
  }

  async sendRecoveryPassword(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.notFound('User not found');
    }

    const payload = { sub: user.id };
    const token = jsonwebtoken.sign(payload, config.jwtSecretRecovery, {
      expiresIn: '15m',
    });
    const link = `http://localhost:3000/recover-password/${token}`;
    await service.update(user.id, { recoveryToken: token });
    const mail = {
      from: 'a.bazan@conecta.com.bo', // sender address
      to: `${user.email}`, // list of receivers
      subject: 'Email de recuperacion de contrasena', // Subject line
      //text: 'Hello world?', // plain text body
      html: `<b>Ingraso a este link => ${link} </b>`, // html body
    };
    const respuesta = await this.sendMail(mail);
    return respuesta;
  }

  async changePassword(token, newPassword) {
    try {
      const payload = jsonwebtoken.verify(token, config.jwtSecretRecovery);
      const user = await service.findOneForId(payload.sub);

      if (user.recoveryToken !== token) {
        throw boom.unauthorized();
      }
      await service.update(user.id, {
        recoveryToken: null,
        password: newPassword,
      });
      return {
        message: 'Password changed successfully',
      };
    } catch (error) {
      throw boom.unauthorized();
    }
  }
}

module.exports = AuthService;
