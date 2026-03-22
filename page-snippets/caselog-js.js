/**
 * GuideFlow Case Log Enhanced Functionality
 * Handles log type toggles, voice dictation, and EPA modal flows
 */

/* ========================================
   LOG TYPE TOGGLE FUNCTIONALITY
   ======================================== */

/**
 * Switch between operative case and bedside procedure log types
 * @param {string} type - 'operative' or 'bedside'
 */
function switchLogType(type) {
  const operativeForm = document.getElementById('operative-form');
  const bedsideForm = document.getElementById('bedside-form');
  const toggleOperative = document.getElementById('toggle-operative');
  const toggleBedside = document.getElementById('toggle-bedside');

  if (type === 'operative') {
    operativeForm.style.display = 'block';
    bedsideForm.style.display = 'none';
    toggleOperative.classList.add('active');
    toggleBedside.classList.remove('active');
  } else if (type === 'bedside') {
    operativeForm.style.display = 'none';
    bedsideForm.style.display = 'block';
    toggleBedside.classList.add('active');
    toggleOperative.classList.remove('active');
  }
}

/* ========================================
   VOICE DICTATION MODAL
   ======================================== */

/**
 * Open the voice dictation modal
 */
function openDictation() {
  const backdrop = document.getElementById('dictation-backdrop');
  const modal = document.getElementById('dictation-modal');
  
  backdrop.style.display = 'block';
  modal.style.display = 'block';
  
  // Add visible class for any fade-in animations if needed
  backdrop.classList.add('visible');
  modal.classList.add('visible');
}

/**
 * Close the voice dictation modal and optionally apply mock data
 * @param {boolean} applyMock - If true, fill form with mock transcribed data
 */
function closeDictation(applyMock) {
  const backdrop = document.getElementById('dictation-backdrop');
  const modal = document.getElementById('dictation-modal');
  
  backdrop.style.display = 'none';
  modal.style.display = 'none';
  backdrop.classList.remove('visible');
  modal.classList.remove('visible');

  if (applyMock) {
    // Fill form with mock transcribed data
    document.getElementById('f-procedure').value = 'lap-chole';
    document.getElementById('f-role').value = 'SJ';
    document.getElementById('f-category').value = 'Biliary';
    document.getElementById('f-autonomy').value = 'passive-help';
    
    // Show confirmation toast
    showToast('Voice transcription applied', 'success');
  }
}

/* ========================================
   EPA ASSESSMENT MODAL
   ======================================== */

/**
 * Display the post-submission EPA assessment request modal
 * @param {string} procName - Procedure name to display
 * @param {string} role - Role code (SJ, TA, FA, SC)
 * @param {string} date - Case date in YYYY-MM-DD format
 */
function showEpaModal(procName, role, date) {
  const backdrop = document.getElementById('epa-backdrop');
  const modal = document.getElementById('epa-modal');
  
  // Populate case summary
  document.getElementById('epa-procedure-name').textContent = procName;
  
  // Apply role badge styling
  const roleBadge = document.getElementById('epa-role-badge');
  roleBadge.textContent = role;
  roleBadge.className = 'role-badge ' + role.toLowerCase();
  
  // Format and display date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  document.getElementById('epa-case-date').textContent = formattedDate;
  
  // Show modal
  backdrop.style.display = 'block';
  modal.style.display = 'block';
  backdrop.classList.add('visible');
  modal.classList.add('visible');
  
  // Store case data for potential use in closeEpaModal
  window.currentEpaCase = {
    procedureName: procName,
    role: role,
    date: date
  };
}

/**
 * Close the EPA modal and optionally process the EPA request
 * @param {boolean} sendRequest - If true, send EPA request and add badge to case row
 */
function closeEpaModal(sendRequest) {
  const backdrop = document.getElementById('epa-backdrop');
  const modal = document.getElementById('epa-modal');
  
  backdrop.style.display = 'none';
  modal.style.display = 'none';
  backdrop.classList.remove('visible');
  modal.classList.remove('visible');

  if (sendRequest && window.currentEpaCase) {
    // Show confirmation toast
    showToast('EPA request sent to attending', 'success');
    
    // Find the most recent case row in the case log table and add EPA badge
    const caseRows = document.querySelectorAll('[data-case-row]');
    if (caseRows.length > 0) {
      const mostRecentRow = caseRows[caseRows.length - 1];
      
      // Check if badge already exists
      if (!mostRecentRow.querySelector('.case-epa-badge')) {
        const badge = document.createElement('span');
        badge.className = 'case-epa-badge';
        badge.textContent = 'EPA SENT';
        
        // Find the procedure name cell and append badge
        const procCell = mostRecentRow.querySelector('[data-procedure-name]');
        if (procCell) {
          procCell.appendChild(badge);
        }
      }
    }
  }
  
  // Clear stored case data
  window.currentEpaCase = null;
}

