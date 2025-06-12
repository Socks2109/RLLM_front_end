"use strict";
(function() {
  window.addEventListener('load', init);

  function init() {
    autoResize();
    toggleDropdownContact();
    setupChatForm();
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