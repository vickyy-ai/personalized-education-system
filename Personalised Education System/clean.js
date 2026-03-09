const fs = require('fs');
const file = 'recommendations.html';
let html = fs.readFileSync(file, 'utf8');

const startStr = '<div class="recommendations-content">';
const endStr = '</main>';

const startIdx = html.indexOf(startStr) + startStr.length;
const endIdx = html.indexOf(endStr);

if (startIdx > startStr.length - 1 && endIdx > -1) {
    const newMiddle = `
                <h1 class="recommendations-title" id="recHeading">Recommended Courses</h1>
                <div class="recommendations-grid" id="recGrid">
                    <!-- Cards will be injected here by script.js -->
                </div>
            </div>
        `;

    html = html.substring(0, startIdx) + newMiddle + html.substring(endIdx);
    fs.writeFileSync(file, html);
    console.log('Fixed recommendations.html');
} else {
    console.log('Could not find strings.');
}
