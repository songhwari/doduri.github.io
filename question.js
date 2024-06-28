function showOptions(optionType) {
    document.getElementById('initialOptions').style.display = 'none';
    document.getElementById('adultOptions').style.display = optionType === 'adult' ? 'block' : 'none';
    document.getElementById('pedsOptions').style.display = optionType === 'peds' ? 'block' : 'none';
    document.getElementById('pedsWellCheckUp').style.display = optionType === 'peds_well_check_up' ? 'block' : 'none';
}

function showPedsWellCheckUp() {
    document.getElementById('initialOptions').style.display = 'none';
    document.getElementById('pedsWellCheckUp').style.display = 'block';
    populateDobYear();
    populateDobDay();
    setTodayAsDefault();
}

function populateDobYear() {
    const dobYearSelect = document.getElementById('dobYear');
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 18;

    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        dobYearSelect.appendChild(option);
    }
}

function populateDobDay() {
    const dobDaySelect = document.getElementById('dobDay');
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
}

function redirectToSurvey(name) {
    window.location.href = `./survey.html?name=${name}`;
}

function goBack() {
    document.getElementById('initialOptions').style.display = 'block';
    document.getElementById('adultOptions').style.display = 'none';
    document.getElementById('pedsOptions').style.display = 'none';
    document.getElementById('pedsWellCheckUp').style.display = 'none';
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
        window.location.href = `./survey.html?name=${surveyName}`;
    } else {
        alert('Invalid date range.');
    }
}

window.onload = function() {
    document.getElementById('visitDate').valueAsDate = new Date();
};
