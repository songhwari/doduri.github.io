function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function initializeForm() {
    const calcType = getQueryParam('name');
    if (calcType === 'weight_loss') {
        document.getElementById('weightLossForm').style.display = 'block';
    } else if (calcType === 'fu_weight') {
        document.getElementById('fuWeightForm').style.display = 'block';
        populateLastVisitDate();
        setTodayAsDefault();
    } else {
        alert('Invalid calculation type.');
    }
}

function populateLastVisitDate() {
    const dobYearSelect = document.getElementById('dobYear');
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 1;

    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        dobYearSelect.appendChild(option);
    }

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


function calculateWeightLoss() {
    const birthWeight = parseFloat(document.getElementById('birthWeight').value);
    const todaysWeight = parseFloat(document.getElementById('todaysWeight').value);
    const weightLossPercentage = ((birthWeight - todaysWeight) / birthWeight) * 100;
    document.getElementById('result').innerHTML = `<strong>Weight Loss: ${weightLossPercentage.toFixed(2)}%</strong>`;
}

function calculateFuWeight() {
    const dobYear = parseInt(document.getElementById('dobYear').value);
    const dobMonth = parseInt(document.getElementById('dobMonth').value) - 1; // Months are 0-indexed
    const dobDay = parseInt(document.getElementById('dobDay').value);
    const lastVisitDate = new Date(dobYear, dobMonth, dobDay);

    const lastVisitWeight = parseFloat(document.getElementById('lastVisitWeight').value);
    const visitDate = new Date(document.getElementById('visitDate').value);
    const visitWeight = parseFloat(document.getElementById('visitWeight').value);

    const diffTime = Math.abs(visitDate - lastVisitDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	const diffWeight = visitWeight - lastVisitWeight;

    const weightChangePerDay = (visitWeight - lastVisitWeight) / diffDays;
    document.getElementById('result').innerHTML = `<strong>Total Weigth Change: ${diffWeight} g</strong><br><strong>Duration: ${diffDays} days</strong><br><strong>Daily Weight Change: ${weightChangePerDay.toFixed(2)} grams/day</strong>`;
}

window.onload = initializeForm;
