require('dotenv').config();

module.exports = {
  development: {
    username: 'eguono',
    password: null,
    database: 'document',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: 'eguono',
    password: null,
    database: 'document_test',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL'
  }
};
