"use strict";
(function() {
  window.addEventListener('load', init);

  function init() {
    autoResize();
    toggleDropdownContact();
    setupChatForm();
    setupDrugSelection();
    setupFileUpload();
    setupSampleQuestions();
  }

  function autoResize() {
    const textarea = id("question");
    const maxHeight = 150; // Match this with your CSS max-height

    textarea.style.height = 'auto';

    // Only resize up to maxHeight
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = newHeight + 'px';

    textarea.addEventListener('input', function () {
      this.style.height = 'auto';
      const newHeight = Math.min(this.scrollHeight, maxHeight);
      this.style.height = newHeight + 'px';
    });
  }

  function toggleDropdownContact() {
    const dropdown = qs('.contact-dropdown');
    const contactBox = qs('.contact-box');

    dropdown.addEventListener('click', () => {
      contactBox.classList.toggle('hidden');
    });
  }

  function setupChatForm() {
    const form = qs('form');
    const textarea = id('question');

    // Handle Enter key submission
    textarea.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
      }
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (textarea.value.trim() !== '') {
        appendUserMessage(textarea.value);
        // TODO: Add your chatbot response logic here
        // For now, we'll just echo the message
        appendBotMessage("This is a placeholder response. Replace with actual chatbot response.");
        textarea.value = '';
        textarea.style.height = 'auto';
      }
    });
  }

  function appendUserMessage(message) {
    const responseDiv = qs('.response');
    const wrapperDiv = gen('div');
    wrapperDiv.classList.add('user-align-right');
    
    const messageDiv = gen('div');
    messageDiv.classList.add('user-response');
    messageDiv.textContent = message;
    
    wrapperDiv.appendChild(messageDiv);
    responseDiv.appendChild(wrapperDiv);
    responseDiv.scrollTo({
      top: responseDiv.scrollHeight,
      behavior: 'smooth'
    });
  }

  function appendBotMessage(message) {
    const responseDiv = qs('.response');
    const messageDiv = gen('div');
    messageDiv.classList.add('bot-response');
    messageDiv.textContent = message;
    responseDiv.appendChild(messageDiv);
    responseDiv.scrollTo({
      top: responseDiv.scrollHeight,
      behavior: 'smooth'
    });
  }

  function setupDrugSelection() {
    const drugSelect = id('select-drug');
    const noDocs = qs('.no-docs');
    const sidebarDocuments = qs('.sidebar-documents');
    const sampleQuestions = qs('.sample-questions');
    const suggestionsHeader = qs('.suggestions');

    drugSelect.addEventListener('change', function() {
      if (this.value === 'self-upload') {
        noDocs.classList.remove('hidden');
        sidebarDocuments.style.maxHeight = '75%';
        sampleQuestions.classList.add('hidden');
        suggestionsHeader.classList.add('hidden');
      } else {
        noDocs.classList.add('hidden');
        sidebarDocuments.style.maxHeight = '40%';
        sampleQuestions.classList.remove('hidden');
        suggestionsHeader.classList.remove('hidden');
      }
    });

    // Set initial state based on default selection
    if (drugSelect.value === 'self-upload') {
      sidebarDocuments.style.maxHeight = '75%';
      sampleQuestions.classList.add('hidden');
      suggestionsHeader.classList.add('hidden');
    } else {
      sidebarDocuments.style.maxHeight = '40%';
      sampleQuestions.classList.remove('hidden');
      suggestionsHeader.classList.remove('hidden');
    }
  }

  function setupFileUpload() {
    const fileInput = id('fileInput');
    const sidebarDocuments = qs('.sidebar-documents');
    const noDocs = qs('.no-docs');

    fileInput.addEventListener('change', function(e) {
      const files = e.target.files;
      if (files.length > 0) {
        // Only clear the "No documents uploaded" message if it exists
        if (noDocs) {
          noDocs.remove();
        }

        // Add each uploaded file to the list
        for (const file of files) {
          const pdfItem = gen('div');
          pdfItem.classList.add('pdf-list');
          
          const pdfIcon = gen('img');
          pdfIcon.src = 'imgs/pdf-icon.svg';
          pdfIcon.alt = 'PDF icon';
          pdfIcon.classList.add('pdf-icon');
          
          const pdfName = gen('span');
          pdfName.classList.add('pdf-name');
          pdfName.textContent = file.name;
          
          pdfItem.appendChild(pdfIcon);
          pdfItem.appendChild(pdfName);
          sidebarDocuments.appendChild(pdfItem);
        }
      }
    });
  }

  function setupSampleQuestions() {
    const sampleQuestions = qs('.sample-questions');
    const drugSelect = id('select-drug');
    const questionTextarea = id('question');

    const questions = [
      "What is the formulation composition of {drug_name}",
      "What are the pharmacokinetic properties of {drug_name}",
      "What is the risk/benefit profile of {drug_name}",
      "What clinical trials were conducted for {drug_name}"
    ];

    // Function to update question text
    function updateQuestionText(questionDiv, question) {
      const selectedOption = drugSelect.options[drugSelect.selectedIndex];
      const selectedDrug = selectedOption.value === 'self-upload' ? 'the selected drug' : selectedOption.text;
      questionDiv.textContent = question.replace('{drug_name}', selectedDrug);
    }

    // Create and add question divs
    questions.forEach(question => {
      const questionDiv = gen('div');
      questionDiv.classList.add('sample-question');
      updateQuestionText(questionDiv, question);
      
      questionDiv.addEventListener('click', () => {
        questionTextarea.value = questionDiv.textContent;
        questionTextarea.focus();
        questionTextarea.dispatchEvent(new Event('input'));
      });

      sampleQuestions.appendChild(questionDiv);
    });

    // Update questions when drug selection changes
    drugSelect.addEventListener('change', () => {
      const questionDivs = sampleQuestions.querySelectorAll('.sample-question');
      questionDivs.forEach((div, index) => {
        updateQuestionText(div, questions[index]);
      });
    });
  }

  /**
   * Creates a new HTML element of the specified type.
   * @param {string} element - The type of HTML element to create.
   * @returns {object} - The newly created HTML element.
   */
  function gen(element) {
    return document.createElement(element);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }
})();