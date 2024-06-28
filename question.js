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
    else if (diffDays >= 13 && diffDays <=
