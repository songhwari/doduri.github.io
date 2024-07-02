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

        let title = "";
        lines.forEach(line => {
            if (!line.includes('|')) {
				if (line.startsWith('*')) {
                    totalQuestions++;
                    surveyQuestions.push({
                        question: line,
						number: totalQuestions,
                        options: Array(0),
                        isSubjective: true,
                        title: title || "Survey",
                        isCounted: true
                    });
				} else {
	                title = line;
				}
            } else {
                const parts = line.split('|');
                if (parts.length === 2) {
                    // Skip single-option questions for total count
                    surveyQuestions.push({
                        question: parts[0],
						number: 0,
                        options: parts.slice(1).map(option => {
                            const [text, score] = option.split('/');
                            return { text, score: parseInt(score, 10) };
                        }),
                        isSubjective: false,
                        title: title || "Survey",
                        isCounted: false
                    });
                } else {
					totalQuestions++;
                    surveyQuestions.push({
                        question: parts[0],
						number: totalQuestions,
                        options: parts.slice(1).map(option => {
                            const [text, score] = option.split('/');
                            return { text, score: parseInt(score, 10) };
                        }),
                        isSubjective: false,
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
    label.textContent = questionData.isCounted
        ? `${questionData.question} (${questionData.number} of ${totalQuestions})`
        : questionData.question;
    div.appendChild(label);
    div.appendChild(document.createElement('br'));

    if (questionData.isSubjective) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';
        input.id = 'subjectiveInput'+questionData.number;
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
	if (surveyName === 'phq9') {
		surveyQuestions.forEach((questionData, index) => {
			if (index < 10) {
				return;
			}
			const response = responses[index];
			const responseText = responses_txt[index];
			const div = document.createElement('div');
			div.textContent = `${questionData.question}: ${responseText}`;
			summaryContent.appendChild(div);
		});

		const resultDiv = document.createElement('div');
		resultDiv.className = 'mt-4';
		if (score < 5) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, none</strong>`;
		} else if (score < 10) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, mild</strong>`;
		} else if (score < 15) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, moderate</strong>`;
		} else if (score < 20) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, moderately severe</strong>`;
		} else if (score < 28) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, severe</strong>`;
		}
		summaryContent.appendChild(resultDiv);
	} else if (surveyName === 'gad7') {
		surveyQuestions.forEach((questionData, index) => {
			if (index < 8) {
				return;
			}
			const response = responses[index];
			const responseText = responses_txt[index];
			const div = document.createElement('div');
			div.textContent = `${questionData.question}: ${responseText}`;
			summaryContent.appendChild(div);
		});

		const resultDiv = document.createElement('div');
		resultDiv.className = 'mt-4';
		if (score < 5) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, none</strong>`;
		} else if (score < 10) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, mild</strong>`;
		} else if (score < 15) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, moderate</strong>`;
		} else if (score < 20) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, severe</strong>`;
		}
		summaryContent.appendChild(resultDiv);
	} else if (surveyName === 'pcl5') {
		const resultDiv = document.createElement('div');
		resultDiv.className = 'mt-4';
		if (score < 40) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, Low to moderate</strong>`;
		} else if (score < 60) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, Moderate to severe</strong>`;
		} else if (score < 81) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, Severe</strong>`;
		}
		summaryContent.appendChild(resultDiv);
	} else if (surveyName === 'longform') {
		const responses_phq9 = responses.slice(0, 12);
		const responses_gad7 = responses.slice(12, 21);
		const responses_pcl5 = responses.slice(21, 42);
	    const score_phq9 = responses_phq9.reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : 0), 0);
	    const score_gad7 = responses_gad7.reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : 0), 0);
	    const score_pcl5 = responses_pcl5.reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : 0), 0);

		surveyQuestions.forEach((questionData, index) => {
			if (index < 10 || (index >= 12 && index<12+8 || (index >= 12+9)) ) {
				return;
			}
			const response = responses[index];
			const responseText = responses_txt[index];
			const div = document.createElement('div');
			div.textContent = `${questionData.question}: ${responseText}`;
			summaryContent.appendChild(div);
		});

		const resultDiv_phq9 = document.createElement('div');
		resultDiv_phq9.className = 'mt-4';
		if (score_phq9 < 5) {
			resultDiv_phq9.innerHTML = `<strong>Your PHQ-9 total score is: ${score_phq9}, none</strong>`;
		} else if (score_phq9 < 10) {
			resultDiv_phq9.innerHTML = `<strong>Your PHQ-9 total score is: ${score_phq9}, mild</strong>`;
		} else if (score_phq9 < 15) {
			resultDiv_phq9.innerHTML = `<strong>Your PHQ-9 total score is: ${score_phq9}, moderate</strong>`;
		} else if (score_phq9 < 20) {
			resultDiv_phq9.innerHTML = `<strong>Your PHQ-9 total score is: ${score_phq9}, moderately severe</strong>`;
		} else if (score_phq9 < 28) {
			resultDiv_phq9.innerHTML = `<strong>Your PHQ-9 total score is: ${score_phq9}, severe</strong>`;
		}
		summaryContent.appendChild(resultDiv_phq9);

		const resultDiv_gad7 = document.createElement('div');
		resultDiv_gad7.className = 'mt-4';
		if (score_gad7 < 5) {
			resultDiv_gad7.innerHTML = `<strong>Your GAD-7 total score is: ${score_gad7}, none</strong>`;
		} else if (score_gad7 < 10) {
			resultDiv_gad7.innerHTML = `<strong>Your GAD-7 total score is: ${score_gad7}, mild</strong>`;
		} else if (score_gad7 < 15) {
			resultDiv_gad7.innerHTML = `<strong>Your GAD-7 total score is: ${score_gad7}, moderate</strong>`;
		} else if (score_gad7 < 20) {
			resultDiv_gad7.innerHTML = `<strong>Your GAD-7 total score is: ${score_gad7}, severe</strong>`;
		}
		summaryContent.appendChild(resultDiv_gad7);

		const resultDiv_pcl5 = document.createElement('div');
		resultDiv_pcl5.className = 'mt-4';
		if (score_pcl5 < 40) {
			resultDiv_pcl5.innerHTML = `<strong>Your PCL-5 total score is: ${score_pcl5}, Low to moderate</strong>`;
		} else if (score_pcl5 < 60) {
			resultDiv_pcl5.innerHTML = `<strong>Your PCL-5 total score is: ${score_pcl5}, Moderate to severe</strong>`;
		} else if (score_pcl5 < 81) {
			resultDiv_pcl5.innerHTML = `<strong>Your PCL-5 total score is: ${score_pcl5}, Severe</strong>`;
		}
		summaryContent.appendChild(resultDiv_pcl5);

	} else if (surveyName === 'ess') {
		const resultDiv = document.createElement('div');
		resultDiv.className = 'mt-4';
		if (score < 8) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, Unlikely to have abnormal sleepiness</strong>`;
		} else if (score < 10) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, Average amount of daytime sleepiness</strong>`;
		} else if (score < 16) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, Excessive daytime sleepiness</strong>`;
		} else if (score < 25) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, Severe excessive daytime sleepiness</strong>`;
		}
		summaryContent.appendChild(resultDiv);
	} else if (surveyName === 'isi') {
		const resultDiv = document.createElement('div');
		resultDiv.className = 'mt-4';
		if (score < 15) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, Mild insomnia</strong>`;
		} else if (score < 22) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, Moderate insomnia</strong>`;
		} else if (score < 29) {
			resultDiv.innerHTML = `<strong>Your total score is: ${score}, Severe insomnia</strong>`;
		}
		summaryContent.appendChild(resultDiv);
	} else {
		surveyQuestions.forEach((questionData, index) => {
			const response = responses[index];
			const responseText = responses_txt[index];
			const div = document.createElement('div');
			div.textContent = `${questionData.question}: ${responseText}`;
			summaryContent.appendChild(div);
		});

		const resultDiv = document.createElement('div');
		resultDiv.className = 'mt-4';
		resultDiv.innerHTML = `<strong>Your total score is: ${score}</strong>`;
		summaryContent.appendChild(resultDiv);
	}
}

window.onload = loadSurvey;
