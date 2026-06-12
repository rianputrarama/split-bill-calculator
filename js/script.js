// Initialize counter untuk unique person IDs
let personCount = 1;

// Get DOM elements
const splitBillForm = document.getElementById('splitBillForm');
const totalBillAmountInput = document.getElementById('totalBillAmount');
const peopleContainer = document.getElementById('peopleContainer');
const addPersonButton = document.getElementById('addPersonButton');
const resetButton = document.getElementById('resetButton');
const resultDiv = document.getElementById('result');

// Page Navigation
const navLinks = document.querySelectorAll('.nav-link');
const equalSplitSection = document.getElementById('equalSplit');
const customSplitSection = document.getElementById('customSplit');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Remove active class dari semua
    navLinks.forEach(l => l.classList.remove('active'));
    
    // Add active class ke link yang diklik
    link.classList.add('active');
    
    // Get page dari data-page attribute
    const page = link.getAttribute('data-page');
    
    // Toggle sections
    if (page === 'equal') {
      equalSplitSection.classList.remove('hidden');
      customSplitSection.classList.add('hidden');
    } else if (page === 'custom') {
      equalSplitSection.classList.add('hidden');
      customSplitSection.classList.remove('hidden');
    }
  });
});

// Event Listeners
addPersonButton.addEventListener('click', addPerson);
splitBillForm.addEventListener('submit', calculateSplit);
resetButton.addEventListener('click', resetForm);

// Format rupiah input real-time
totalBillAmountInput.addEventListener('input', function() {
  let value = this.value;
  
  // Hapus semua non-digit dan dot
  value = value.replace(/[^\d]/g, '');
  
  if (value.length > 0) {
    // Format dengan dot setiap 3 digit
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  
  this.value = value;
});

// Delete button for default equal split person
const defaultEqualDeleteBtn = document.querySelector('#peopleContainer .deletePersonButton');
if (defaultEqualDeleteBtn) {
  defaultEqualDeleteBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (document.querySelectorAll('.personName').length > 1) {
      this.closest('.person-input').remove();
    } else {
      alert('Must have at least one person');
    }
  });
}

// Add new person input field
function addPerson(e) {
  e.preventDefault();
  
  const personInput = document.createElement('div');
  personInput.className = 'person-input';
  personInput.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div style="flex: 1;">
        <label for="person${personCount}">Person ${personCount + 1}:</label>
        <input type="text" id="person${personCount}" class="personName" placeholder="Enter name" required>
      </div>
      <button type="button" class="deletePersonButton" style="background-color: #f44336; color: white; padding: 8px 12px; margin-top: 25px; margin-left: 10px;">×</button>
    </div>
  `;
  
  peopleContainer.appendChild(personInput);
  
  // Add delete button listener
  const deleteBtn = personInput.querySelector('.deletePersonButton');
  deleteBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (document.querySelectorAll('.personName').length > 1) {
      personInput.remove();
    } else {
      alert('Must have at least one person');
    }
  });
  
  personCount++;
}

// Calculate split bill
function calculateSplit(e) {
  e.preventDefault();
  
  // Remove formatting before parse
  const totalBillValue = totalBillAmountInput.value.replace(/\./g, '');
  const totalBill = parseFloat(totalBillValue) || 0;
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

  // Add export button
  resultDiv.innerHTML += `<button type="button" id="exportPdfButton" style="background-color: #FF9800; margin-top: 15px;">Export to PDF</button>`;
  
  // Add event listener to export button
  document.getElementById('exportPdfButton').addEventListener('click', function() {
    exportEqualSplitPDF(names, splitAmount, totalBill);
  });
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
      <div>
        <div>
          <label for="person0">Person 1:</label>
          <input type="text" id="person0" class="personName" placeholder="Enter name" required>
        </div>
        <button type="button" class="deletePersonButton">×</button>
      </div>
    </div>
  `;
  
  // Add delete listener untuk default person
  const defaultDeleteBtn = document.querySelector('#peopleContainer .deletePersonButton');
  if (defaultDeleteBtn) {
    defaultDeleteBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (document.querySelectorAll('.personName').length > 1) {
        this.closest('.person-input').remove();
      } else {
        alert('Must have at least one person');
      }
    });
  }
  
  personCount = 1;
}

