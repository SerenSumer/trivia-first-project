const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const highScoreDisplay = document.getElementById("high-score-display");
const finalScore = document.getElementById("final-score");
const questionNumber = document.getElementById("question-number");
const timerDisplay = document.getElementById("timer");
const questionText = document.getElementById("question-text");
const answerButtons = document.getElementById("answer-buttons");

// Oyun Değişkenleri
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let canClick = true;

let highScore = localStorage.getItem("trivia-high-score") || 0;
highScoreDisplay.innerHTML = highScore;

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

async function fetchQuestions() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple"
    );
    const data = await response.json();
    questions = data.results;
  } catch (error) {
    /*  questionText.textContent =
            'HATA OLUSTU.';

        console.error(error);*/
    console.error("Sorular yuklenmedi", error);
    questionText.innerText =
      "Sorular yüklenirken bir hata oluştu.Lütfen tekrar deneyin.";
  }
}
async function startGame() {
  startScreen.classList.remove("active");
  resultScreen.classList.remove("active");
  quizScreen.classList.add("active");
  currentQuestionIndex = 0;
  score = 0;
  questionText.innerText = "Yukleniyor Lütfen Bekleyiniz";
  answerButtons.innerText ="";
  //soru şıkları manipülasyonu

  await fetchQuestions();
  showQuestion();
}

function decodeHtml(html) {
  const text = document.createElement("textarea");
  text.innerHTML = html;
  return text.value;
}
function showQuestion() {
  resetState();
  startTimer();
  const currentQuestion = questions[currentQuestionIndex];
  questionNumber.innerText = `Soru ${currentQuestionIndex + 1}/${questions.length}`;
  questionText.innerHTML = decodeHtml(currentQuestion.question);
  const answers = [
    currentQuestion.correct_answer,
    ...currentQuestion.incorrect_answers,
  ];
  const shuffleAnswers = answers.sort(() => Math.random() - 0.5);

  shuffleAnswers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = decodeHtml(answer);
    button.classList.add('btn');

    if (answer === currentQuestion.correct_answer) {
      button.dataset.correct = true;
    }
    button.addEventListener('click', selectAnswer);
    answerButtons.appendChild(button);
  });
}
function selectAnswer(e) {
  clearInterval(timer); //süreyi sıfırladık.
  const selectedBtn = e.target; //hadeflenmiş,seçilmiş buton.
  const isCorrectBtn = selectedBtn.dataset.correct === "true";
  //Bu buton doğru bulon mu
  if (isCorrectBtn) {
    selectedBtn.classList.add("correct");
    score += 10; // Doğru cevap başına 10 puan ekle (Toplam 10 soru = 100 puan)
  } else {
    selectedBtn.classList.add("wrong"); // Yanlışsa kırmızı yap (CSS .wrong sınıfı)
  }

  // Ekrandaki tüm şık butonlarını döngüye al,array olması sbebi answwer bir ID oluğu için 4 butonu diziymiş gibi gösteriyoruz.
  Array.from(answerButtons.children).forEach((button) => {
    // Eğer buton doğru cevapsa, oyuncu tıklamasa bile onu yeşil yap
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.classList.add("disabled");
  });
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      endGame();
    }
  }, 2000); //2 sn sonra diğer soruya geçecek.
}
function resetState(params) {
  clearInterval(timer);
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}
function startTimer() {
timeLeft = 15;
            timerDisplay.innerText = `Süre: ${timeLeft}s`;

            timer = setInterval(() => {
                timeLeft--;
                timerDisplay.innerText = `Süre: ${timeLeft}s`;

                if (timeLeft <= 0) {
                    clearInterval(timer);
                    handleTimeOut();
                }
            }, 1000);

}
function endGame() {

    quizScreen.classList.remove('active');
            resultScreen.classList.add('active');
            finalScore.innerText = score;

            if (score > highScore) {
                highScore = score;
                localStorage.setItem('triviaHighScore', highScore);
                highScoreDisplay.innerText = highScore;
                alert("Tebrikler! Yeni bir rekora imza attin!");
            }
}
