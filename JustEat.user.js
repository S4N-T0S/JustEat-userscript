// ==UserScript==
// @name         Just Eat Custom Userscript (UK)
// @namespace    https://github.com/S4N-T0S/JustEat-userscript
// @version      1.1
// @description  Customizable Just Eat filter with dark mode option
// @match        https://www.just-eat.co.uk/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @updateURL    https://github.com/S4N-T0S/JustEat-userscript/raw/main/JustEat.user.js
// @downloadURL  https://github.com/S4N-T0S/JustEat-userscript/raw/main/JustEat.user.js
// @homepageURL  https://github.com/S4N-T0S/JustEat-userscript
// @supportURL   https://github.com/S4N-T0S/JustEat-userscript/issues
// ==/UserScript==

(function () {
    'use strict';

    // Function to get or set the user's settings from localStorage
    const config = {
        minRating: parseFloat(GM_getValue('minRating', 4.5)),
        minReviews: parseInt(GM_getValue('minReviews', 50), 10),
        excludeNew: GM_getValue('excludeNew', true),
        filterNoReviews: GM_getValue('filterNoReviews', true),
        hideMode: GM_getValue('hideMode', false),
        enableDarkMode: GM_getValue('enableDarkMode', true),
    };

    // Inject an options menu
    function createOptionsMenu() {
        const menuHtml = `
            <style>
                #je-options-menu {
                    position: fixed;
                    bottom: 60px;
                    left: 10px;
                    width: 320px;
                    height: auto;
                    max-height: 80vh;
                    background: #fff;
                    padding: 0;
                    border-radius: 10px;
                    box-shadow: 0 0 12px rgba(0,0,0,0.2);
                    z-index: 9999;
                    font-family: sans-serif;
                    display: none;
                    flex-direction: column;
                }
                #je-options-header {
                    padding: 15px;
                    border-bottom: 1px solid #ddd;
                }
                #je-options-header h3 {
                    margin: 0;
                    font-size: 18px;
                    color: #333;
                }
                #je-options-content {
                    padding: 15px;
                    overflow-y: auto;
                    flex-grow: 1;
                }
                .je-setting {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 10px 0;
                    font-size: 14px;
                }
                input[type="number"] {
                    width: 60px;
                    padding: 3px;
                }
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 40px;
                    height: 20px;
                }
                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #ccc;
                    transition: 0.4s;
                    border-radius: 20px;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 16px; width: 16px;
                    left: 2px; bottom: 2px;
                    background-color: white;
                    transition: 0.4s;
                    border-radius: 50%;
                }
                input:checked + .slider {
                    background-color: #4CAF50;
                }
                input:checked + .slider:before {
                    transform: translateX(20px);
                }
                #je-options-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 15px;
                    border-top: 1px solid #ddd;
                    background: #f9f9f9;
                    border-bottom-left-radius: 10px;
                    border-bottom-right-radius: 10px;
                }
                #saveSettings {
                    padding: 8px 12px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    font-size: 14px;
                    cursor: pointer;
                }
                .je-footer-link {
                    color: #24292f;
                    text-decoration: none;
                    font-size: 14px;
                }
                #settings-icon {
                    position: fixed;
                    bottom: 10px;
                    left: 10px;
                    background-color: orange;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    padding: 10px;
                    z-index: 10000;
                    cursor: pointer;
                }
            </style>
            <div id="je-options-menu">
                <div id="je-options-header">
                    <h3>JustEat Script Settings</h3>
                </div>
                <div id="je-options-content">
                    <div class="je-setting">
                        <label for="minRating">Minimum Rating (1–5)</label>
                        <input type="number" id="minRating" value="${config.minRating}" step="0.1" min="1" max="5">
                    </div>
                    <div class="je-setting">
                        <label for="minReviews">Minimum Reviews</label>
                        <input type="number" id="minReviews" value="${config.minReviews}" min="0">
                    </div>
                    <div class="je-setting">
                        <label for="excludeNew">Exclude New Restaurants</label>
                        <label class="switch">
                            <input type="checkbox" id="excludeNew" ${config.excludeNew ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="je-setting">
                        <label for="filterNoReviews">Exclude Restaurants with No Reviews</label>
                        <label class="switch">
                            <input type="checkbox" id="filterNoReviews" ${config.filterNoReviews ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="je-setting">
                        <label for="hideMode">Remove Instead of Fade</label>
                        <label class="switch">
                            <input type="checkbox" id="hideMode" ${config.hideMode ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="je-setting">
                        <label for="enableDarkMode">Enable Dark Mode</label>
                        <label class="switch">
                            <input type="checkbox" id="enableDarkMode" ${config.enableDarkMode ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                <div id="je-options-footer">
                    <a href="https://github.com/S4N-T0S/JustEat-userscript" target="_blank" class="je-footer-link">GitHub</a>
                    <button id="saveSettings">Save Settings</button>
                </div>
            </div>
            <button id="settings-icon">⚙️</button>
        `;

        const menuContainer = document.createElement('div');
        menuContainer.innerHTML = menuHtml;
        document.body.appendChild(menuContainer);

        const settingsIcon = document.getElementById('settings-icon');
        const optionsMenu = document.getElementById('je-options-menu');

        settingsIcon.addEventListener('click', () => {
            const isHidden = getComputedStyle(optionsMenu).display === 'none';
            optionsMenu.style.display = isHidden ? 'flex' : 'none';
        });

        document.getElementById('saveSettings').addEventListener('click', () => {
            config.minRating = parseFloat(document.getElementById('minRating').value);
            config.minReviews = parseInt(document.getElementById('minReviews').value, 10);
            config.excludeNew = document.getElementById('excludeNew').checked;
            config.filterNoReviews = document.getElementById('filterNoReviews').checked;
            config.hideMode = document.getElementById('hideMode').checked;
            config.enableDarkMode = document.getElementById('enableDarkMode').checked;

            GM_setValue('minRating', config.minRating);
            GM_setValue('minReviews', config.minReviews);
            GM_setValue('excludeNew', config.excludeNew);
            GM_setValue('filterNoReviews', config.filterNoReviews);
            GM_setValue('hideMode', config.hideMode);
            GM_setValue('enableDarkMode', config.enableDarkMode);

            window.location.reload();
        });
    }

    // Add dark mode CSS
    const darkModeCSS = `
        html {
            filter: invert(1) hue-rotate(180deg);
        }
        img, svg, iframe, video {
            filter: invert(1) hue-rotate(180deg);
        }
        div[class*="image-tile-style_image-wrapper"] {
            filter: invert(1) hue-rotate(180deg);
        }
    `;

    function applyDarkMode() {
        if (!config.enableDarkMode) return;

        // Add dark mode CSS
        if (!document.getElementById('je-dark-mode-style')) {
            const style = document.createElement('style');
            style.id = 'je-dark-mode-style';
            style.textContent = darkModeCSS;
            document.head.appendChild(style);
        }

        // Fix images loaded after DOM updates
        const media = document.querySelectorAll('img, svg, iframe, video');
        media.forEach(el => {
            el.style.filter = 'invert(1) hue-rotate(180deg) !important';
        });
    }

    // Function to parse numbers from text (e.g., for reviews count)
    function parseNumber(text) {
        if (!text) return 0;
        const match = text.match(/\d+/g);
        if (!match) return 0;
        return parseInt(match.join(''), 10);
    }

    // Check if a restaurant is new
    function isNewRestaurant(card) {
        // Updated selector for the "New" tag, keeping old ones for fallback
        return (
            card.querySelector('pie-tag[data-qa="tag-new"]') ||
            card.querySelector("div[class*='restaurant-card_new-tag__']") ||
            card.querySelector('div[data-qa="tag-new"]')
        );
    }

    // Process each restaurant card
    function processRestaurantCard(card) {
        if (card.dataset.processed === 'true') return;

        try {
            const anchor = card.querySelector('a');
            if (!anchor) return;

            const isNew = isNewRestaurant(card);
            if (isNew && config.excludeNew) {
                if (config.hideMode) {
                    card.parentElement.remove();
                } else {
                    card.style.backgroundColor = '#ffcccc';
                    card.style.opacity = '0.3';
                }
                card.dataset.processed = 'true';
                return;
            }

            const ratingDiv = anchor.querySelector("div[class*='restaurant-ratings_rating']");
            // Updated selector for reviews, which are now in a <span>
            const votesSpan = anchor.querySelector("span[class*='restaurant-ratings_votes']");

            // If ratingDiv or votesSpan doesn't exist, it likely has no reviews
            if (!ratingDiv || !votesSpan) {
                if (config.filterNoReviews) {
                    // Apply the filter to restaurants with no reviews
                    if (config.hideMode) {
                        card.parentElement.remove();
                    } else {
                        card.style.backgroundColor = '#ffcccc';
                        card.style.opacity = '0.3';
                    }
                }
                card.dataset.processed = 'true';
                return;
            }

            // parseFloat correctly extracts the leading number from a string like "5 Excellent"
            const rating = parseFloat(ratingDiv.textContent.trim());
            const reviews = parseNumber(votesSpan.textContent);

            if (isNaN(rating) || isNaN(reviews)) return;

            if (rating < config.minRating || reviews < config.minReviews) {
                if (config.hideMode) {
                    card.parentElement.remove();
                } else {
                    card.style.backgroundColor = '#ffcccc';
                    card.style.opacity = '0.5';
                }
            }

            card.dataset.processed = 'true';
        } catch (e) {
            console.error("Error processing restaurant card:", e);
        }
    }

    // Scan all restaurant cards on the page
    function scanAllCards() {
        const cards = document.querySelectorAll("div[class*='restaurant-card-shell_card']");
        cards.forEach(processRestaurantCard);
    }

    // Check if tab is focused for reapplication of filters
    function isTabFocused() {
        return !document.hidden;
    }

    // Apply changes periodically
    function reapplyFixes() {
        scanAllCards();
        applyDarkMode();
    }

    // Initialize the options menu and apply settings
    createOptionsMenu();

    // Repeat every 1s
    setInterval(() => {
        if (isTabFocused()) {
            reapplyFixes();
        }
    }, 1000);

    // Initial apply of settings
    applyDarkMode();

})();