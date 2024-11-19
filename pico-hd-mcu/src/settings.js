const fs = require('fs');

const readSettings = (key) => {
  try {
    const data = fs.readFile(`./settings.${key}.json`, 'utf8');
    const storage = JSON.parse(data);
    return storage;
  } catch (error) {
    return null;
  }
};

const updateSettings = (key, data) => {
  try {
    fs.writeFile(`./settings.${key}.json`, JSON.stringify(data));
  }
  catch (error) {
    console.error(error);
  }
}

module.exports = { readSettings, updateSettings };