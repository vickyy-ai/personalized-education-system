/* =============================================
   PERSONALIZED EDUCATION RECOMMENDATION SYSTEM
   Main JavaScript (DB-Connected)
   ============================================= */

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
      window.location.href = 'create-profile.html';
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

// ---- Update sidebar email from session ----
function updateSidebarEmail() {
  var user = DB.getCurrentUser();
  var emailEl = document.querySelector('.sidebar-email');
  if (user && emailEl) {
    emailEl.textContent = user.email;
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
});

// ---- Dynamic Course Recommendations ----
var COURSE_CATALOG = [
  // UI/UX & Design
  { title: 'UX Design Fundamentals', rating: '4.7', url: 'https://www.coursera.org/learn/ux-design-fundamentals', tags: ['ui', 'ux', 'design', 'designing'] },
  { title: 'Web Design: Strategy and Information Architecture', rating: '4.8', url: 'https://www.coursera.org/learn/web-design-strategy', tags: ['ui', 'ux', 'design', 'web'] },
  { title: 'Introduction to User Experience Principles and Processes', rating: '4.7', url: 'https://www.coursera.org/learn/user-experience-principles', tags: ['ui', 'ux', 'design'] },
  { title: 'Visual Elements of User Interface Design', rating: '4.5', url: 'https://www.coursera.org/learn/visual-elements-user-interface-design', tags: ['ui', 'design', 'designing'] },
  { title: 'UI Design Capstone', rating: '4.4', url: 'https://www.coursera.org/learn/ui-design-capstone', tags: ['ui', 'design'] },
  { title: 'Best Practices for iOS User Interface Design', rating: '4.5', url: 'https://www.coursera.org/learn/ios-ui-design', tags: ['ui', 'ios', 'mobile'] },

  // Programming & Web Development
  { title: 'Web Application Development: Basic Concepts', rating: '4.5', url: 'https://www.coursera.org/learn/web-app', tags: ['web', 'programming', 'html', 'css', 'javascript'] },
  { title: 'Programming Foundations with JavaScript, HTML and CSS', rating: '4.5', url: 'https://www.coursera.org/learn/duke-programming-web', tags: ['programming', 'html', 'css', 'javascript', 'web'] },
  { title: 'Java Programming: Solving Problems with Software', rating: '4.6', url: 'https://www.coursera.org/learn/java-programming', tags: ['java', 'programming', 'software'] },
  { title: 'Python for Everybody', rating: '4.8', url: 'https://www.coursera.org/specializations/python', tags: ['python', 'programming'] },
  { title: 'Crash Course on Python', rating: '4.8', url: 'https://www.coursera.org/learn/crash-course-on-python', tags: ['python', 'programming'] },

  // AI & Data Science
  { title: 'AI For Everyone', rating: '4.8', url: 'https://www.coursera.org/learn/ai-for-everyone', tags: ['ai', 'artificial intelligence'] },
  { title: 'Deep Learning Inference with Azure ML Studio', rating: '4.7', url: 'https://www.coursera.org/projects/deep-learning-inference-azure-ml-studio', tags: ['ai', 'deep learning', 'machine learning'] },
  { title: 'Deep Learning for Business', rating: '4.3', url: 'https://www.coursera.org/learn/deep-learning-business', tags: ['ai', 'deep learning', 'business'] },
  { title: 'Introduction to Data Analytics', rating: '4.7', url: 'https://www.coursera.org/learn/introduction-to-data-analytics', tags: ['datascience', 'data', 'analytics', 'data analytics'] },
  { title: 'Framework for Data Collection and Analysis', rating: '4.1', url: 'https://www.coursera.org/learn/data-collection-framework', tags: ['datascience', 'data', 'analytics'] },
  { title: 'What is Data Science?', rating: '4.7', url: 'https://www.coursera.org/learn/what-is-datascience', tags: ['datascience', 'data science', 'data'] }
];

function renderRecommendations() {
  var grid = document.getElementById('recGrid');
  var heading = document.getElementById('recHeading');
  var profile = typeof DB !== 'undefined' ? DB.getCurrentProfile() : null;

  if (!profile) {
    heading.textContent = 'Recommended Courses';
    grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #6b7280;">Please update your profile to see personalized recommendations.</div>';
    return;
  }

  // Extract keywords from skills and interests
  var keywords = [];
  if (profile.skills) {
    keywords = keywords.concat(profile.skills.toLowerCase().split(',').map(function (s) { return s.trim(); }));
  }
  if (profile.interest) {
    keywords = keywords.concat(profile.interest.toLowerCase().split(',').map(function (s) { return s.trim(); }));
  }

  // Filter out empty strings
  keywords = keywords.filter(function (k) { return k.length > 0; });

  if (keywords.length === 0) {
    heading.textContent = 'Recommended Courses';
    grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #6b7280;">Add skills and interests to your profile to see personalized recommendations.</div>';
    return;
  }

  // Match courses
  var matchedCourses = [];
  var addedUrls = new Set(); // Prevent duplicates

  COURSE_CATALOG.forEach(function (course) {
    var isMatch = false;
    course.tags.forEach(function (tag) {
      keywords.forEach(function (keyword) {
        if (tag.includes(keyword) || keyword.includes(tag)) {
          isMatch = true;
        }
      });
    });

    if (isMatch && !addedUrls.has(course.url)) {
      matchedCourses.push(course);
      addedUrls.add(course.url);
    }
  });

  // If no matches, show fallback default assortment
  if (matchedCourses.length === 0) {
    heading.textContent = 'General Course Recommendations';
    matchedCourses = COURSE_CATALOG.slice(0, 6); // Just show top 6
  } else {
    heading.textContent = 'Recommended courses for: "' + keywords.join(', ') + '"';
  }

  // Render cards
  grid.innerHTML = '';
  matchedCourses.forEach(function (course) {
    var card = document.createElement('div');
    card.className = 'course-card reveal visible';
    card.innerHTML =
      '<h3>' + course.title + '</h3>' +
      '<div class="course-rating">Rating: ' + course.rating + '</div>' +
      '<a href="' + course.url + '" target="_blank" class="course-btn">View Course</a>';
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

