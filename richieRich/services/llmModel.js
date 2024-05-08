const fs = require("fs");
const yaml = require("js-yaml");

const getModelResponse = async (prompt) => {
  // Simulate a response from a model
  try {
    const choice = getMockData(prompt);
    const words = choice.split(" ");
    let output = "";
    for (let word of words) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      output += word + " ";
    }

    return output;
  } catch (error) {
    console.error(error);
  }
};

const getModelResponseGenerator = async function* (prompt) {
  try {
    const choice = getMockData(prompt);
    const words = choice.split(" ");
    for (let word of words) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      yield word + " ";
    }
  } catch (error) {
    console.error(error);
  }
};

const getMockData = (prompt) => {
  const mockData = yaml.load(fs.readFileSync("mockData.yaml", "utf8"));
  const responses = mockData.responses;
  const index = prompt ? prompt.length % responses.length : 0;
  const choice = responses[index];

  return choice;
};

module.exports = { getModelResponse, getModelResponseGenerator };
