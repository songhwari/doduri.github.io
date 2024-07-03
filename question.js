function showOptions(optionType) {
    document.getElementById('initialOptions').style.display = 'none';
    document.getElementById('adultOptions').style.display = optionType === 'adult' ? 'block' : 'none';
    document.getElementById('pedsOptions').style.display = optionType === 'peds' ? 'block' : 'none';
    document.getElementById('pedsWellCheckUp').style.display = optionType === 'peds_well_check_up' ? 'block' : 'none';
    document.getElementById('nbsOptions').style.display = optionType === 'nbs' ? 'block' : 'none';
    document.getElementById('bristolOptions').style.display = optionType === 'bristol' ? 'block' : 'none';
    document.getElementById('tylenolImage').style.display = optionType === 'tylenol' ? 'block' : 'none';
    document.getElementById('ibuprofenImage').style.display = optionType === 'ibuprofen' ? 'block' : 'none';
    document.getElementById('lactationOptions').style.display = optionType === 'lactation' ? 'block' : 'none';
    document.getElementById('dieticianOptions').style.display = optionType === 'dietician' ? 'block' : 'none';
    document.getElementById('edisOptions').style.display = optionType === 'edis' ? 'block' : 'none';
    document.getElementById('weightLossForm').style.display = optionType === 'weight_loss' ? 'block' : 'none';
    document.getElementById('fuWeightForm').style.display = optionType === 'fu_weight' ? 'block' : 'none';
}

function populateDob() {
    const dobYearSelect = document.getElementById('dobYear');
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 18;

    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        dobYearSelect.appendChild(option);
    }

    const dobDaySelect = document.getElementById('dobDay');
    if (dobDaySelect.options.length > 0) {
        return;
    }
	for (let day = 1; day <= 31; day++) {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day;
        dobDaySelect.appendChild(option);
    }
}

function populateLastVisitDate() {
    const dobYearSelect = document.getElementById('dobYear2');
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 1;

    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        dobYearSelect.appendChild(option);
    }

    const dobDaySelect = document.getElementById('dobDay2');
    for (let day = 1; day <= 31; day++) {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day;
        dobDaySelect.appendChild(option);
    }
}

function setTodayAsDefault() {
    const today = new Date();
    document.getElementById('visitDate').valueAsDate = today;
    document.getElementById('dobYear').value = today.getFullYear();
    document.getElementById('dobMonth').value = today.getMonth() + 1; // Months are 0-indexed
    document.getElementById('dobDay').value = today.getDate();

    document.getElementById('visitDate2').valueAsDate = today;
    document.getElementById('dobYear2').value = today.getFullYear();
    document.getElementById('dobMonth2').value = today.getMonth() + 1; // Months are 0-indexed
    document.getElementById('dobDay2').value = today.getDate();
}

function redirectToSurvey(name) {
    window.location.href = `./screening.htm?name=${name}`;
}

function goBack() {
    document.getElementById('initialOptions').style.display = 'block';
    document.getElementById('adultOptions').style.display = 'none';
    document.getElementById('pedsOptions').style.display = 'none';
    document.getElementById('pedsWellCheckUp').style.display = 'none';
    document.getElementById('nbsOptions').style.display = 'none';
    document.getElementById('bristolOptions').style.display = 'none';
    document.getElementById('tylenolImage').style.display = 'none';
    document.getElementById('ibuprofenImage').style.display = 'none';
    document.getElementById('lactationOptions').style.display = 'none';
    document.getElementById('dieticianOptions').style.display = 'none';
    document.getElementById('edisOptions').style.display = 'none';
    document.getElementById('weightLossForm').style.display = 'none';
    document.getElementById('fuWeightForm').style.display = 'none';
}

