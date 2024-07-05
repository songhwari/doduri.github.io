const diffDaysList = [{label:'Newborn', name:'newborn',years:0,months:0,days:2}, 
	{label:'2 weeks old', name:'2weeks',years:0,months:0,days:13},
	{label:'2 months old', name:'2months',years:0,months:1,days:0},
	{label:'4 months old', name:'4months',years:0,months:4,days:0},
	{label:'6 months old', name:'6months',years:0,months:6,days:0},
	{label:'9 months old', name:'9months',years:0,months:9,days:0},
	{label:'12 months old', name:'12months',years:1,months:0,days:0},
	{label:'15 months old', name:'15months',years:1,months:3,days:0},
	{label:'18 months old', name:'18months',years:1,months:6,days:0},
	{label:'24 months old', name:'24months',years:1,months:11,days:0},
	{label:'30 months old', name:'30months',years:2,months:5,days:0},
	{label:'3 years old', name:'3years',years:2,months:11,days:0},
	{label:'4 years old', name:'4years',years:3,months:11,days:0},
	{label:'5 years old', name:'5years',years:4,months:11,days:0},
	{label:'6 years old', name:'6years',years:5,months:6,days:0},
	{label:'7 years old', name:'7years',years:7,months:0,days:0},
	{label:'8-10 years old', name:'8-10years',years:8,months:0,days:0},
	{label:'11 years old', name:'11years',years:11,months:0,days:0},
	{label:'12-18 years old', name:'12-18years',years:12,months:0,days:0},
	{label:'Adult', name:'Adult',years:19,months:0,days:0}];

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
    document.getElementById('rankImage').style.display = optionType === 'rank' ? 'block' : 'none';
    document.getElementById('pedsvitalsignImage').style.display = optionType === 'pedsvitalsign' ? 'block' : 'none';
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
    let today = new Date();

    document.getElementById('visitDate').value = today.toISOString().slice(0,10);

    document.getElementById('visitDate2').value = today.toISOString().slice(0,10);
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
    document.getElementById('rankImage').style.display = 'none';
    document.getElementById('pedsvitalsignImage').style.display = 'none';
}

function calculatePreviousDate(endDate, diff) {
    const end = new Date(endDate);
    
    let yearDiff = diff.years;
    let monthDiff = diff.months;
    let dayDiff = diff.days;
    
    // Subtract the year difference
    let previousYear = end.getFullYear() - yearDiff;
    
    // Subtract the month difference
    let previousMonth = end.getMonth() - monthDiff;
    if (previousMonth < 0) {
        previousYear -= 1;
        previousMonth += 12;
    }
    
    // Calculate the target day in the previous month
    let previousDate = new Date(previousYear, previousMonth, end.getDate());
    
    // Check if the calculated day is valid
    if (previousDate.getMonth() !== previousMonth) {
        // Use the last day of the previous month if the date is invalid
        previousDate = new Date(previousYear, previousMonth + 1, 0);
    }
    
    // Adjust the day difference
    if (dayDiff > 0) {
        previousDate.setDate(previousDate.getDate() - dayDiff);
    }

    // Convert the date to YYYY-MM-DD format
    const year = previousDate.getFullYear();
    const month = (previousDate.getMonth() + 1).toString().padStart(2, '0');
    const day = previousDate.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
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

function calculateRanges() {
	const endDate = document.getElementById('visitDate').value;
	
	const buttonsContainer = document.getElementById('buttonsContainer');
	buttonsContainer.innerHTML = '';

	diffDaysList.forEach((diff, index) => {
		if (index == diffDaysList.length-1) return;//last=Adult

		const startDate = calculatePreviousDate(endDate, diff);
		const endDateForRange = calculatePreviousDate(calculatePreviousDate(endDate, diffDaysList[index+1]), {years: 0, months: 0, days: 1});
		
		const button = document.createElement('button');
		button.innerHTML = `<strong>${diff.label}</strong>: ${endDateForRange} ~ ${startDate}`;
		button.className = 'btn btn-secondary btn-block mb-2';
		button.onclick = function() {
			window.location.href = `./screening.htm?name=${diff.name}`;
        };
		buttonsContainer.appendChild(button);
	});
}

window.onload = function() {
	populateLastVisitDate();
    setTodayAsDefault();

	calculateRanges();
};
