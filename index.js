const fs = require('fs');

// Read the three text files
const file1 = fs.readFileSync('./Page1.txt', 'utf8');
const file2 = fs.readFileSync('./Page2.txt', 'utf8');
const file3 = fs.readFileSync('./Page3.txt', 'utf8');

// Create an index object to store the word-page mappings
const index = {};

// Function to update the index for a given word and page
function updateIndex(word, page) {
  if (!index[word]) {

    if (!isNaN(word)) {
      return;
    }

    switch (word) {
      case 'and':
      case 'or':
      case '&':
      case 'of':
      case 'to':
      case 'is':
      case 'the':
      case 'a':
      case 'are':
      case 'in': break;
      default:
        index[word] = [page];

        break;
    }
  } else {
    // If the word is already present, append the page to the existing entry
    if (!index[word].includes(page)) {
      index[word].push(page);
    }
  }
}

function formatIndex(index) {
  let indexString = '';

  for (const word in index) {
    const pages = index[word];
    const pagesString = pages.join(',');

    indexString += `${word} : ${pagesString}\n`;
  }

  return indexString;
}


// Function to process a text and update the index
function processText(text, page) {
  // Remove special characters and split the text into words
  let words = text.replace(/[^\w\s]/gi, '').replace(/[\n\r]/g, ' ').split(' ');


  // Update the index for each word
  for (const word of words) {
    if (word !== '') {
      updateIndex(word, page);
    }
  }
}


// Process each text file
processText(file1, 1);
processText(file2, 2);
processText(file3, 3);

const contentArray = Object.entries(index).map(([word, pages]) => ({ word, pages }));

// Sort the array based on the keys (words) in ascending order
contentArray.sort((a, b) => a.word.localeCompare(b.word));

// Convert the sorted array back to the desired format
const sortedContent = contentArray.reduce((acc, { word, pages }) => {
  acc[word] = pages;
  return acc;
}, {});

// Function to format the index as a string
function formatIndex(index) {
  let indexString = '';

  for (const word in index) {
    const pages = index[word];
    const pagesString = pages.join(',');

    indexString += `${word} : ${pagesString}\n`;
  }

  return indexString.replace(/"/g, '');
}
const indexString = formatIndex(sortedContent);

fs.writeFileSync('index.txt', `Word : Page Numbers\n------------------\n` + indexString, 'utf8');
