let currentQuestionIndex = 0;
let responses = [];
let responses_txt = [];
let surveyQuestions = [];
let surveyTitle = "Survey";
let totalQuestions = 0;

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function safeParseInt(str) {
    const parsed = parseInt(str, 10); 
    if (isNaN(parsed)) {
        return 0; 
    }
    return parsed;
}

async function loadSurvey() {
    const surveyName = getQueryParam('name');
    if (!surveyName) {
        alert('Survey name is missing in the URL parameters.');
        return;
    }

    try {
        const response = await fetch(`./surveys/${surveyName}.txt`);
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim());

        let title = "";
        lines.forEach(line => {
            if (!line.includes('|')) {
				title = line;
            } else {
                const parts = line.split('|');
				const settings = parts[1].split('-');
                if (parts.length === 2) {
					if (parts[0].startsWith('*')) {
						if (settings.length === 2) {//ranged int
							totalQuestions++;
							surveyQuestions.push({
								question: parts[0].substring(1),
								number: totalQuestions,
								options: {min: safeParseInt(settings[0]), max: safeParseInt(settings[1])},
								type: 'range',
								title: title || "Survey",
								isCounted: true
							});
						} else { //other subjective
							totalQuestions++;
							surveyQuestions.push({
								question: parts[0].substring(1),
								number: totalQuestions,
								options: {type: 'str'},
								type: 'string',
								title: title || "Survey",
								isCounted: true
							});
						}
					} else {
						// Skip single-option questions for total count
						surveyQuestions.push({
							question: parts[0],
							number: 0,
							options: parts.slice(1).map(option => {
								const [text, score] = option.split('/');
								return { text, score: parseInt(score, 10) };
							}),
							type: 'dummy',
							title: title || "Survey",
							isCounted: false
						});
					}
                } else {
					totalQuestions++;
                    surveyQuestions.push({
                        question: parts[0],
						number: totalQuestions,
                        options: parts.slice(1).map(option => {
                            const [text, score] = option.split('/');
                            return { text, score: parseInt(score, 10) };
                        }),
                        type: 'single',
                        title: title || "Survey",
                        isCounted: true
                    });
                }
            }
        });

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
    document.getElementById('surveyTitle').textContent = questionData.title;

    const div = document.createElement('div');
    div.classList.add('question', 'mb-4');

    const label = document.createElement('label');
    label.innerHTML = questionData.isCounted
        ? `${questionData.question} (${questionData.number} of ${totalQuestions})`
        : questionData.question;
    div.appendChild(label);
    div.appendChild(document.createElement('br'));

    if (questionData.type === 'range') {

		const select = document.createElement('select');
		select.className = 'form-control';
		select.id = 'subjectiveInput' + questionData.number;

		for (let i = questionData.options.max; i >= questionData.options.min; i--) {
			const option = document.createElement('option');
			option.value = i;
			option.textContent = i;
			select.appendChild(option);
		}

		select.value = responses_txt[currentQuestionIndex] ? responses_txt[currentQuestionIndex]: '';
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'btn btn-secondary btn-block mb-2';
		button.textContent = 'Next';
		button.onclick = () => handleOptionClick(select.value, safeParseInt(select.value));
        div.appendChild(select);
        div.appendChild(button);
    } else if (questionData.type === 'string') {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';
        input.id = 'subjectiveInput'+questionData.number;
		input.value = responses_txt[currentQuestionIndex] ? responses_txt[currentQuestionIndex]: '';
		input.autocomplete = 'off';
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'btn btn-secondary btn-block mb-2';
		button.textContent = 'Next';
		button.onclick = () => handleOptionClick(input.value, 0);
        div.appendChild(input);
        div.appendChild(button);
    } else {
        questionData.options.forEach(option => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-secondary btn-block mb-2';
            button.textContent = option.text;
			if (responses_txt[currentQuestionIndex]) {
				if (responses_txt[currentQuestionIndex] === option.text) {
		            button.className = 'btn btn-dark btn-block mb-2';
				}
			}
            button.onclick = () => handleOptionClick(option.text, option.score);
            div.appendChild(button);
        });
    }

    form.appendChild(div);

    if (currentQuestionIndex > 0) {
        document.getElementById('backButton').style.display = 'block';
    } else {
        document.getElementById('backButton').style.display = 'none';
    }
}

