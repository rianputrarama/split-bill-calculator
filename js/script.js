// Initialize counter untuk unique person IDs
let personCount = 1;

// Get DOM elements
const splitBillForm = document.getElementById('splitBillForm');
const totalBillAmountInput = document.getElementById('totalBillAmount');
const peopleContainer = document.getElementById('peopleContainer');
const addPersonButton = document.getElementById('addPersonButton');
const resetButton = document.getElementById('resetButton');
const resultDiv = document.getElementById('result');

// Event Listeners
addPersonButton.addEventListener('click', addPerson);
splitBillForm.addEventListener('submit', calculateSplit);
resetButton.addEventListener('click', resetForm);

// Add new person input field
function addPerson(e) {
  e.preventDefault();
  
  const personInput = document.createElement('div');
  personInput.className = 'person-input';
  personInput.innerHTML = `
    <label for="person${personCount}">Person ${personCount + 1}:</label>
    <input type="text" id="person${personCount}" class="personName" placeholder="Enter name" required>
  `;
  
  peopleContainer.appendChild(personInput);
  personCount++;
}

// Calculate split bill
function calculateSplit(e) {
  e.preventDefault();
  
  const totalBill = parseFloat(totalBillAmountInput.value);
  const personInputs = document.querySelectorAll('.personName');
  
  // Validate
  if (isNaN(totalBill) || totalBill <= 0) {
    alert('Please enter a valid bill amount');
    return;
  }
  
  if (personInputs.length === 0) {
    alert('Please add at least one person');
    return;
  }
  
  // Get all names
  const names = Array.from(personInputs).map(input => input.value.trim());
  
  // Check for empty names
  if (names.some(name => name === '')) {
    alert('Please fill in all person names');
    return;
  }
  
 // Calculate per person
const splitAmount = totalBill / names.length;

// Generate result HTML
let resultHTML = `<h2>Bill Split Result</h2>`;
resultHTML += `<p><strong>Total Bill:</strong> Rp${Math.round(totalBill).toLocaleString('id-ID')}</p>`;
resultHTML += `<p><strong>Number of People:</strong> ${names.length}</p>`;
resultHTML += `<p><strong>Amount per person:</strong> Rp${Math.round(splitAmount).toLocaleString('id-ID')}</p>`;
resultHTML += `<hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">`;
resultHTML += `<h3 style="margin-top: 15px; margin-bottom: 10px;">Breakdown:</h3>`;

names.forEach(name => {
  resultHTML += `<p>✓ <strong>${name}</strong> pays: <span style="color: #667eea; font-weight: bold;">Rp${Math.round(splitAmount).toLocaleString('id-ID')}</span></p>`;
});
  
  // Display result
  resultDiv.innerHTML = resultHTML;
  resultDiv.classList.add('show');
}

// Reset form
function resetForm(e) {
  e.preventDefault();
  
  // Reset inputs
  totalBillAmountInput.value = '';
  resultDiv.innerHTML = '';
  resultDiv.classList.remove('show');
  
  // Reset person inputs (keep only first one)
  peopleContainer.innerHTML = `
    <div class="person-input">
      <label for="person0">Person 1:</label>
      <input type="text" id="person0" class="personName" placeholder="Enter name" required>
    </div>
  `;
  
  personCount = 1;
}