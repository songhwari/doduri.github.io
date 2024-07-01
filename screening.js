let currentQuestionIndex = 0;
let displayQuestionIndex = 0;
let responses = [];
let surveyQuestions = [];
let totalQuestions = 0;

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function loadSurvey() {
    const surveyName = getQueryParam('name');
    if (!surveyName) {
        alert('Survey name is missing in the URL parameters.');
        return;
    }

    try {
        const response = await fetch(`survey_${surveyName}.txt`);
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim());
        surveyQuestions = lines.map(line => {
            const parts = line.split('|');
            if (parts[0].startsWith('*')) {
                return {
                    question: parts[0].substring(1),
                    options: [{ text: 'Free Text', score: 0, isFreeText: true }]
                };
            } else {
                return {
                    question: parts[0],
                    options: parts.slice(1).map(option => {
                        const [text, score] = option.split('/');
                        return { text, score: parseInt(score, 10) };
                    })
                };
            }
        });

        totalQuestions = surveyQuestions.filter(q => q.options.length > 1 || q.options[0].isFreeText).length;
        displayQuestion();
    } catch (error) {
        console.error('Error loading survey:', error);
    }
}

function displayQuestion() {
    const form = document.getElementById('dynamicQuestions');
    form.innerHTML = ''; // Clear previous question

    if (currentQuestionIndex >= surveyQuestions.length) {
        document.getElementById('completeButton').style.display = 'block';
        return;
    }

    const questionData = surveyQuestions[currentQuestionIndex];
    const div = document.createElement('div');
    div.classList.add('question', 'mb-4');
    
    const label = document.createElement('label');
    label.textContent = questionData.question;
    div.appendChild(label);
    div.appendChild(document.createElement('br'));
    
    questionData.options.forEach(option => {
        if (option.isFreeText) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control mb-2';
            input.oninput = () => handleFreeTextInput(input.value);
            div.appendChild(input);
        } else {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-secondary btn-block mb-2';
            button.textContent = option.text;
            button.onclick = () => handleOptionClick(option.score);
            div.appendChild(button);
        }
    });
    
    form.appendChild(div);
    
    if (questionData.options.length > 1 || questionData.options[0].isFreeText) {
        updateQuestionCounter();
        displayQuestionIndex++;
    } else {
        updateQuestionCounter(true);
    }

    if (currentQuestionIndex > 0) {
        document.getElementById('backButton').style.display = 'block';
    } else {
        document.getElementById('backButton').style.display = 'none';
    }
}

function updateQuestionCounter(skip = false) {
    const counterDiv = document.getElementById('questionCounter');
    if (skip) {
        counterDiv.textContent = '';
    } else {
        counterDiv.textContent = `Question ${displayQuestionIndex + 1} of ${totalQuestions}`;
    }
}

function handleOptionClick(score) {
    responses[currentQuestionIndex] = score;
    currentQuestionIndex++;
    displayQuestion();
}

function handleFreeTextInput(value) {
    responses[currentQuestionIndex] = value ? 0 : null;
    document.getElementById('completeButton').style.display = value ? 'block' : 'none';
}

function goBack() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestionIndex--;
        displayQuestion();
    }
}

function calculateScore() {
    const score = responses.reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : 0), 0);
    const summaryContent = document.getElementById('summaryContent');
    summaryContent.innerHTML = '';

    surveyQuestions.forEach((questionData, index) => {
        const response = responses[index];
        const responseText = typeof response === 'number'
            ? questionData.options.find(option => option.score === response).text
            : response;
        const div = document.createElement('div');
        div.textContent = `${questionData.question}: ${responseText}`;
        summaryContent.appendChild(div);
    });

    const resultDiv = document.createElement('div');
    resultDiv.className = 'mt-4';
    resultDiv.innerHTML = `<strong>Your total score is: ${score}</strong>`;
    summaryContent.appendChild(resultDiv);

    document.getElementById('surveyForm').style.display = 'none';
    document.getElementById('summary').style.display = 'block';
}

window.onload = loadSurvey;
