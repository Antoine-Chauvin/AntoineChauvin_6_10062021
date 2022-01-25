const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; //Vient récupérer le token dans headers authorizations, coupe l'infos à l'espace, créer un tableau avec le split puis on récup l'entrée du token qui est en 2eme pos [1]
    const decodedToken = jwt.verify(token, process.env.JTK);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')});
  }
};