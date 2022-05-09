module.exports = {
  development: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.DATABASE_HOST,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',
    operatorsAliases: 0,
  },
  test: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database:  process.env.MYSQL_TEST_DATABASE,
    host: process.env.DATABASE_HOST,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',
    operatorsAliases: 0,
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false, // very important
      }
    }
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
    operatorsAliases: 0,
  },
};
