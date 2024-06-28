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
    const lastVisitDateSelect = document.getElementById('lastVisitDate');
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 18;

    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = `${year}-01-01`;
        option.textContent = `${year}-01-01`;
        lastVisitDateSelect.appendChild(option);
    }
}

function setTodayAsDefault() {
    const today = new Date();
    document.getElementById('visitDate').valueAsDate = today;
}

function calculateWeightLoss() {
    const birthWeight = parseFloat(document.getElementById('birthWeight').value);
    const todaysWeight = parseFloat(document.getElementById('todaysWeight').value);
    const weightLossPercentage = ((birthWeight - todaysWeight) / birthWeight) * 100;
    document.getElementById('result').innerHTML = `<strong>Weight Loss: ${weightLossPercentage.toFixed(2)}%</strong>`;
}

function calculateFuWeight() {
    const lastVisitDate = new Date(document.getElementById('lastVisitDate').value);
    const visitDate = new Date(document.getElementById('visitDate').value);
    const lastVisitWeight = parseFloat(document.getElementById('lastVisitWeight').value);
    const visitWeight = parseFloat(document.getElementById('visitWeight').value);

    const diffTime = Math.abs(visitDate - lastVisitDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const weightChangePerDay = (visitWeight - lastVisitWeight) / diffDays;
    document.getElementById('result').innerHTML = `<strong>Daily Weight Change: ${weightChangePerDay.toFixed(2)} grams/day</strong>`;
}

window.onload = initializeForm;
