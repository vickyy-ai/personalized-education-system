const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\vicky\\.gemini\\antigravity\\Personalised Education System';

// 1. Add database.js to all html files
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
    let content = fs.readFileSync(path.join(dir, f), 'utf-8');
    if (!content.includes('database.js')) {
        content = content.replace('<script src="script.js"></script>', '<script src="database.js"></script>\n  <script src="script.js"></script>');
        fs.writeFileSync(path.join(dir, f), content);
    }
});

// 2. Update courses.html links
let coursesHtml = fs.readFileSync(path.join(dir, 'courses.html'), 'utf-8');
const coursesMap = {
    'Web Application Development: Basic Concepts': 'https://www.coursera.org/learn/web-app',
    'Deep Learning Inference with Azure ML Studio': 'https://www.coursera.org/projects/deep-learning-inference-azure-ml-studio',
    'Deep Learning for Business': 'https://www.coursera.org/learn/deep-learning-business',
    'Framework for Data Collection and Analysis': 'https://www.coursera.org/learn/data-collection-framework',
    'Programming Foundations with JavaScript, HTML and CSS': 'https://www.coursera.org/learn/duke-programming-web',
    'Introduction to Data Analytics': 'https://www.coursera.org/learn/introduction-to-data-analytics'
};

for (const [title, url] of Object.entries(coursesMap)) {
    const regex = new RegExp(`(<h3>${title}</h3>[\\s\\S]*?<a href=")#[^"]*(" class="course-btn">View Course</a>)`);
    coursesHtml = coursesHtml.replace(regex, `$1${url}$2 target="_blank"`);
}
// For any remaining generic ones just in case
coursesHtml = coursesHtml.replace(/<a href="#" class="course-btn">View Course<\/a>/g, '<a href="https://www.coursera.org/" target="_blank" class="course-btn">View Course</a>');
fs.writeFileSync(path.join(dir, 'courses.html'), coursesHtml);

// 3. Update recommendations.html links
let recHtml = fs.readFileSync(path.join(dir, 'recommendations.html'), 'utf-8');
const recMap = {
    'UX Design Fundamentals': 'https://www.coursera.org/learn/ux-design-fundamentals',
    'Web Design: Strategy and Information Architecture': 'https://www.coursera.org/learn/web-design-strategy',
    'Introduction to User Experience Principles and Processes': 'https://www.coursera.org/learn/user-experience-principles',
    'Visual Elements of User Interface Design': 'https://www.coursera.org/learn/visual-elements-user-interface-design',
    'UX Research at Scale: Surveys, Analytics, Online Testing': 'https://www.coursera.org/learn/ux-research-at-scale',
    'Web Design: Wireframes to Prototypes': 'https://www.coursera.org/learn/web-design-wireframes-prototypes',
    'UX and Interface Design Capstone': 'https://www.coursera.org/learn/ux-interface-design-capstone',
    'UI Design Capstone': 'https://www.coursera.org/learn/ui-design-capstone',
    'Best Practices for iOS User Interface Design': 'https://www.coursera.org/learn/ios-ui-design'
};

for (const [title, url] of Object.entries(recMap)) {
    const regex = new RegExp(`(<h3>${title}</h3>[\\s\\S]*?<a href=")#[^"]*(" class="course-btn">View Course</a>)`);
    recHtml = recHtml.replace(regex, `$1${url}$2 target="_blank"`);
}
recHtml = recHtml.replace(/<a href="#" class="course-btn">View Course<\/a>/g, '<a href="https://www.coursera.org/" target="_blank" class="course-btn">View Course</a>');
fs.writeFileSync(path.join(dir, 'recommendations.html'), recHtml);

console.log('Update complete');
