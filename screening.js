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

function splitWithLimit(str, delimiter, limit) {
  const parts = str.split(delimiter);
  const result = parts.slice(0, limit);
  if (parts.length > limit) {
    result.push(parts.slice(limit).join(delimiter));
  }
  return result;
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
            } else if (line.startsWith('*text*')) {
                const parts = line.split('|');
				const headings = splitWithLimit(parts[0], '*', 2);

				totalQuestions++;
				surveyQuestions.push({
					question: headings[2],
					number: totalQuestions,
					options: Array(0),
					type: 'text',
					title: title || "Survey",
					isCounted: true
				});
            } else if (line.startsWith('*number/')) {
                const parts = line.split('|');
				const headings = splitWithLimit(parts[0], '*', 2);
				const headings_options =  headings[1].split('/');

				totalQuestions++;
				surveyQuestions.push({
					question: headings[2],
					number: totalQuestions,
					options: {min: safeParseInt(headings_options[1]), max: safeParseInt(headings_options[2])},
					type: 'number',
					title: title || "Survey",
					isCounted: true
				});
            } else if (line.startsWith('*multiple/')) {
                const parts = line.split('|');
				const headings = splitWithLimit(parts[0], '*', 2);
				const headings_options =  headings[1].split('/');

				totalQuestions++;
				surveyQuestions.push({
					question: headings[2],
					number: totalQuestions,
					options: parts.slice(1).map(option => {
						const [text, score] = option.split('/');
						return { text, score: parseInt(score, 10) };
					}),
					type: 'multiple',
					title: title || "Survey",
					isCounted: true
				});
            } else {//single or dummy
                const parts = line.split('|');
				if (parts.length === 2) {
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

    if (questionData.type === 'number') {

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
    } else if (questionData.type === 'text') {
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
    } else if (questionData.type === 'multiple') {
		let option_id = 0;
        questionData.options.forEach(option => {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'form-check';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'form-check-input';
            checkbox.id = 'option_'+questionData.number+'_'+option_id;
            checkbox.value = option.score;
			checkbox.setAttribute('data-option', option.text);
			if (responses_txt[currentQuestionIndex] && responses_txt[currentQuestionIndex].endsWith(option.text)) {
				checkbox.checked = true;
			} else if (responses_txt[currentQuestionIndex] && responses_txt[currentQuestionIndex].includes(option.text+', ')) {
				checkbox.checked = true;
			}

            const label = document.createElement('label');
            label.className = 'form-check-label';
            label.htmlFor = 'option_'+questionData.number+'_'+option_id;
            label.textContent = option.text;

            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);
            div.appendChild(checkboxDiv);
			option_id++;
        });

		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'btn btn-secondary btn-block mb-2';
		button.textContent = 'Next';
		button.onclick = () => handleMultipleOptionClick(questionData);
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
	if (txt === '') {
		alert('No items selected or entered. Please select or enter an item and click Next.');
		return;
	}
    responses[currentQuestionIndex] = score;
    responses_txt[currentQuestionIndex] = txt;
    currentQuestionIndex++;
    displayQuestion();
}

function handleMultipleOptionClick(questionData) {
    const checkboxes = document.querySelectorAll(`input[type="checkbox"]`);
    const selectedValues = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    const selectedOptions = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.getAttribute('data-option'));

	if (selectedOptions.length === 0) {
		alert('No items selected. Please select items and click Next.');
		return;
	}
	
	responses[currentQuestionIndex] = Math.max(...selectedValues);
    responses_txt[currentQuestionIndex] = selectedOptions.join(', ');
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

    document.getElementById('surveyTitle').textContent = 'Survey Results';

	customizeResult(summaryContent, getQueryParam('name'))

    document.getElementById('surveyForm').style.display = 'none';
    document.getElementById('summary').style.display = 'block';
}

