let currentQuestionIndex = 0;
let responses = [];

const questionsData = [
    {
        id: 'recipient',
        text: 'Are you the vaccine recipient?',
        options: ['Myself', 'My Child'],
        type: 'single'
    },
    {
        id: 'vaccinationType',
        text: 'Type of vaccination:',
        options: ['Routine', 'COVID', 'Influenza'],
        type: 'single'
    },
    {
        id: 'ageGroup',
        text: 'Age group:',
        options: ['Under 12', '12 and Over'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID'
    },
    {
        id: 'covidOver12',
        text: 'Are you feeling sick today?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === '12 and Over'
    },
    {
        id: 'covidOver12',
        text: 'Have you received a COVID-19 vaccination before?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === '12 and Over'
    },
    {
        id: 'covidOver12',
        text: 'Have you had an adverse or allergic reaction to a prior COVID vaccine, anaphylaxis due to any cause, or allergic reaction to any other vaccine or injectable therapy?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === '12 and Over'
    },
    {
        id: 'covidOver12',
        text: 'Do you have hemophilia or other bleeding disorder or take blood thinner?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === '12 and Over'
    },
    {
        id: 'covidOver12',
        text: 'Are you, or might you be, pregnant?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === '12 and Over'
    },
    {
        id: 'covidOver12',
        text: 'Do you have an immunocompromising condition (HIV/AIDS, cancer, leukemia, etc.) or take an immunocompromising medicine or treatment (steroids, chemotherapy, radiation therapy, etc.)?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === '12 and Over'
    },
    {
        id: 'covidOver12',
        text: 'Have you received a smallpox/mpox vaccine in the past month, or plan to receive smallpox/mpox vaccine today?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === '12 and Over'
    },
    {
        id: 'covidOver12',
        text: 'Check all that apply to the person being vaccinated:',
        options: [
            'History of COVID-19 disease within the past 3 months',
            'History of multi-system inflammatory syndrome (MIS-C or MIS –A)',
            'History of myocarditis or pericarditis within 3 weeks after a dose of any COVID-19 vaccine'
        ],
        type: 'multiple',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === '12 and Over'
    }
];

function displayQuestion(index) {
    const dynamicQuestions = document.getElementById('dynamicQuestions');
    dynamicQuestions.innerHTML = ''; // Clear previous question

    if (index >= questionsData.length) {
        document.getElementById('nextButton').style.display = 'none';
        document.getElementById('completeButton').style.display = 'block';
        return;
    }

    const questionData = questionsData[index];
    if (questionData.condition && !questionData.condition()) {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
        return;
    }

    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.innerHTML = `<label class="h5">${questionData.text}</label>`;

    if (questionData.type === 'single') {
        questionData.options.forEach(option => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-secondary btn-block';
            button.textContent = option;
            button.onclick = () => handleSingleChoice(questionData.id, option);
            questionDiv.appendChild(button);
        });
    } else if (questionData.type === 'multiple') {
        questionData.options.forEach(option => {
            const label = document.createElement('label');
            label.className = 'form-check';
            label.innerHTML = `<input type="checkbox" class="form-check-input" value="${option}"> ${option}`;
            questionDiv.appendChild(label);
        });

        const completeButton = document.createElement('button');
        completeButton.type = 'button';
        completeButton.className = 'btn btn-secondary btn-block';
        completeButton.textContent = 'Complete Selection';
        completeButton.onclick = () => handleMultipleChoice(questionData.id);
        questionDiv.appendChild(completeButton);
    }

    dynamicQuestions.appendChild(questionDiv);
}

function handleSingleChoice(questionId, choice) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.id = questionId;
    input.value = choice;
    document.getElementById('surveyForm').appendChild(input);

    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex);
}

function handleMultipleChoice(questionId) {
    const checkboxes = document.querySelectorAll(`input[type="checkbox"]`);
    const selectedValues = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    
    const input = document.createElement('input');
    input.type = 'hidden';
    input.id = questionId;
    input.value = selectedValues.join(', ');
    document.getElementById('surveyForm').appendChild(input);

    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex);
}

function showSummary() {
    const summaryContent = document.getElementById('summaryContent');
    summaryContent.innerHTML = '';

    const inputs = document.querySelectorAll('#surveyForm input[type="hidden"]');
    inputs.forEach(input => {
        const responseDiv = document.createElement('div');
        responseDiv.textContent = `${input.id}: ${input.value}`;
        summaryContent.appendChild(responseDiv);
    });

    document.getElementById('surveyForm').style.display = 'none';
    document.getElementById('summary').style.display = 'block';
}

window.onload = function() {
    displayQuestion(currentQuestionIndex);
};
