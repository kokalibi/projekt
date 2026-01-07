const bcrypt = require("bcryptjs");

(async () => {
  const hash = await bcrypt.hash("asd", 10);
  console.log(hash);
})();