// ===== CUSTOM SPLIT LOGIC =====
let customPersonCount = 1;

// Get Custom Split DOM elements
const customSplitForm = document.getElementById('customSplitForm');
const customTotalBillInput = document.getElementById('customTotalBill');
const customPeopleContainer = document.getElementById('customPeopleContainer');
const addCustomPersonButton = document.getElementById('addCustomPersonButton');
const customResetButton = document.getElementById('customResetButton');
const customResultDiv = document.getElementById('customResult');

// Format default custom amount input
const defaultCustomAmount = document.getElementById('customAmount0');
if (defaultCustomAmount) {
  defaultCustomAmount.addEventListener('input', function() {
    let value = this.value;
    value = value.replace(/[^\d]/g, '');
    
    if (value.length > 0) {
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    
    this.value = value;
  });
}

// Delete button for default person
const defaultDeleteBtn = document.querySelector('#customPeopleContainer .deletePersonButton');
if (defaultDeleteBtn) {
  defaultDeleteBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (document.querySelectorAll('.customPersonName').length > 1) {
      this.closest('.person-input').remove();
    } else {
      alert('Must have at least one person');
    }
  });
}

// Event Listeners for Custom Split
addCustomPersonButton.addEventListener('click', addCustomPerson);
customSplitForm.addEventListener('submit', calculateCustomSplit);
customResetButton.addEventListener('click', resetCustomForm);

