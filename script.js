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
        condition: () => (document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'COVID' ) || ( document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === '12 and Over' )
    },
    {
        id: 'covidOver12Q2',
        text: 'Have you received a COVID-19 vaccination before? (Historical immunizations should be documented within the immunization workflow component.)',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => (document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'COVID' ) || ( document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === '12 and Over' )
    },
    {
        id: 'covidOver12Q3',
        text: 'Have you had an adverse or allergic reaction to a prior COVID vaccine, anaphylaxis due to any cause, or allergic reaction to any other vaccine or injectable therapy?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => (document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'COVID' ) || ( document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === '12 and Over' )
    },
    {
        id: 'covidOver12Q4',
        text: 'Do you have hemophilia or other bleeding disorder or take blood thinner?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => (document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'COVID' ) || ( document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === '12 and Over' )
    },
    {
        id: 'covidOver12Q5',
        text: 'Are you, or might you be, pregnant?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => (document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'COVID' ) || ( document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === '12 and Over' )
    },
    {
        id: 'covidOver12Q6',
        text: 'Do you have an immunocompromising condition (HIV/AIDS, cancer, leukemia, etc.) or take an immunocompromising medicine or treatment (steroids, chemotherapy, radiation therapy, etc.)?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => (document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'COVID' ) || ( document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === '12 and Over' )
    },
    {
        id: 'covidOver12Q7',
        text: 'Have you received a smallpox/mpox vaccine in the past month, or plan to receive smallpox/mpox vaccine today?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => (document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'COVID' ) || ( document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === '12 and Over' )
    },
    {
        id: 'covidOver12Q8',
        text: 'Check all that apply to the person being vaccinated: (Any active or resolved problems should be documented within the Problem List workflow component)',
        options: [
            'History of COVID-19 disease within the past 3 months',
            'History of multi-system inflammatory syndrome (MIS-C or MIS-A)',
            'History of myocarditis or pericarditis within 3 weeks after a dose of any COVID-19 vaccine'
        ],
        type: 'multiple',
        condition: () => (document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'COVID' ) || ( document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === '12 and Over' )
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
    {
        id: 'covidUnder12Q2',
        text: 'Has your child received a COVID-19 vaccination before?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === 'Under 12'
    },
    {
        id: 'covidUnder12Q3',
        text: 'Has your child had an adverse or allergic reaction to a prior COVID vaccine, anaphylaxis due to any cause, or allergic reaction to any other vaccine or injectable therapy?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === 'Under 12'
    },
    {
        id: 'covidUnder12Q4',
        text: 'Does your child have hemophilia or other bleeding disorder or take a blood thinner?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === 'Under 12'
    },
    {
        id: 'covidUnder12Q5',
        text: 'Does your child have an immunocompromising condition (HIV/AIDS, cancer, leukemia, etc.) or take an immunocompromising medicine or treatment (steroids, chemotherapy, radiation therapy, etc.)?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === 'Under 12'
    },
    {
        id: 'covidUnder12Q6',
        text: 'Check all that apply to the person being vaccinated:',
        options: [
            'History of COVID-19 disease within the past 3 months',
            'History of multi-system inflammatory syndrome (MIS-C)',
            'History of myocarditis or pericarditis'
        ],
        type: 'multiple',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'COVID' && document.getElementById('ageGroup').value === 'Under 12'
    },
    // Routine vaccine questions for adult
    {
        id: 'routineAdultQ1',
        text: 'Are you sick today?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineAdultQ2',
        text: 'Have you ever had a serious reaction after receiving a vaccination?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineAdultQ3',
        text: 'Do you have allergies to medication, food, a vaccine component, or latex?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineAdultQ4',
        text: 'Have you had a seizure or a brain or other nervous system problem?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineAdultQ5',
        text: 'Have you had a health problem involving heart, lung (e.g., asthma), kidney, or metabolic disease (e.g., diabetes), anemia, or other blood disorder?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineAdultQ6',
        text: 'Do you have cancer, leukemia, HIV/AIDS, or any other immune system problem?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineAdultQ7',
        text: 'In the past 3 months, have you taken medications that weaken your immune system, such as prednisone or other steroids; anticancer drugs; biologic drugs for autoimmune diseases such as rheumatoid arthritis, Crohn`s disease, or psoriasis; or had radiation treatments?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineAdultQ8',
        text: 'In the past year, have you received transfusion of blood or blood a products, or been given immune (gamma) globulin or an antiviral drug?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineAdultQ9',
        text: 'Have you had (or are you a candidate for) your spleen removed, or do you have sickle cell anemia?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineAdultQ10',
        text: 'Have you ever passed out (had vasovagal syncope) during or after a previous immunization or blood draw?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineAdultQ11',
        text: 'Have you received any vaccinations the past 4 weeks?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineAdultQ12',
        text: 'Are you pregnant or is there a chance you could become pregnant during the next month?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'Routine'
    },
	// Routine vaccine questions for children
    {
        id: 'routineChildQ1',
        text: 'Is the child sick today?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineChildQ2',
        text: 'Has the child had a serious reaction after receiving a vaccination?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineChildQ3',
        text: 'Does the child have allergies to medication, food, a vaccine component, or latex?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineChildQ4',
        text: 'Has the child, a sibling, or a parent had a seizure; has the child had brain or other nervous system problems?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineChildQ5',
        text: 'Has the child had a health problem involving heart, lung (e.g. asthma), kidney, or metabolic disease (e.g., diabetes), anemia, or other blood disorder? Is he/she on long-term aspirin therapy?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineChildQ6',
        text: 'Does the child have cancer, leukemia, HIV/AIDS, or does the child or family members (parents or siblings) have an immune system problem?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineChildQ7',
        text: 'In the past 3 months, has the child taken medications that weaken his/her immune system, such as prednisone or other steroids; anticancer drugs; biologic drugs for autoimmune diseases such as rheumatoid arthritis, Crohn\'s disease, or psoriasis; or had radiation treatments?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineChildQ8',
        text: 'In the past year, has the child received a transfusion of blood or blood products, or been given immune (gamma) globulin or an antiviral drug?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineChildQ9',
        text: 'If your child is a baby, have you ever been told he/she has had intussusception?',
        options: ['Yes', 'No', 'Unknown', 'Not Applicable'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineChildQ10',
        text: 'If the child to be vaccinated IS 2 through 4 years of age, has a healthcare provider told you that the child had wheezing or asthma in the past 12 months?',
        options: ['Yes', 'No', 'Unknown', 'Not Applicable'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineChildQ11',
        text: 'Has the child had (or is a candidate for) his/her spleen removed, or do they have sickle cell anemia?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineChildQ12',
        text: 'Has the child ever passed out (had vasovagal syncope) during or after a previous immunization or blood draw?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineChildQ13',
        text: 'Has the child received any vaccinations in the past 4 weeks?',
        options: ['Yes', 'No', 'Unknown'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
    {
        id: 'routineChildQ14',
        text: 'Is the child/teen pregnant or is there a chance she could become pregnant during the next month?',
        options: ['Yes', 'No', 'Unknown', 'Not Applicable'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Routine'
    },
	// Influenza questions for adult
    {
        id: 'influenzaAdultQ1',
        text: 'Are you currently sick, feel ill, or have a fever over 100F?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'Influenza'
    },
    {
        id: 'influenzaAdultQ2',
        text: 'Have you had a serious reaction, other than Flu-like symptoms, following an influenza vaccine in the past?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'Influenza'
    },
    {
        id: 'influenzaAdultQ3',
        text: 'Have you ever experienced numbness or weakness of their legs or elsewhere (Guillain-Barre syndrome) within 6 weeks of receiving an influenza vaccine?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'Influenza'
    },
    {
        id: 'influenzaAdultQ4',
        text: 'Have you ever had, or been treated for, an allergic 4. reaction (flushing, hives, wheezing, and/or low blood pressure) to any vaccine, or do you have an allergy to any of the following: gelatin, MSG, Gentamycin, Neomycin, Polymyxin-B, thimerosal, formaldehyde, latex, or other vaccine component?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'Influenza'
    },
    {
        id: 'influenzaAdultQ5',
        text: 'Have you received an influenza vacccine within the past 30 days?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'Influenza'
    },
    {
        id: 'influenzaAdultQ6',
        text: 'Are you, or might you be, pregnant?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'Myself' && document.getElementById('vaccinationType').value === 'Influenza'
    },
	// Influenza questions for children
    {
        id: 'influenzaChildQ1',
        text: 'Are you currently sick, feel ill, or have a fever over 100F?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Influenza'
    },
    {
        id: 'influenzaChildQ2',
        text: 'Have you had a serious reaction, other than Flu-like symptoms, following an influenza vaccine in the past?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Influenza'
    },
    {
        id: 'influenzaChildQ3',
        text: 'Have you ever experienced numbness or weakness of their legs or elsewhere (Guillain-Barre syndrome) within 6 weeks of receiving an influenza vaccine?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Influenza'
    },
    {
        id: 'influenzaChildQ4',
        text: 'Have you ever had, or been treated for, an allergic reaction (flushing, hives, wheezing, and/or low blood pressure) to any vaccine, or do they have an allergy to any of the following: gelatin, MSG, Gentamicyn, Neomycin, Połymyxin-B, thimerosal, formaldehyde, latex, or other vaccine component?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Influenza'
    },
    {
        id: 'influenzaChildQ5',
        text: 'If your child is between 6 months and 8 years of age, has your child o received at least 2 doses of flu vaccine?',
        options: ['Yes', 'No', 'N/A'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Influenza'
    },
    {
        id: 'influenzaChildQ6',
        text: 'Have you received an influenza vaccine within the past 30 days?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Influenza'
    },
    {
        id: 'influenzaChildQ7',
        text: 'Are you, or might you be, pregnant?',
        options: ['Yes', 'No'],
        type: 'single',
        condition: () => document.getElementById('recipient').value === 'My Child' && document.getElementById('vaccinationType').value === 'Influenza'
    }

];

function displayQuestion(index) {
    const dynamicQuestions = document.getElementById('dynamicQuestions');
    dynamicQuestions.innerHTML = ''; // Clear previous question

    if (index >= questionsData.length) {
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
