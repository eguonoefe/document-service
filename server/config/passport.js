import passportJWT from 'passport-jwt';

import db from '../models';


export default (passport) => {
  const { ExtractJwt } = passportJWT;
  const JwtStrategy = passportJWT.Strategy;
  const jwtOptions = {};
  jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  jwtOptions.secretOrKey = process.env.SECRET;

  const strategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => db.User.findOne({ where: { email: jwtPayload.email } })
    .then((user) => {
      if (user) {
        return next(null, user);
      }
      return next(null, false);
    })
    .catch((err) => next(err, false)));
  passport.use(strategy);
};
