/* =============================================
   PERSONALIZED EDUCATION RECOMMENDATION SYSTEM
   Main JavaScript (DB-Connected)
   ============================================= */

// ---- Course Catalog & Helper Functions ----
const COURSE_CATALOG = [
  // 1. Programming & Software Development
  { title: 'Responsive Web Design (HTML/CSS)', rating: '4.8', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', domain: 'Programming & Software Development', tags: ['programming', 'html', 'css', 'javascript', 'web', 'frontend', 'beginner'] },
  { title: 'Python for Everybody Specialization', rating: '4.7', url: 'https://www.coursera.org/specializations/python', domain: 'Programming & Software Development', tags: ['programming', 'python', 'basics', 'beginner'] },
  { title: 'Java Programming and Software Engineering', rating: '4.8', url: 'https://www.coursera.org/specializations/java-programming', domain: 'Programming & Software Development', tags: ['programming', 'java', 'software', 'beginner'] },
  { title: 'Version Control with Git', rating: '4.9', url: 'https://www.coursera.org/learn/version-control-with-git', domain: 'Programming & Software Development', tags: ['programming', 'git', 'github', 'version control', 'beginner'] },
  { title: 'The Complete Node.js Developer Course', rating: '4.8', url: 'https://www.udemy.com/course/the-complete-nodejs-developer-course-2/', domain: 'Programming & Software Development', tags: ['programming', 'backend', 'node.js', 'javascript', 'web', 'intermediate'] },
  
  // 2. Law & Legal Studies
  { title: 'Introduction to English Common Law', rating: '4.7', url: 'https://www.coursera.org/learn/intro-common-law', domain: 'Law & Legal Studies', tags: ['law', 'legal', 'introduction', 'beginner'] },
  { title: 'America\'s Written Constitution', rating: '4.8', url: 'https://www.coursera.org/learn/constitution', domain: 'Law & Legal Studies', tags: ['law', 'constitution', 'legal', 'beginner'] },
  { title: 'A Law Student\'s Toolkit', rating: '4.7', url: 'https://www.coursera.org/learn/law-student', domain: 'Law & Legal Studies', tags: ['law', 'legal', 'skills', 'beginner'] },
  { title: 'European Business Law', rating: '4.8', url: 'https://www.coursera.org/specializations/european-business-law', domain: 'Law & Legal Studies', tags: ['law', 'business law', 'corporate', 'intermediate'] },

  // 3. Sports & Fitness
  { title: 'Science of Exercise', rating: '4.8', url: 'https://www.coursera.org/learn/science-exercise', domain: 'Sports & Fitness', tags: ['sports', 'fitness', 'exercise', 'science', 'beginner'] },
  { title: 'Stanford Introduction to Food and Health', rating: '4.7', url: 'https://www.coursera.org/learn/food-and-health', domain: 'Sports & Fitness', tags: ['sports', 'nutrition', 'health', 'beginner'] },
  { title: 'Yoga with Adriene: Foundations', rating: '4.9', url: 'https://www.youtube.com/playlist?list=PLui6Eyny-UzyVz_6_d0_QZ4H8m8Wc0_dG', domain: 'Sports & Fitness', tags: ['sports', 'yoga', 'fitness', 'beginner'] },
  { title: 'The Science of Training Young Athletes', rating: '4.6', url: 'https://www.coursera.org/learn/youth-sports', domain: 'Sports & Fitness', tags: ['sports', 'coaching', 'training', 'beginner'] },
  { title: 'Sports Marketing', rating: '4.7', url: 'https://www.coursera.org/learn/sports-marketing', domain: 'Sports & Fitness', tags: ['sports', 'marketing', 'business', 'intermediate'] },

  // 4. Arts & Design
  { title: 'Google UX Design Certificate', rating: '4.9', url: 'https://www.coursera.org/professional-certificates/google-ux-design', domain: 'Arts & Design', tags: ['design', 'ui', 'ux', 'user experience', 'beginner'] },
  { title: 'Graphic Design Specialization', rating: '4.8', url: 'https://www.coursera.org/specializations/graphic-design', domain: 'Arts & Design', tags: ['design', 'graphic', 'art', 'beginner'] },
  { title: 'Fundamentals of Graphic Design', rating: '4.7', url: 'https://www.coursera.org/learn/fundamentals-of-graphic-design', domain: 'Arts & Design', tags: ['design', 'graphic', 'basics', 'beginner'] },
  { title: 'UI / UX Design Specialization', rating: '4.8', url: 'https://www.coursera.org/specializations/ui-ux-design', domain: 'Arts & Design', tags: ['design', 'ui', 'ux', 'web', 'intermediate'] },

  // 5. Data Analytics
  { title: 'Google Data Analytics Certificate', rating: '4.8', url: 'https://www.coursera.org/professional-certificates/google-data-analytics', domain: 'Data Analytics', tags: ['analytics', 'data', 'google', 'beginner'] },
  { title: 'Excel Skills for Business', rating: '4.7', url: 'https://www.coursera.org/specializations/excel', domain: 'Data Analytics', tags: ['analytics', 'excel', 'spreadsheet', 'beginner'] },
  { title: 'IBM Data Analyst Professional Certificate', rating: '4.9', url: 'https://www.coursera.org/professional-certificates/ibm-data-analyst', domain: 'Data Analytics', tags: ['analytics', 'data', 'ibm', 'intermediate'] },
  { title: 'Data Visualization with Tableau', rating: '4.8', url: 'https://www.coursera.org/specializations/data-visualization', domain: 'Data Analytics', tags: ['analytics', 'tableau', 'visualization', 'intermediate'] },

  // 6. Healthcare
  { title: 'Anatomy Specialization', rating: '4.9', url: 'https://www.coursera.org/specializations/anatomy', domain: 'Healthcare', tags: ['healthcare', 'anatomy', 'biology', 'medical', 'beginner'] },
  { title: 'Vital Signs: Understanding What the Body Is Telling Us', rating: '4.7', url: 'https://www.coursera.org/learn/vital-signs', domain: 'Healthcare', tags: ['healthcare', 'medical', 'nursing', 'beginner'] },
  { title: 'Medical Neuroscience', rating: '4.8', url: 'https://www.coursera.org/learn/medical-neuroscience', domain: 'Healthcare', tags: ['healthcare', 'physiology', 'neuroscience', 'biology', 'beginner'] },
  { title: 'Epidemiology: The Basic Science of Public Health', rating: '4.7', url: 'https://www.coursera.org/learn/epidemiology', domain: 'Healthcare', tags: ['healthcare', 'public health', 'epidemiology', 'beginner'] },
  { title: 'Global Health: An Interdisciplinary Overview', rating: '4.6', url: 'https://www.coursera.org/learn/global-health-overview', domain: 'Healthcare', tags: ['healthcare', 'public health', 'systems', 'intermediate'] },

  // 7. Business & Management
  { title: 'Business Foundations Specialization', rating: '4.7', url: 'https://www.coursera.org/specializations/wharton-business-foundations', domain: 'Business & Management', tags: ['business', 'management', 'wharton', 'beginner'] },
  { title: 'Introduction to Finance and Accounting', rating: '4.8', url: 'https://www.coursera.org/specializations/finance-accounting', domain: 'Business & Management', tags: ['business', 'finance', 'accounting', 'beginner'] },
  { title: 'Digital Marketing Specialization', rating: '4.9', url: 'https://www.coursera.org/specializations/digital-marketing', domain: 'Business & Management', tags: ['business', 'marketing', 'digital', 'intermediate'] },
  { title: 'Project Management Specialization', rating: '4.8', url: 'https://www.coursera.org/specializations/project-management', domain: 'Business & Management', tags: ['business', 'project management', 'intermediate'] },

  // 8. Science & Research
  { title: 'Introduction to Astronomy', rating: '4.8', url: 'https://www.coursera.org/learn/astronomy', domain: 'Science & Research', tags: ['science', 'astronomy', 'physics', 'beginner'] },
  { title: 'Understanding Research Methods', rating: '4.7', url: 'https://www.coursera.org/learn/research-methods', domain: 'Science & Research', tags: ['science', 'research', 'methodology', 'beginner'] },
  { title: 'Introduction to Genetics and Evolution', rating: '4.7', url: 'https://www.coursera.org/learn/genetics-evolution', domain: 'Science & Research', tags: ['science', 'biology', 'genetics', 'beginner'] },
  { title: 'The Science of the Solar System', rating: '4.9', url: 'https://www.coursera.org/learn/solar-system', domain: 'Science & Research', tags: ['science', 'astronomy', 'space', 'intermediate'] },

  // 9. Cloud Computing (Consolidated into Programming & Software Development)
  { title: 'AWS Cloud Practitioner Essentials', rating: '4.8', url: 'https://www.coursera.org/learn/aws-cloud-practitioner-essentials', domain: 'Programming & Software Development', tags: ['cloud', 'aws', 'amazon', 'beginner'] },
  { title: 'Microsoft Azure Fundamentals AZ-900', rating: '4.7', url: 'https://www.coursera.org/specializations/microsoft-azure-fundamentals', domain: 'Programming & Software Development', tags: ['cloud', 'azure', 'microsoft', 'beginner'] },
  { title: 'Google Cloud Fundamentals: Core Infrastructure', rating: '4.7', url: 'https://www.coursera.org/learn/gcp-fundamentals', domain: 'Programming & Software Development', tags: ['cloud', 'gcp', 'google cloud', 'infrastructure', 'beginner'] },

  // 10. Cybersecurity (Consolidated into Programming & Software Development)
  { title: 'Google Cybersecurity Professional Certificate', rating: '4.8', url: 'https://www.coursera.org/professional-certificates/google-cybersecurity', domain: 'Programming & Software Development', tags: ['cybersecurity', 'security', 'google', 'networks', 'beginner'] },
  { title: 'Connect and Protect: Networks and Network Security', rating: '4.7', url: 'https://www.coursera.org/learn/networks-and-network-security', domain: 'Programming & Software Development', tags: ['cybersecurity', 'network security', 'infrastructure', 'beginner'] },

  // 11. Artificial Intelligence (Consolidated into Programming & Software Development)
  { title: 'AI for Everyone', rating: '4.8', url: 'https://www.coursera.org/learn/ai-for-everyone', domain: 'Programming & Software Development', tags: ['ai', 'artificial intelligence', 'machine learning', 'beginner'] },
  { title: 'Generative AI for Everyone', rating: '4.8', url: 'https://www.coursera.org/learn/generative-ai-for-everyone', domain: 'Programming & Software Development', tags: ['ai', 'generative ai', 'llm', 'beginner'] },
  { title: 'Supervised Machine Learning: Regression and Classification', rating: '4.9', url: 'https://www.coursera.org/learn/machine-learning', domain: 'Programming & Software Development', tags: ['ai', 'machine learning', 'regression', 'classification', 'beginner'] }
];

// Robust matching for domains (handles symbols, spaces, case)
function matchDomain(d1, d2) {
  if (!d1 || !d2) return false;
  var normalize = function(s) {
    return s.toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]/g, '');
  };
  return normalize(d1) === normalize(d2);
}