// Format custom bill input real-time
customTotalBillInput.addEventListener('input', function() {
  let value = this.value;
  value = value.replace(/[^\d]/g, '');
  
  if (value.length > 0) {
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  
  this.value = value;
});

// Add new custom person input
function addCustomPerson(e) {
  e.preventDefault();
  
  const personInput = document.createElement('div');
  personInput.className = 'person-input';
  personInput.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div style="flex: 1;">
        <label for="customPerson${customPersonCount}">Person ${customPersonCount + 1}:</label>
        <input type="text" id="customPerson${customPersonCount}" class="customPersonName" placeholder="Enter name" required>
        <label for="customAmount${customPersonCount}">Amount:</label>
        <input type="text" id="customAmount${customPersonCount}" class="customPersonAmount" placeholder="Enter amount" required>
      </div>
      <button type="button" class="deletePersonButton" style="background-color: #f44336; color: white; padding: 8px 12px; margin-top: 25px; margin-left: 10px;">×</button>
    </div>
  `;
  
  customPeopleContainer.appendChild(personInput);
  
  // Format amount input real-time
  const newAmountInput = document.getElementById(`customAmount${customPersonCount}`);
  newAmountInput.addEventListener('input', function() {
    let value = this.value;
    value = value.replace(/[^\d]/g, '');
    
    if (value.length > 0) {
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    
    this.value = value;
  });
  
  // Add delete button listener
  const deleteBtn = personInput.querySelector('.deletePersonButton');
  deleteBtn.addEventListener('click', function(e) {
    e.preventDefault();
    personInput.remove();
  });
  
  customPersonCount++;
}

// Calculate custom split
function calculateCustomSplit(e) {
  e.preventDefault();
  
  // Parse total bill
  const customTotalBillValue = customTotalBillInput.value.replace(/\./g, '');
  const customTotalBill = parseFloat(customTotalBillValue) || 0;
  
  // Get all custom person inputs
  const customNameInputs = document.querySelectorAll('.customPersonName');
  const customAmountInputs = document.querySelectorAll('.customPersonAmount');
  
  // Validate
  if (isNaN(customTotalBill) || customTotalBill <= 0) {
    alert('Please enter a valid bill amount');
    return;
  }
  
  if (customNameInputs.length === 0) {
    alert('Please add at least one person');
    return;
  }
  
  // Get names and amounts
  const customNames = Array.from(customNameInputs).map(input => input.value.trim());
  const customAmounts = Array.from(customAmountInputs).map(input => {
    const val = input.value.replace(/\./g, '');
    return parseFloat(val) || 0;
  });
  
  // Check for empty names
  if (customNames.some(name => name === '')) {
    alert('Please fill in all person names');
    return;
  }
  
  // Check for empty amounts
  if (customAmounts.some(amount => amount === 0)) {
    alert('Please fill in all amounts');
    return;
  }
  
  // Calculate total from amounts
  const totalFromAmounts = customAmounts.reduce((sum, amount) => sum + amount, 0);
  
  // Validate total matches
  if (Math.abs(totalFromAmounts - customTotalBill) > 1) {
    alert(`Total amount (Rp${Math.round(totalFromAmounts).toLocaleString('id-ID')}) doesn't match bill (Rp${Math.round(customTotalBill).toLocaleString('id-ID')})`);
    return;
  }
  
  // Find min and max
  const maxAmount = Math.max(...customAmounts);
  const minAmount = Math.min(...customAmounts);
  // Find all people with max amount
  const maxPersons = customNames.filter((name, index) => customAmounts[index] === maxAmount).join(' & ');
  // Find all people with min amount
  const minPersons = customNames.filter((name, index) => customAmounts[index] === minAmount).join(' & ');
  
  // Generate result HTML
  let resultHTML = `<h2>Bill Split Result</h2>`;
  resultHTML += `<p><strong>Total Bill:</strong> Rp${Math.round(customTotalBill).toLocaleString('id-ID')}</p>`;
  resultHTML += `<p><strong>Number of People:</strong> ${customNames.length}</p>`;
  resultHTML += `<hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">`;
  resultHTML += `<h3 style="margin-top: 15px; margin-bottom: 10px;">Breakdown:</h3>`;
  
  customNames.forEach((name, index) => {
    resultHTML += `<p>✓ <strong>${name}</strong> pays: <span style="color: #667eea; font-weight: bold;">Rp${Math.round(customAmounts[index]).toLocaleString('id-ID')}</span></p>`;
  });
  
  // Add min/max summary
  resultHTML += `<hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">`;
  resultHTML += `<h3 style="margin-top: 15px; margin-bottom: 10px;">Summary:</h3>`;
  resultHTML += `<p>💰 <strong>Most Expensive:</strong> ${maxPersons} (Rp${Math.round(maxAmount).toLocaleString('id-ID')})</p>`;
  resultHTML += `<p>💸 <strong>Cheapest:</strong> ${minPersons} (Rp${Math.round(minAmount).toLocaleString('id-ID')})</p>`;
  
  // Display result
  customResultDiv.innerHTML = resultHTML;
  customResultDiv.classList.add('show');

  // Add export button
  customResultDiv.innerHTML += `<button type="button" id="exportCustomPdfButton" style="background-color: #FF9800; margin-top: 15px;">Export to PDF</button>`;
  
  // Add event listener to export button
  document.getElementById('exportCustomPdfButton').addEventListener('click', function() {
    exportCustomSplitPDF(customNames, customAmounts, customTotalBill, maxPerson, maxAmount, minPerson, minAmount);
  });
}

// Reset custom form
function resetCustomForm(e) {
  e.preventDefault();
  
  customTotalBillInput.value = '';
  customResultDiv.innerHTML = '';
  customResultDiv.classList.remove('show');
  
  customPeopleContainer.innerHTML = `
    <div class="person-input">
      <div>
        <div>
          <label for="customPerson0">Person 1:</label>
          <input type="text" id="customPerson0" class="customPersonName" placeholder="Enter name" required>
          <label for="customAmount0">Amount:</label>
          <input type="text" id="customAmount0" class="customPersonAmount" placeholder="Enter amount" required>
        </div>
        <button type="button" class="deletePersonButton">×</button>
      </div>
    </div>
  `;
  
  // Format default custom amount input
  const defaultCustomAmount = document.getElementById('customAmount0');
  if (defaultCustomAmount) {
    defaultCustomAmount.addEventListener('input', function() {
      let value = this.value;
      value = value.replace(/[^\d]/g, '');
      
      if (value.length > 0) {
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
      
      this.value = value;
    });
  }
  
  // Delete button for default custom person
  const defaultCustomDeleteBtn = document.querySelector('#customPeopleContainer .deletePersonButton');
  if (defaultCustomDeleteBtn) {
    defaultCustomDeleteBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (document.querySelectorAll('.customPersonName').length > 1) {
        this.closest('.person-input').remove();
      } else {
        alert('Must have at least one person');
      }
    });
  }
  
  customPersonCount = 1;
}