/* ========================================
   BEDSIDE PROCEDURE FORM SUBMISSION
   ======================================== */

/**
 * Submit a bedside procedure log entry
 */
function submitBedside() {
  // Collect form data
  const procedureType = document.getElementById('f-bedside-procedure').value;
  const site = document.getElementById('f-bedside-site').value;
  const ultrasound = document.getElementById('f-bedside-ultrasound').checked;
  const supervised = document.getElementById('f-bedside-supervised').value;
  const complications = document.getElementById('f-bedside-complications').value;
  const date = document.getElementById('f-bedside-date').value;
  const attending = document.getElementById('f-bedside-attending').value;
  const comments = document.getElementById('f-bedside-comments').value;

  // Validation
  if (!procedureType || !site || !supervised || !complications || !date || !attending) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  // Format submission data
  const submissionData = {
    type: 'bedside',
    procedureType: procedureType,
    site: site,
    ultrasoundGuided: ultrasound,
    supervised: supervised,
    complications: complications,
    date: date,
    attending: attending,
    comments: comments,
    timestamp: new Date().toISOString()
  };

  // Submit to backend or store locally
  console.log('Bedside procedure submission:', submissionData);
  
  // Add to case log table
  addBedsideCaseToTable(submissionData);
  
  // Reset form
  resetBedsideForm();
  
  // Show confirmation
  showToast('Bedside procedure logged successfully', 'success');
}

/**
 * Reset bedside procedure form to empty state
 */
function resetBedsideForm() {
  document.getElementById('f-bedside-procedure').value = '';
  document.getElementById('f-bedside-site').value = '';
  document.getElementById('f-bedside-ultrasound').checked = false;
  document.getElementById('f-bedside-supervised').value = '';
  document.getElementById('f-bedside-complications').value = '';
  document.getElementById('f-bedside-date').value = '';
  document.getElementById('f-bedside-attending').value = '';
  document.getElementById('f-bedside-comments').value = '';
}

/**
 * Add bedside case to the case log table
 * @param {object} caseData - The bedside case data object
 */
function addBedsideCaseToTable(caseData) {
  // This function assumes a case log table exists with a tbody
  // Customize based on actual table structure
  const tbody = document.querySelector('[data-case-log-tbody]');
  if (!tbody) return;

  const row = document.createElement('tr');
  row.setAttribute('data-case-row', 'true');
  
  const procedureMap = {
    'cvc-ij': 'Central Line (IJ)',
    'cvc-subclavian': 'Central Line (Subclavian)',
    'cvc-femoral': 'Central Line (Femoral)',
    'art-radial': 'Arterial Line (Radial)',
    'art-femoral': 'Arterial Line (Femoral)',
    'chest-tube': 'Chest Tube',
    'thoracentesis': 'Thoracentesis',
    'paracentesis': 'Paracentesis',
    'wound-vac': 'Wound VAC',
    'abscess-id': 'Abscess I&D',
    'trach-care': 'Tracheostomy Care',
    'gj-tube': 'G/J-Tube Management',
    'drain-mgmt': 'Drain Management'
  };
  
  const procName = procedureMap[caseData.procedureType] || caseData.procedureType;
  const formattedDate = new Date(caseData.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  row.innerHTML = `
    <td data-procedure-name>${procName}</td>
    <td>${caseData.site}</td>
    <td>${caseData.ultrasoundGuided ? 'Yes' : 'No'}</td>
    <td>${caseData.supervised}</td>
    <td>${caseData.complications}</td>
    <td>${caseData.attending}</td>
    <td>${formattedDate}</td>
  `;
  
  tbody.appendChild(row);
}

/* ========================================
   OPERATIVE CASE SUBMISSION ENHANCEMENT
   ======================================== */

/**
 * Wrapper for existing submitCase() to integrate EPA modal
 * Call this instead of submitCase() to enable EPA flow
 */
function submitCaseWithEpa() {
  // Get form values before submission
  const procedure = document.getElementById('f-procedure');
  const role = document.getElementById('f-role');
  const date = document.getElementById('f-date');
  
  if (!procedure || !role || !date) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  // Get the display name for the procedure
  const procOption = procedure.options[procedure.selectedIndex];
  const procName = procOption.text;
  const roleValue = role.value;
  const dateValue = date.value;
  
  // Submit the case using existing submitCase function
  // Assuming submitCase exists and handles form submission
  if (typeof submitCase === 'function') {
    const success = submitCase();
    
    // If submission was successful, show EPA modal
    if (success !== false) {
      showEpaModal(procName, roleValue, dateValue);
    }
  } else {
    // Fallback: show EPA modal directly
    showEpaModal(procName, roleValue, dateValue);
  }
}