// ---- Navigation ----
function toggleMenu() {
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  }
}

// Close mobile menu on link click
document.addEventListener('DOMContentLoaded', function () {
  var navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      var hamburger = document.getElementById('hamburger');
      var navLinksEl = document.getElementById('navLinks');
      if (hamburger && navLinksEl) {
        hamburger.classList.remove('active');
        navLinksEl.classList.remove('active');
      }
    });
  });
});

// ---- Navbar Scroll Effect ----
window.addEventListener('scroll', function () {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- Scroll Reveal Animation ----
function revealOnScroll() {
  var reveals = document.querySelectorAll('.reveal');
  var windowHeight = window.innerHeight;
  reveals.forEach(function (el) {
    var top = el.getBoundingClientRect().top;
    if (top < windowHeight - 80) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);

// ---- Animated Counters ----
function animateCounters() {
  var counters = document.querySelectorAll('.stat-number[data-target]');
  counters.forEach(function (counter) {
    if (counter.dataset.animated) return;
    var rect = counter.getBoundingClientRect();
    if (rect.top > window.innerHeight) return;

    counter.dataset.animated = 'true';
    var target = parseInt(counter.getAttribute('data-target'));
    var suffix = counter.querySelector('span') ? counter.querySelector('span').textContent : '';
    var duration = 2000;
    var startTime = performance.now();

    function updateCounter(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      counter.textContent = current.toLocaleString();
      if (suffix) {
        var span = document.createElement('span');
        span.textContent = suffix;
        counter.appendChild(span);
      }
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

window.addEventListener('scroll', animateCounters);
window.addEventListener('DOMContentLoaded', animateCounters);

// ---- Form Message Helper ----
function showFormMessage(form, message, type) {
  var existing = form.parentElement.querySelector('.form-message');
  if (existing) existing.remove();

  var msgEl = document.createElement('div');
  msgEl.className = 'form-message';
  msgEl.textContent = message;
  msgEl.style.cssText =
    'text-align: center; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; margin-top: 14px; animation: cardSlideUp 0.3s ease-out;' +
    (type === 'error'
      ? 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;'
      : 'background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0;');

  form.parentElement.insertBefore(msgEl, form.nextSibling);

  setTimeout(function () {
    if (msgEl.parentElement) {
      msgEl.style.opacity = '0';
      msgEl.style.transition = 'opacity 0.3s ease';
      setTimeout(function () {
        if (msgEl.parentElement) msgEl.remove();
      }, 300);
    }
  }, 5000);
}

// ---- User Login (DB-connected) ----
async function handleLogin(event) {
  event.preventDefault();
  var form = event.target;
  var username = form.querySelector('#username').value.trim();
  var password = form.querySelector('#password').value.trim();

  if (!username || !password) {
    showFormMessage(form, 'Please fill in all fields.', 'error');
    return;
  }

  var result = await DB.loginUser(username, password);
  if (result.success) {
    showFormMessage(form, 'Login successful! Redirecting...', 'success');
    setTimeout(function () {
      var redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      var profile = DB.getCurrentProfile();
      if (profile && redirectUrl) {
        // Has profile + pending redirect → go to the intended page
        sessionStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
      } else if (profile) {
        // Has profile, no redirect → go to dashboard
        window.location.href = 'recommendations.html';
      } else {
        // No profile yet → create profile first (redirect stays in sessionStorage)
        window.location.href = 'create-profile.html';
      }
    }, 1000);
  } else {
    showFormMessage(form, result.message, 'error');
  }
}

// ---- User SignUp (DB-connected) ----
async function handleSignup(event) {
  event.preventDefault();
  var form = event.target;
  var username = form.querySelector('#username').value.trim();
  var email = form.querySelector('#email').value.trim();
  var password = form.querySelector('#password').value.trim();
  var confirmPassword = form.querySelector('#confirmPassword').value.trim();

  if (!username || !email || !password || !confirmPassword) {
    showFormMessage(form, 'Please fill in all fields.', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showFormMessage(form, 'Passwords do not match.', 'error');
    return;
  }

  if (password.length < 6) {
    showFormMessage(form, 'Password must be at least 6 characters.', 'error');
    return;
  }

  var result = await DB.registerUser(username, email, password);
  if (result.success) {
    showFormMessage(form, 'Account created! Redirecting to login...', 'success');
    setTimeout(function () {
      window.location.href = 'login.html';
    }, 1200);
  } else {
    showFormMessage(form, result.message, 'error');
  }
}

// ---- Forgot Password (DB-connected) ----
async function handleForgotPassword(event) {
  event.preventDefault();
  var form = event.target;
  var email = form.querySelector('#email').value.trim();
  var newPassword = form.querySelector('#newPassword').value.trim();
  var confirmPassword = form.querySelector('#confirmPassword').value.trim();

  if (!email || !newPassword || !confirmPassword) {
    showFormMessage(form, 'Please fill in all fields.', 'error');
    return;
  }

  if (newPassword !== confirmPassword) {
    showFormMessage(form, 'Passwords do not match.', 'error');
    return;
  }

  if (newPassword.length < 6) {
    showFormMessage(form, 'Password must be at least 6 characters.', 'error');
    return;
  }

  var result = await DB.resetPassword(email, newPassword);
  if (result.success) {
    showFormMessage(form, 'Password reset successful! Redirecting to login...', 'success');
    setTimeout(function () {
      window.location.href = 'login.html';
    }, 1200);
  } else {
    showFormMessage(form, result.message, 'error');
  }
}

// ---- Admin Login (DB-connected) ----
async function handleAdminLogin(event) {
  event.preventDefault();
  var form = event.target;
  var username = form.querySelector('#username').value.trim();
  var password = form.querySelector('#password').value.trim();

  if (!username || !password) {
    showFormMessage(form, 'Please fill in all fields.', 'error');
    return;
  }

  var result = await DB.adminLogin(username, password);
  if (result.success) {
    showFormMessage(form, 'Admin login successful! Redirecting...', 'success');
    setTimeout(function () {
      window.location.href = 'admin-users.html';
    }, 1000);
  } else {
    showFormMessage(form, result.message, 'error');
  }
}

// ---- Create Profile (DB-connected) ----
async function handleCreateProfile(event) {
  event.preventDefault();
  var form = event.target;
  var requiredFields = form.querySelectorAll('[required]');
  var allFilled = true;
  requiredFields.forEach(function (field) {
    if (!field.value.trim()) allFilled = false;
  });

  if (!allFilled) {
    showFormMessage(form, 'Please fill in all required fields.', 'error');
    return;
  }

  var profileData = {
    firstName: form.querySelector('#firstName').value.trim(),
    middleName: form.querySelector('#middleName').value.trim(),
    lastName: form.querySelector('#lastName').value.trim(),
    email: form.querySelector('#email').value.trim(),
    phone: form.querySelector('#phone').value.trim(),
    gender: form.querySelector('#gender').value,
    education: form.querySelector('#education').value.trim(),
    interest: form.querySelector('#interest').value.trim(),
    skills: form.querySelector('#skills').value.trim()
  };

  var result = await DB.createProfile(profileData);
  if (result.success) {
    showFormMessage(form, result.message, 'success');
    var redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
      setTimeout(function() {
        sessionStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
      }, 1500);
    }
  } else {
    showFormMessage(form, result.message, 'error');
  }
}

// ---- Update Profile (DB-connected) ----
async function handleUpdateProfile(event) {
  event.preventDefault();
  var form = event.target;
  var requiredFields = form.querySelectorAll('[required]');
  var allFilled = true;
  requiredFields.forEach(function (field) {
    if (!field.value.trim()) allFilled = false;
  });

  if (!allFilled) {
    showFormMessage(form, 'Please fill in all required fields.', 'error');
    return;
  }

  var profileData = {
    firstName: form.querySelector('#firstName').value.trim(),
    middleName: form.querySelector('#middleName').value.trim(),
    lastName: form.querySelector('#lastName').value.trim(),
    email: form.querySelector('#email').value.trim(),
    phone: form.querySelector('#phone').value.trim(),
    gender: form.querySelector('#gender').value,
    education: form.querySelector('#education').value.trim(),
    interest: form.querySelector('#interest').value.trim(),
    skills: form.querySelector('#skills').value.trim()
  };

  var result = await DB.updateProfile(profileData);
  if (result.success) {
    showFormMessage(form, result.message, 'success');
  } else {
    showFormMessage(form, result.message, 'error');
  }
}

// Pre-fill Update Profile form with existing data
function prefillUpdateProfile() {
  var profile = DB.getCurrentProfile();
  if (!profile) return;

  var fields = {
    firstName: profile.firstName,
    middleName: profile.middleName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    education: profile.education,
    interest: profile.interest,
    skills: profile.skills
  };

  for (var id in fields) {
    var el = document.getElementById(id);
    if (el && fields[id]) el.value = fields[id];
  }

  var genderEl = document.getElementById('gender');
  if (genderEl && profile.gender) genderEl.value = profile.gender;
}

// ---- Feedback (DB-connected) ----
async function handleFeedback(event) {
  event.preventDefault();
  var form = event.target;
  var email = form.querySelector('#email').value.trim();
  var rating = form.querySelector('#rating').value;
  var feedbackText = form.querySelector('#feedbackText').value.trim();

  if (!email || !rating || !feedbackText) {
    showFormMessage(form, 'Please fill in all fields.', 'error');
    return;
  }

  var result = await DB.submitFeedback(email, rating, feedbackText);
  if (result.success) {
    showFormMessage(form, 'Thank you! Feedback submitted successfully.', 'success');
    form.reset();
  } else {
    showFormMessage(form, result.message, 'error');
  }
}

// ---- Update sidebar email & Navbar from session ----
function updateSidebarEmail() {
  if (typeof DB === 'undefined') return;
  var user = DB.getCurrentUser();
  
  // Update sidebar (dashboard pages)
  var emailEl = document.querySelector('.sidebar-email');
  if (user && emailEl) {
    emailEl.textContent = user.email;
  }

  // Update navbar (index, courses, signup, login)
  var navLinks = document.getElementById('navLinks');
  if (navLinks) {
    var loginLink = Array.from(navLinks.querySelectorAll('a')).find(a => a.textContent.trim().toLowerCase() === 'login');
    if (user && loginLink) {
      // User is logged in: keep Home & Courses, replace Login with Dashboard
      var dashboardHtml = '<a href="recommendations.html">Dashboard</a>';
      loginLink.outerHTML = dashboardHtml;
    }
  }
}

// ---- Input Focus Effects ----
document.addEventListener('DOMContentLoaded', function () {
  var inputs = document.querySelectorAll('.form-group input');
  inputs.forEach(function (input) {
    input.addEventListener('focus', function () {
      this.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', function () {
      this.parentElement.classList.remove('focused');
      if (this.value.trim() !== '') {
        this.classList.add('filled');
      } else {
        this.classList.remove('filled');
      }
    });
  });

  // Update sidebar email if available
  updateSidebarEmail();

  // Pre-fill update profile if on that page
  if (document.getElementById('updateProfileForm')) {
    prefillUpdateProfile();
  }

  // Pre-fill feedback email if logged in
  var feedbackEmail = document.querySelector('#feedbackForm #email');
  var currentUser = typeof DB !== 'undefined' ? DB.getCurrentUser() : null;
  if (feedbackEmail && currentUser) {
    feedbackEmail.value = currentUser.email;
  }

  // Render dynamic recommendations if on that page
  if (document.getElementById('recGrid')) {
    renderRecommendations();
  }

  // Render all courses page dynamically
  if (document.getElementById('allCoursesGrid')) {
    renderAllCourses();
  }

  // ---- Logout Handler ----
  document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('logout')) {
      if (typeof DB !== 'undefined') {
        DB.logout();
      }
    }
  });
});

// ---- Course Link Gating ----
function requireProfileForCourse(event, url) {
  event.preventDefault();
  
  if (typeof DB === 'undefined') return;

  var user = DB.getCurrentUser();
  if (!user) {
    sessionStorage.setItem('redirectAfterLogin', url);
    window.location.href = 'login.html';
    return;
  }

  var profile = DB.getCurrentProfile();
  if (!profile) {
    sessionStorage.setItem('redirectAfterLogin', url);
    window.location.href = 'create-profile.html';
    return;
  }

  // If user and profile exist, navigate to course in the same tab
  window.location.href = url;
}

// Helper for skill-tag matching
function matchSkillToCourse(skill, course) {
  var courseText = (course.title + ' ' + (course.tags ? course.tags.join(' ') : '') + ' ' + (course.domain || '')).toLowerCase();
  var s = skill.toLowerCase().trim();
  if (!s) return false;
  try {
    // Robust whole-word regex matching
    var regex = new RegExp('\\b' + s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    return regex.test(courseText);
  } catch(e) {
    return courseText.includes(s);
  }
}

// ---- All Courses Page Rendering ----
function renderAllCourses() {
  var grid = document.getElementById('allCoursesGrid');
  if (!grid) return;

  var urlParams = new URLSearchParams(window.location.search);
  var domainFilter = urlParams.get('domain');

  var coursesToShow = [];

  if (domainFilter) {
    // Filter courses matching the domain keyword robustly
    coursesToShow = COURSE_CATALOG.filter(function (course) {
      // Check if course.domain matches domainFilter OR if any tag matches domainFilter
      return matchDomain(course.domain, domainFilter) || (course.tags && course.tags.some(function (tag) {
        return tag.toLowerCase() === domainFilter.toLowerCase();
      }));
    });
  } else {
    // Show all courses
    coursesToShow = COURSE_CATALOG;
  }

  if (coursesToShow.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #6b7280;">No courses found for this domain.</div>';
    return;
  }

  grid.innerHTML = '';
  coursesToShow.forEach(function (course) {
    var card = document.createElement('div');
    card.className = 'course-card reveal visible';
    card.innerHTML =
      '<h3>' + course.title + '</h3>' +
      '<div class="course-rating">Rating: ' + course.rating + '</div>' +
      '<button class="course-btn" onclick="requireProfileForCourse(event, \'' + course.url + '\')">View Course</button>';
    grid.appendChild(card);
  });
}

// ---- Dynamic Course Recommendations ----
function renderRecommendations() {
  var grid = document.getElementById('recGrid');
  var heading = document.getElementById('recHeading');
  if (!grid || !heading) return;

  var profile = typeof DB !== 'undefined' ? DB.getCurrentProfile() : null;

  if (!profile) {
    heading.textContent = 'Recommended Courses';
    grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #6b7280;">Please update your profile to see personalized recommendations.</div>';
    return;
  }

  var skillsKeywords = profile.skills ? profile.skills.toLowerCase().split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
  var userDomain = profile.interest ? profile.interest.trim() : '';

  if (skillsKeywords.length === 0 && !userDomain) {
    heading.textContent = 'Recommended Courses';
    grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #6b7280;">Add skills and select a domain to see personalized recommendations.</div>';
    return;
  }

  // 1. Filter courses by robust domain match
  var domainCourses = COURSE_CATALOG;
  if (userDomain) {
    domainCourses = COURSE_CATALOG.filter(course => matchDomain(course.domain, userDomain));
  }
  
  // If no courses match the selected domain (e.g. legacy data), fallback to all domain-tagged matches
  if (domainCourses.length === 0) domainCourses = COURSE_CATALOG;

  // 2. Filter domainCourses by skills
  var matchedCourses = [];
  if (skillsKeywords.length > 0) {
    matchedCourses = domainCourses.filter(course => {
      return skillsKeywords.some(skill => matchSkillToCourse(skill, course));
    });
  }

  // 3. Fallbacks
  if (matchedCourses.length === 0 && domainCourses.length > 0 && userDomain) {
    // No specific skill match, but we have a domain -> show a few default courses from that domain
    matchedCourses = domainCourses.slice(0, 3);
  } else if (matchedCourses.length === 0) {
    // Ultimate fallback
    matchedCourses = COURSE_CATALOG.slice(0, 6);
  }

  heading.textContent = 'Recommended courses based on your skills';

  // Remove duplicates by title
  var finalCourses = [];
  var addedTitles = new Set();
  matchedCourses.forEach(course => {
    if (!addedTitles.has(course.title)) {
      finalCourses.push(course);
      addedTitles.add(course.title);
    }
  });

  // Render cards
  grid.innerHTML = '';
  finalCourses.forEach(function (course) {
    var card = document.createElement('div');
    card.className = 'course-card reveal visible';
    card.innerHTML =
      '<h3>' + course.title + '</h3>' +
      '<div class="course-rating">Rating: ' + course.rating + '</div>' +
      '<button class="course-btn" onclick="requireProfileForCourse(event, \'' + course.url + '\')">View Course</button>';
    grid.appendChild(card);
  });
}

// ---- Smooth Scroll for Anchor Links ----
document.addEventListener('DOMContentLoaded', function () {
  var anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = this.getAttribute('href');
      if (target === '#') return;
      var el = document.querySelector(target);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

