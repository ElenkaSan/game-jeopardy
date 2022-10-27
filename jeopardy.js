// // categories is the main data structure for the app; it looks like this:
// //  [
// //    { title: "Math",
// //      clues: [
// //        {question: "2+2", answer: 4, showing: null},
// //        {question: "1+1", answer: 2, showing: null}
// //        ...
// //      ],
// //    },
// //    { title: "Literature",
// //      clues: [
// //        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
// //        {question: "Bell Jar Author", answer: "Plath", showing: null},
// //        ...
// //      ],
// //    },
// //    ...
// //  ]
const categoriesColTop = 6; 
const questions = 5;
let categories = [];
// /** Get NUM_CATEGORIES random category from API.
//  * Returns array of category ids
async function getCategoryIds() {
  let $ask = await axios.get(`https://jservice.io/api/categories?count=100`);
  const cats = _.sampleSize($ask.data, categoriesColTop);
  return cats.map(function(result) {
    return result.id;
  })  
}
// /** Return object with data about a category:
//  *  Returns { title: "Math", clues: clue-array }
//  * Where clue-array is:
//  *   [
//  *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//  *      {question: "Bell Jar Author", answer: "Plath", showing: null},
//  *      ...
//  *   ]
//  */
async function getCategory(catId) {
  let $ask = await axios.get(`https://jservice.io/api/category?id=${catId}`);
  let TopCell = $ask.data;
  let getClues = TopCell.clues;
  let randomPickClues = _.sampleSize(getClues, questions);
  let clues = randomPickClues.map(function(result) {
    return {
    question: result.question,
    answer: result.answer,
    showing: null,
  }})
  const newLocal = {title: TopCell.title, clues};
  return newLocal;
}
// /** Fill the HTML table#jeopardy with the categories & cells for questions.//  *
//  * - The <thead> should be filled w/a <tr>, and a <td> for each category
//  * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
//  *   each with a question for each category in a <td>
//  *   (initally, just show a "?" where the question/answer would go.)
async function fillTable() {
  const $htmlBoard = $('#board');
  $htmlBoard.empty();
  let $top = $('<tr>');
  $top.attr('id','column-top');

  for (let topId = 0; topId < categoriesColTop; topId++) {
    let headCell = $('<td>');
    $top.append(headCell.text(categories[topId].title));
  }
  $htmlBoard.append($top);
 
  for (let cardId = 0; cardId < questions; cardId++) {
    let $row = $('<tr>');
    $row.on('click', handleClick);
    for (let topId = 0; topId< categoriesColTop; topId++) {
    let $cell = $('<td>');
      $cell.attr('id', `${topId}-${cardId}`).text('🤔 ❓');
      $row.append($cell);
    }
    $htmlBoard.append($row);
  }
}

// /** Handle clicking on a clue: show the question or answer.
//  *
//  * Uses .showing property on clue to determine what to show:
//  * - if currently null, show question & set .showing to "question"
//  * - if currently "question", show answer & set .showing to "answer"
//  * - if currently "answer", ignore click
//  * */
function handleClick(evt) {
  let id = evt.target.id;
  let [topId, cardId] = id.split('-');
  let clue = categories[topId].clues[cardId];
  let print;

  if (!clue.showing) {
    print = clue.question;
    clue.showing = 'question';
  } else if (clue.showing === 'question') {
    print = clue.answer;
    clue.showing = 'answer';
  } else {
    return
  }  
  $(`#${topId}-${cardId}`).html(print); 
}

//  Wipe the current Jeopardy board, show the loading spinner,
//  and update the button used to fetch data.
// function showLoadingView() {
// }

// Remove the loading spinner and update the button used to fetch data.
// function hideLoadingView() {
// }

// Start game:
//  * - get random category Ids
//  * - get data for each category
//  * - create HTML table
async function setupAndStart() {
  categories = [];
  let getIds = await getCategoryIds();  
  for (let getId of getIds) {
    categories.push(await getCategory(getId));
  }
  fillTable();
}
  /** On click of start / restart button, set up game. 
 TODO
 /** On page load, add event handler for clicking clues 
 TODO
 /** On click of restart button, restart game. */  
 const startAgain= $('#restartGame');
 startAgain.on('click', setupAndStart);
  $(async function () {
    setupAndStart();
    let $row = $('<tr>');
    $row.on('click', handleClick);
  }
)

$(document).on('click', function(evt) {
  // debugger
  $(evt.target).closest ('tr').toggleClass('active'); 
})

$('table').on('click', 'td', function() {
  $(this).css('backgroundColor', '#00fcda');
});

// $(document).on('click', function(evt) {
//   debugger
//   $(evt.target).closest('tr').addClass('active');
// })

// $(document).on('click', function(evt) {
//   debugger
//   $(evt.target).addClass('active');
// })

$(document).ready(function () {
  alert(`Are You Ready? Press OK`);
})