function handleOptionClick(txt, score) {
    responses[currentQuestionIndex] = score;
    responses_txt[currentQuestionIndex] = txt;
    currentQuestionIndex++;
    displayQuestion();
}

function goBack() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function calculateScore() {
    const summaryContent = document.getElementById('summaryContent');
    summaryContent.innerHTML = '';

	customizeResult(summaryContent, getQueryParam('name'))

    document.getElementById('surveyForm').style.display = 'none';
    document.getElementById('summary').style.display = 'block';
}

function customizeResult(summaryContent, surveyName) {
    const score = responses.reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : 0), 0);
	if (surveyName === 'longform') {
		const responses_phq9 = responses.slice(0, 12);
		const responses_gad7 = responses.slice(12, 21);
		const responses_pcl5 = responses.slice(21, 42);
	    const score_phq9 = responses_phq9.reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : 0), 0);
	    const score_gad7 = responses_gad7.reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : 0), 0);
	    const score_pcl5 = responses_pcl5.reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : 0), 0);

		surveyQuestions.forEach((questionData, index) => {
			const response = responses[index];
			const responseText = responses_txt[index];
			const div = document.createElement('div');
			div.innerHTML = `${questionData.number}. ${questionData.question}: <strong>${responseText}</strong>`;
			summaryContent.appendChild(div);
		});

		const resultDiv_phq9 = document.createElement('div');
		resultDiv_phq9.className = 'mt-4';
		resultDiv_phq9.innerHTML = `<h3>Your PHQ-9 total score is: ${score_phq9}</h3>`;
		summaryContent.appendChild(resultDiv_phq9);

		const resultDiv_gad7 = document.createElement('div');
		resultDiv_gad7.className = 'mt-4';
		resultDiv_gad7.innerHTML = `<h3>Your GAD-7 total score is: ${score_gad7}</h3>`;
		summaryContent.appendChild(resultDiv_gad7);

		const resultDiv_pcl5 = document.createElement('div');
		resultDiv_pcl5.className = 'mt-4';
		resultDiv_pcl5.innerHTML = `<h3>Your PCL-5 total score is: ${score_pcl5}</h3>`;
		summaryContent.appendChild(resultDiv_pcl5);

	} else if (surveyName === 'newborn' || surveyName === '2weeks') {
		let last_title = '';
		surveyQuestions.forEach((questionData, index) => {
			const response = responses[index];
			const responseText = responses_txt[index];
			const div = document.createElement('div');
			if (index < 2 && responseText !== 'Yes') {
				div.style.color = 'red';
			} else if (index == 12 && responseText !== 'Never') {
				div.style.color = 'red';
			}
			if (last_title !== surveyQuestions[index].title) {
				last_title = surveyQuestions[index].title;
				const div_title = document.createElement('div');
				div_title.textContent = last_title;
				div_title.style.fontWeight = 'bold';
				summaryContent.appendChild(div_title);
			}
			div.innerHTML = `${questionData.number}. ${questionData.question}: <strong>${responseText}</strong>`;
			summaryContent.appendChild(div);
		});

		const resultDiv = document.createElement('div');
		resultDiv.className = 'mt-4';
		resultDiv.innerHTML = `<h3>Your total score is: ${score}</h3>`;
		if (score >= 10) {
			resultDiv.style.color = 'red';
		}
		summaryContent.appendChild(resultDiv);
	} else {
		surveyQuestions.forEach((questionData, index) => {
			const response = responses[index];
			const responseText = responses_txt[index];
			const div = document.createElement('div');
			div.innerHTML = `${questionData.number}. ${questionData.question}: <strong>${responseText}</strong>`;
			summaryContent.appendChild(div);
		});

		const resultDiv = document.createElement('div');
		resultDiv.className = 'mt-4';
		resultDiv.innerHTML = `<h3>Your total score is: ${score}</h3>`;
		summaryContent.appendChild(resultDiv);
	}
}

window.onload = loadSurvey;
