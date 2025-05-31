// ==UserScript==
// @name         T3 Chat - Keep Search Button Activated
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       idontknowhoaiam
// @match        https://t3.chat/*
// @match        https://t3.chat/chat/*
// @match        https://beta.t3.chat/*
// @match        https://beta.t3.chat/chat/*
// ==/UserScript==

(function () {
  "use strict";

  const SEARCH_BUTTON_SELECTOR = 'button[aria-label="Enable search"]';
  const BUTTON_STATE_CLOSED = "closed";
  const DEBOUNCE_DELAY_MS = 1;
  const INITIAL_DELAY_MS = 1;

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const context = this;
      const later = () => {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function SearchButtonActivator() {
    const activateSearchButtonIfNeeded = () => {
      const searchButton = document.querySelector(SEARCH_BUTTON_SELECTOR);
      if (searchButton) {
        const currentState = searchButton.getAttribute("data-state");
        if (currentState === BUTTON_STATE_CLOSED) {
          searchButton.click();
        }
      }
    };

    const debouncedActivateSearchButtonIfNeeded = debounce(
      activateSearchButtonIfNeeded,
      DEBOUNCE_DELAY_MS,
    );

    const setupEffects = () => {
      const initialTimeoutId = setTimeout(() => {
        activateSearchButtonIfNeeded();

        const observer = new MutationObserver((mutationsList, obs) => {
          debouncedActivateSearchButtonIfNeeded();
        });

        observer.observe(document.documentElement, {
          attributes: true,
          childList: true,
          subtree: true,
        });
      }, INITIAL_DELAY_MS);
    };

    setupEffects();
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    SearchButtonActivator();
  } else {
    document.addEventListener("DOMContentLoaded", SearchButtonActivator);
  }
})();