// ===== EXPORT PDF FUNCTIONS =====

// Export Equal Split to PDF
function exportEqualSplitPDF(names, splitAmount, totalBill) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(16);
  doc.text('Split Bill Calculator - Equal Split', 20, 20);
  
  // Date
  doc.setFontSize(10);
  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Date: ${dateStr}`, 20, 30);
  
  // Table data
  const tableData = names.map((name, index) => [
    index + 1,
    name,
    `Rp${Math.round(splitAmount).toLocaleString('id-ID')}`
  ]);
  
  // Add total row
  tableData.push(['', 'TOTAL', `Rp${Math.round(totalBill).toLocaleString('id-ID')}`]);
  
  // Generate table
  doc.autoTable({
    head: [['No', 'Name', 'Amount']],
    body: tableData,
    startY: 40,
    margin: 20,
    theme: 'grid',
    headStyles: {
      fillColor: [102, 126, 234],
      textColor: 255,
      fontStyle: 'bold'
    },
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    }
  });
  
  // Summary section
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.text('Summary:', 20, finalY);
  doc.setFontSize(10);
  doc.text(`Total Bill: Rp${Math.round(totalBill).toLocaleString('id-ID')}`, 20, finalY + 10);
  doc.text(`Number of People: ${names.length}`, 20, finalY + 20);
  doc.text(`Amount per person: Rp${Math.round(splitAmount).toLocaleString('id-ID')}`, 20, finalY + 30);
  
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const filename = `equal-split-bill-${day}-${month}-${year}.pdf`;

  doc.save(filename);
}

// Export Custom Split to PDF
function exportCustomSplitPDF(names, amounts, totalBill, maxPerson, maxAmount, minPerson, minAmount) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(16);
  doc.text('Split Bill Calculator - Custom Split', 20, 20);
  
  // Date
  doc.setFontSize(10);
  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Date: ${dateStr}`, 20, 30);
  
  // Table data
  const tableData = names.map((name, index) => [
    index + 1,
    name,
    `Rp${Math.round(amounts[index]).toLocaleString('id-ID')}`
  ]);
  
  // Add total row
  tableData.push(['', 'TOTAL', `Rp${Math.round(totalBill).toLocaleString('id-ID')}`]);
  
  // Generate table
  doc.autoTable({
    head: [['No', 'Name', 'Amount']],
    body: tableData,
    startY: 40,
    margin: 20,
    theme: 'grid',
    headStyles: {
      fillColor: [102, 126, 234],
      textColor: 255,
      fontStyle: 'bold'
    },
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    }
  });
  
  // Summary section
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.text('Summary:', 20, finalY);
  doc.setFontSize(10);
  doc.text(`Total Bill: Rp${Math.round(totalBill).toLocaleString('id-ID')}`, 20, finalY + 10);
  doc.text(`Number of People: ${names.length}`, 20, finalY + 20);
  doc.text(`Most Expensive: ${maxPerson} (Rp${Math.round(maxAmount).toLocaleString('id-ID')})`, 20, finalY + 30);
  doc.text(`Cheapest: ${minPerson} (Rp${Math.round(minAmount).toLocaleString('id-ID')})`, 20, finalY + 40);

  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const filename = `equal-split-bill-${day}-${month}-${year}.pdf`;

  doc.save(filename);
}