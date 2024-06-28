async function loadSurvey() {
    try {
        const response = await fetch('survey_18m.txt');
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim());
        const form = document.getElementById('dynamicQuestions');
        
        lines.forEach(line => {
            const parts = line.split('|');
            const questionText = parts[0];
            const options = parts.slice(1);
            
            const div = document.createElement('div');
            div.classList.add('question', 'mb-4');
            
            const label = document.createElement('label');
            label.textContent = questionText;
            div.appendChild(label);
            div.appendChild(document.createElement('br'));
            
            options.forEach(option => {
                const [optionText, optionScore] = option.split(',');
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'btn btn-secondary btn-block mb-2';
                button.textContent = optionText;
                button.onclick = () => handleOptionClick(questionText, optionScore);
                div.appendChild(button);
            });
            
            form.appendChild(div);
        });
        
        const completeButton = document.getElementById('completeButton');
        completeButton.style.display = 'block';
    } catch (error) {
        console.error('Error loading survey:', error);
    }
}

function handleOptionClick(question, score) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = question;
    input.value = score;
    document.getElementById('surveyForm').appendChild(input);
}

function calculateScore() {
    const inputs = document.querySelectorAll('#surveyForm input[type="hidden"]');
    let score = 0;
    const summaryContent = document.getElementById('summaryContent');
    summaryContent.innerHTML = '';

    inputs.forEach(input => {
        score += parseInt(input.value, 10);
        const div = document.createElement('div');
        div.textContent = `${input.name}: ${input.value}`;
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
