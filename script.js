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
    // COVID-19 questions for Age 12 and Over
    {
        id: 'covidOver12Q1',
        text: 'Are you feeling sick today?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === '12 and Over'
    },
    // (other COVID-19 questions for Age 12 and Over)
    // COVID-19 questions for Under 12
    {
        id: 'covidUnder12Q1',
        text: 'Is your child sick today?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === 'Under 12'
    },
    // (other COVID-19 questions for Under 12)
    // Influenza questions for children
    {
        id: 'influenzaQ1',
        text: 'Are you currently sick, feel ill, or have a fever over 100F?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Influenza'
    },
    {
        id: 'influenzaQ2',
        text: 'Have you had a serious reaction, other than Flu-like symptoms, following an influenza vaccine in the past?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Influenza'
    },
    {
        id: 'influenzaQ3',
        text: 'Have you ever experienced numbness or weakness of their legs or elsewhere (Guillain-Barre syndrome) within 6 weeks of receiving an influenza vaccine?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Influenza'
    },
    {
        id: 'influenzaQ4',
        text: 'Have you ever had, or been treated for, an allergic reaction (flushing, hives, wheezing, and/or low blood pressure) to any vaccine, or do they have an allergy to any of the following: gelatin, MSG, Gentamicyn, Neomycin, Połymyxin-B, thimerosal, formaldehyde, latex, or other vaccine component?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Influenza'
    },
    {
        id: 'influenzaQ5',
        text: 'If your child is between 6 months and 8 years of age, has your child received at least 2 doses of flu vaccine?',
        options: ['Yes', 'No', 'N/A'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Influenza'
    },
    {
        id: 'influenzaQ6',
        text: 'Have you received an influenza vaccine within the past 30 days?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Influenza'
    },
    {
        id: 'influenzaQ7',
        text: 'Are you, or might you be, pregnant?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Influenza'
    },
    // Routine vaccine questions for children
    {
        id: 'routineQ1',
        text: 'Is the child sick today?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineQ2',
        text: 'Has the child had a serious reaction after receiving a vaccination?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineQ3',
        text: 'Does the child have allergies to medication, food, a vaccine component, or latex?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineQ4',
        text: 'Has the child, a sibling, or a parent had a seizure; has the child had brain or other nervous system problems?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineQ5',
        text: 'Has the child had a health problem involving heart, lung (e.g. asthma), kidney, or metabolic disease (e.g., diabetes), anemia, or other blood disorder? Is he/she on long-term aspirin therapy?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineQ6',
        text: 'Does the child have cancer, leukemia, HIV/AIDS, or does the child or family members (parents or siblings) have an immune system problem?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineQ7',
        text: 'In the past 3 months, has the child taken medications that weaken his/her immune system, such as prednisone or other steroids; anticancer drugs; biologic drugs for autoimmune diseases such as rheumatoid arthritis, Crohn\'s disease, or psoriasis; or had radiation treatments?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineQ8',
        text: 'In the past year, has the child received a transfusion of blood or blood products, or been given immune (gamma) globulin or an antiviral drug?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineQ9',
        text: 'If your child is a baby, have you ever been told he/she has had intussusception?',
        options: ['Yes', 'No', 'Unknown', 'Not Applicable'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineQ10',
        text: 'If the child to be vaccinated IS 2 through 4 years of age, has a healthcare provider told you that the child had wheezing or asthma in the past 12 months?',
        options: ['Yes', 'No', 'Unknown', 'Not Applicable'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineQ11',
        text: 'Has the child had (or is a candidate for) his/her spleen removed, or do they have sickle cell anemia?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineQ12',
        text: 'Has the child ever passed out (had vasovagal syncope) during or after a previous immunization or blood draw?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineQ13',
        text: 'Has the child received any vaccinations in the past 4 weeks?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineQ14',
        text: 'Is the child/teen pregnant or is there a chance she could become pregnant during the next month?',
        options: ['Yes', 'No', 'Unknown', 'Not Applicable'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
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
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'form-check';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'form-check-input';
            checkbox.id = option;
            checkbox.value = option;

            const label = document.createElement('label');
            label.className = 'form-check-label';
            label.htmlFor = option;
            label.textContent = option;

            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);
            questionDiv.appendChild(checkboxDiv);
        });

        const completeButton = document.createElement('button');
        completeButton.type = 'button';
        completeButton.className = 'btn btn-primary mt-3';
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
