const argon2 = require("argon2");

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (plainPassword) => {
  return argon2.hash(plainPassword, hashingOptions);
};

const verifyPassword = (plainPassword, hashedPassword) => {
  return argon2.verify(hashedPassword, plainPassword, hashingOptions);
};

hashPassword("myPlainPassword").then((hashedPassword) => {
  console.log(hashedPassword);
});

verifyPassword(
  'myPlainPassword',
  '$argon2id$v=19$m=65536,t=5,p=1$pzP5MLoeac0epZMFhbQ7CQ$NFvXHaeEOeXXi+F8kTWYfxdIp7HsEbMr9Hsb5d84Afw'
 ).then((passwordIsCorrect) => {
   console.log(passwordIsCorrect);
 });