function customizeResult(summaryContent, surveyName) {
    const score = responses.reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : 0), 0);
	const checkupSurveys = ['newborn', '2weeks', '2months', '4months', '6months', '9months', '12months', '15months', '18months', '24months', '30months', '3years', '4years', '5years', '6years', '7years', '8-10years', '11years', '12-18years']; // 포함할 조건들을 배열로 나열
	const summaryTitles = ['Developmental Milestones', 'Preschool Pediatric Symptom Checklist(PPSC)', "Parent's Observations of Social Interactions(POSI)", 'Pediatric Symptom Checklist(PSC-17)', 'Edinburgh Postnatal Depression Scale'];

	if (checkupSurveys.includes(surveyName)) {//Checkup Surveys
		let last_title = '';
		let last_title_score = 0;
		let bpsc_index = 0;
		let bpsc_score = 0;
		surveyQuestions.forEach((questionData, index) => {
			//before
			if (last_title !== surveyQuestions[index].title) {
				const div_title = document.createElement('div');
				div_title.textContent = surveyQuestions[index].title;
				div_title.style.fontWeight = 'bold';
				summaryContent.appendChild(div_title);
			}

			const response = responses[index];
			const responseText = responses_txt[index];

			const div = document.createElement('div');
			if (surveyQuestions[index].title === 'Milestones' && responseText.toLowerCase() !== 'yes') {
				div.style.color = 'red';
			} else if (surveyQuestions[index].question === 'The thought of harming myself has occurred to me' && responseText !== 'Never') {
				div.style.color = 'red';
			}
			const question = questionData.question.replace(/<br\s*\/?>/gi, '\n').split('\n')[0];
			div.innerHTML = `${questionData.number}. ${question}: <strong>${responseText}</strong>`;
			if (surveyQuestions[index].type === 'dummy') {
				;
			} else {
				summaryContent.appendChild(div);
			}
			if (surveyQuestions[index].title === 'Baby Pediatric Symptom Checklist(BPSC)') {
				bpsc_index++;
				bpsc_score += response;
				if (bpsc_index == 4) {
					const div_bpsc = document.createElement('div');
					div_bpsc.style.fontWeight = 'bold';
					div_bpsc.textContent = `BPSC section score: ${bpsc_score}`;
					if (bpsc_score >= 3) {
						div_bpsc.style.color = 'red';
					}
					summaryContent.appendChild(div_bpsc);
					summaryContent.appendChild(document.createElement('hr'));
					bpsc_index = 0;
					bpsc_score = 0;
				}
			}

			last_title = surveyQuestions[index].title;
			last_title_score += response;

			//after
			if (index == surveyQuestions.length-1 || surveyQuestions[index].title !== surveyQuestions[index+1].title) {
				if (summaryTitles.includes(last_title)) {
					const div_summary = document.createElement('div');
					div_summary.style.fontWeight = 'bold';
					if (last_title === "Parent's Observations of Social Interactions(POSI)" && last_title_score >= 3) {
						div_summary.style.color = 'red';
					} else if (last_title === "Edinburgh Postnatal Depression Scale" && last_title_score >= 10) {
						div_summary.style.color = 'red';
					} else if (last_title === "Preschool Pediatric Symptom Checklist(PPSC)" && last_title_score >= 9) {
						div_summary.style.color = 'red';
					}
					div_summary.textContent = `${surveyQuestions[index].title} score: ${last_title_score}`;
					summaryContent.appendChild(div_summary);
				}
				summaryContent.appendChild(document.createElement('hr'));
				last_title_score = 0;
			}
		});
	} else {
		let last_title = '';
		let last_title_score = 0;
		let last_title_count = 0;
		surveyQuestions.forEach((questionData, index) => {
			//before
			if (last_title !== surveyQuestions[index].title) {
				const div_title = document.createElement('div');
				div_title.textContent = surveyQuestions[index].title;
				div_title.style.fontWeight = 'bold';
				summaryContent.appendChild(div_title);
			}

			const response = responses[index];
			const responseText = responses_txt[index];

			const div = document.createElement('div');
			const question = questionData.question.replace(/<br\s*\/?>/gi, '\n').split('\n')[0];
			div.innerHTML = `${questionData.number}. ${question}: <strong>${responseText}</strong>`;
			if (surveyQuestions[index].type === 'dummy' && responseText !== 'Nurse portion') {
				;
			} else {
				summaryContent.appendChild(div);
				last_title_count++;
			}

			last_title = surveyQuestions[index].title;
			last_title_score += response;

			//after
			if (index == surveyQuestions.length-1 || surveyQuestions[index].title !== surveyQuestions[index+1].title) {
				const div_summary = document.createElement('div');
				div_summary.style.fontWeight = 'bold';
				div_summary.textContent = `${surveyQuestions[index].title} score: ${last_title_score}`;
				if (last_title_count >0) {
					summaryContent.appendChild(div_summary);
					summaryContent.appendChild(document.createElement('hr'));
				}
				last_title_count = 0;
				last_title_score = 0;
			}
		});
		const resultDiv = document.createElement('div');
		resultDiv.className = 'mt-4';
		resultDiv.innerHTML = `<h3>Your total score is: ${score}</h3>`;
		summaryContent.appendChild(resultDiv);
	}
}

window.onload = loadSurvey;