function calculateAge(event) {
    event.preventDefault();
    const dobYear = parseInt(document.getElementById('dobYear').value);
    const dobMonth = parseInt(document.getElementById('dobMonth').value) - 1; // Months are 0-indexed
    const dobDay = parseInt(document.getElementById('dobDay').value);
    const visitDate = new Date(document.getElementById('visitDate').value);
    const dob = new Date(dobYear, dobMonth, dobDay);
    const diffTime = Math.abs(visitDate - dob);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let surveyName = '';
    if (diffDays >= 2 && diffDays <= 12) surveyName = 'newborn';
    else if (diffDays >= 13 && diffDays <= 30) surveyName = '2weeks';
    else if (diffDays >= 31 && diffDays <= 121) surveyName = '2months';
    else if (diffDays >= 122 && diffDays <= 182) surveyName = '4months';
    else if (diffDays >= 183 && diffDays <= 273) surveyName = '6months';
    else if (diffDays >= 274 && diffDays <= 364) surveyName = '9months';
    else if (diffDays >= 365 && diffDays <= 455) surveyName = '12months';
    else if (diffDays >= 456 && diffDays <= 546) surveyName = '15months';
    else if (diffDays >= 547 && diffDays <= 683) surveyName = '18months';
    else if (diffDays >= 684 && diffDays <= 913) surveyName = '24months';
    else if (diffDays >= 914 && diffDays <= 1043) surveyName = '30months';
    else if (diffDays >= 1044 && diffDays <= 1443) surveyName = '3years';
    else if (diffDays >= 1444 && diffDays <= 1763) surveyName = '4years';
    else if (diffDays >= 1764 && diffDays <= 1983) surveyName = '5years';
    else if (diffDays >= 1984 && diffDays <= 2519) surveyName = '6years';
    else if (diffDays >= 2520 && diffDays <= 3959) surveyName = '7-10years';
    else if (diffDays >= 3960 && diffDays <= 4319) surveyName = '11years';
    else if (diffDays >= 4320) surveyName = '12+years';

    if (surveyName) {
        window.location.href = `./screening.htm?name=${surveyName}`;
    } else {
        alert('Invalid date range.');
    }
}

function calculateWeightLoss() {
    const birthWeight = parseFloat(document.getElementById('birthWeight').value);
    const todaysWeight = parseFloat(document.getElementById('todaysWeight').value);
    const weightLossPercentage = ((birthWeight - todaysWeight) / birthWeight) * 100;
    document.getElementById('weightLossFormResult').innerHTML = `<strong>Weight Loss: ${weightLossPercentage.toFixed(2)}%</strong>`;
}

function calculateFuWeight() {
    const dobYear = parseInt(document.getElementById('dobYear2').value);
    const dobMonth = parseInt(document.getElementById('dobMonth2').value) - 1; // Months are 0-indexed
    const dobDay = parseInt(document.getElementById('dobDay2').value);
    const lastVisitDate = new Date(dobYear, dobMonth, dobDay);
    const lastVisitWeight = parseFloat(document.getElementById('lastVisitWeight').value);

    const visitDateInput = document.getElementById('visitDate2').value;
    const visitDateParts = visitDateInput.split('-');
    const visitYear = parseInt(visitDateParts[0]);
    const visitMonth = parseInt(visitDateParts[1]) - 1;
    const visitDay = parseInt(visitDateParts[2]);
	const visitDate = new Date(visitYear, visitMonth, visitDay);
    //const visitDate = new Date(document.getElementById('visitDate').value);
    const visitWeight = parseFloat(document.getElementById('visitWeight').value);

    const diffTime = visitDate - lastVisitDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	const diffWeight = visitWeight - lastVisitWeight;

    const weightChangePerDay = (visitWeight - lastVisitWeight) / diffDays;
	if (diffTime <= 0) {
	    document.getElementById('fuWeightFormResult').innerHTML = `Error`;
	} else {
	    document.getElementById('fuWeightFormResult').innerHTML = `<strong>Total Weigth Change: ${diffWeight} g</strong><br><strong>Duration: ${diffDays} days</strong><br><strong>Daily Weight Change: ${weightChangePerDay.toFixed(2)} grams/day</strong>`;
	}
}

window.onload = function() {
    populateDob();
	populateLastVisitDate();
    setTodayAsDefault();
};
