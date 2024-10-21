resetButton = document.querySelector(".limpiar");
mortgageForm = document.querySelector(".form");
[inputAmount, inputRate, inputTerm] = ["#amount", "#interest", "#term"].map(id => document.querySelector(id));
[errorAmount, errorRate, errorTerm, errorType] = [".error_amount", ".error_rate", ".error_term", ".error_type"].map(sel => document.querySelector(sel));
inputGroups = document.querySelectorAll(".form_group");
mortgageOptions = document.querySelectorAll("input[name='type']");
[monthlyResult, totalResult, displayResults, hideResultsGuide] = [".complete-monthly", ".complete-full", ".results_complete", ".results_guide"].map(sel => document.querySelector(sel));

selectedMortgageType = () => [...mortgageOptions].find(option => option.checked)?.value;

validateInputs = () => {
   fields = [
    { input: inputAmount, error: errorAmount, group: inputGroups[0] },
    { input: inputTerm, error: errorTerm, group: inputGroups[1] },
    { input: inputRate, error: errorRate, group: inputGroups[2] }
  ];
  let inputsAreValid = fields.every(({ input, error, group }) => {
     isValid = input.value && parseFloat(input.value) > 0;
    error.textContent = isValid ? "" : (input.value ? "Please enter a valid number" : "This field is required");
    group.classList.toggle("error", !isValid);
    return isValid;
  });

  type = selectedMortgageType();
  errorType.textContent = type ? "" : "Please select a mortgage type";
  inputGroups[3].classList.toggle("error", !type);
  return inputsAreValid && type;
};

// reset button
resetButton.addEventListener("click", () => {
  mortgageForm.reset();
  inputGroups.forEach(group => group.classList.remove("error"));
  [errorAmount, errorRate, errorTerm, errorType].forEach(error => (error.textContent = ""));
  displayResults.style.display = "none";
  hideResultsGuide.style.display = "flex";
});


// calculate
computeMortgage = (amount, rate, term, type) => {
  monthlyRate = rate / 12 / 100;
  totalPayments = term * 12;
  monthlyPayment = type === "repayment"
    ? (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments))
    : amount * monthlyRate;
  totalPayment = monthlyPayment * totalPayments;
  monthlyResult.textContent = `£ ${addThousandsSeparator(monthlyPayment.toFixed(2))}`;
  totalResult.textContent = `£ ${addThousandsSeparator(totalPayment.toFixed(2))}`;
  displayResults.style.display = "block";
  hideResultsGuide.style.display = "none";
}
addThousandsSeparator = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// submit form
mortgageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validateInputs()) {
    const [amount, rate, term] = [inputAmount.value, inputRate.value, inputTerm.value].map(parseFloat);
    computeMortgage(amount, rate, term, selectedMortgageType());
  }
});

