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

  // Render all courses page dynamically
  if (document.getElementById('allCoursesGrid')) {
    renderAllCourses();
  }
});

// ---- Course Link Gating ----
function requireProfileForCourse(event, url) {
  event.preventDefault();
  
  if (typeof DB === 'undefined') return;

  var user = DB.getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  var profile = DB.getCurrentProfile();
  if (!profile) {
    window.location.href = 'create-profile.html';
    return;
  }

  // If user and profile exist, navigate to course in the same tab
  window.location.href = url;
}

// ---- All Courses Page Rendering ----
function renderAllCourses() {
  var grid = document.getElementById('allCoursesGrid');
  if (!grid) return;

  var urlParams = new URLSearchParams(window.location.search);
  var domainFilter = urlParams.get('domain');

  var coursesToShow = [];

  if (domainFilter) {
    // Filter courses matching EXACTLY the domain keyword
    coursesToShow = COURSE_CATALOG.filter(function (course) {
      return course.tags.some(function (tag) {
        return tag.toLowerCase() === domainFilter.toLowerCase();
      });
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
var COURSE_CATALOG = [
  // 1. Programming & Software Development
  { title: 'Programming Basics (C, Python, Java)', rating: '4.7', url: '#', domain: 'Programming & Software Development', tags: ['c', 'python', 'java', 'programming', 'basics', 'beginner'] },
  { title: 'HTML, CSS, JavaScript Fundamentals', rating: '4.8', url: '#', domain: 'Programming & Software Development', tags: ['html', 'css', 'javascript', 'web', 'frontend', 'beginner'] },
  { title: 'Git & GitHub for Beginners', rating: '4.9', url: '#', domain: 'Programming & Software Development', tags: ['git', 'github', 'version control', 'beginner'] },
  { title: 'Object Oriented Programming (OOP) Concepts', rating: '4.6', url: '#', domain: 'Programming & Software Development', tags: ['oop', 'object oriented', 'beginner'] },
  { title: 'Data Structures (Basic)', rating: '4.7', url: '#', domain: 'Programming & Software Development', tags: ['data structures', 'dsa', 'beginner'] },
  { title: 'Advanced Java / Python', rating: '4.8', url: '#', domain: 'Programming & Software Development', tags: ['java', 'python', 'advanced', 'intermediate'] },
  { title: 'Frontend: React, Angular, Vue', rating: '4.7', url: '#', domain: 'Programming & Software Development', tags: ['frontend', 'react', 'angular', 'vue', 'web', 'intermediate'] },
  { title: 'Backend: Node.js, Spring Boot, Django', rating: '4.8', url: '#', domain: 'Programming & Software Development', tags: ['backend', 'node.js', 'spring boot', 'django', 'web', 'intermediate'] },
  { title: 'REST API Development', rating: '4.6', url: '#', domain: 'Programming & Software Development', tags: ['rest api', 'api', 'backend', 'intermediate'] },
  { title: 'SQL & NoSQL Databases (MySQL, MongoDB)', rating: '4.7', url: '#', domain: 'Programming & Software Development', tags: ['sql', 'nosql', 'mysql', 'mongodb', 'database', 'intermediate'] },
  { title: 'Mobile Dev: Flutter, React Native', rating: '4.8', url: '#', domain: 'Programming & Software Development', tags: ['mobile', 'flutter', 'react native', 'app dev', 'intermediate'] },
  { title: 'DevOps Basics (CI/CD, Docker)', rating: '4.7', url: '#', domain: 'Programming & Software Development', tags: ['devops', 'ci/cd', 'docker', 'intermediate'] },
  { title: 'System Design', rating: '4.9', url: '#', domain: 'Programming & Software Development', tags: ['system design', 'architecture', 'advanced'] },
  { title: 'Microservices Architecture', rating: '4.8', url: '#', domain: 'Programming & Software Development', tags: ['microservices', 'architecture', 'advanced'] },
  { title: 'Cloud Computing (AWS, Azure, GCP)', rating: '4.8', url: '#', domain: 'Programming & Software Development', tags: ['cloud', 'aws', 'azure', 'gcp', 'advanced'] },
  { title: 'Kubernetes & Container Orchestration', rating: '4.9', url: '#', domain: 'Programming & Software Development', tags: ['kubernetes', 'containers', 'docker', 'orchestration', 'advanced'] },
  { title: 'Cybersecurity & Ethical Hacking', rating: '4.8', url: '#', domain: 'Programming & Software Development', tags: ['cybersecurity', 'security', 'hacking', 'advanced'] },
  { title: 'Network Engineering', rating: '4.7', url: '#', domain: 'Programming & Software Development', tags: ['network engineering', 'networking', 'advanced'] },
  { title: 'AI/ML (TensorFlow, NLP, Deep Learning)', rating: '4.9', url: '#', domain: 'Programming & Software Development', tags: ['ai', 'ml', 'machine learning', 'tensorflow', 'nlp', 'deep learning', 'advanced'] },
  { title: 'Blockchain Development', rating: '4.6', url: '#', domain: 'Programming & Software Development', tags: ['blockchain', 'crypto', 'web3', 'advanced'] },
  { title: 'Performance Optimization', rating: '4.7', url: '#', domain: 'Programming & Software Development', tags: ['performance', 'optimization', 'advanced'] },

  // 2. Law & Legal Studies
  { title: 'Introduction to Law', rating: '4.7', url: '#', domain: 'Law & Legal Studies', tags: ['law', 'introduction', 'beginner'] },
  { title: 'Legal Terminology', rating: '4.6', url: '#', domain: 'Law & Legal Studies', tags: ['legal', 'terminology', 'beginner'] },
  { title: 'Constitution Basics', rating: '4.8', url: '#', domain: 'Law & Legal Studies', tags: ['constitution', 'basics', 'beginner'] },
  { title: 'Legal Research', rating: '4.7', url: '#', domain: 'Law & Legal Studies', tags: ['legal research', 'research', 'beginner'] },
  { title: 'Corporate Law', rating: '4.8', url: '#', domain: 'Law & Legal Studies', tags: ['corporate law', 'corporate', 'intermediate'] },
  { title: 'Criminal Law', rating: '4.9', url: '#', domain: 'Law & Legal Studies', tags: ['criminal law', 'criminal', 'intermediate'] },
  { title: 'Civil Law', rating: '4.7', url: '#', domain: 'Law & Legal Studies', tags: ['civil law', 'civil', 'intermediate'] },
  { title: 'Intellectual Property Rights', rating: '4.8', url: '#', domain: 'Law & Legal Studies', tags: ['ipr', 'intellectual property', 'intermediate'] },
  { title: 'Cyber Law', rating: '4.9', url: '#', domain: 'Law & Legal Studies', tags: ['cyber law', 'cybersecurity', 'intermediate'] },
  { title: 'International Law', rating: '4.8', url: '#', domain: 'Law & Legal Studies', tags: ['international law', 'global', 'advanced'] },
  { title: 'Taxation Law', rating: '4.7', url: '#', domain: 'Law & Legal Studies', tags: ['taxation', 'tax law', 'advanced'] },
  { title: 'Litigation Practice', rating: '4.8', url: '#', domain: 'Law & Legal Studies', tags: ['litigation', 'practice', 'advanced'] },
  { title: 'Legal Drafting & Documentation', rating: '4.9', url: '#', domain: 'Law & Legal Studies', tags: ['drafting', 'documentation', 'advanced'] },
  { title: 'Arbitration & Mediation', rating: '4.7', url: '#', domain: 'Law & Legal Studies', tags: ['arbitration', 'mediation', 'advanced'] },
  { title: 'Compliance & Risk Management', rating: '4.8', url: '#', domain: 'Law & Legal Studies', tags: ['compliance', 'risk management', 'advanced'] },

  // 3. Sports & Fitness
  { title: 'Fitness Fundamentals', rating: '4.7', url: '#', domain: 'Sports & Fitness', tags: ['fitness', 'fundamentals', 'beginner'] },
  { title: 'Yoga Basics', rating: '4.8', url: '#', domain: 'Sports & Fitness', tags: ['yoga', 'basics', 'beginner'] },
  { title: 'Nutrition Basics', rating: '4.7', url: '#', domain: 'Sports & Fitness', tags: ['nutrition', 'diet', 'basics', 'beginner'] },
  { title: 'Basic Coaching Skills', rating: '4.6', url: '#', domain: 'Sports & Fitness', tags: ['coaching', 'skills', 'beginner'] },
  { title: 'Strength Training', rating: '4.8', url: '#', domain: 'Sports & Fitness', tags: ['strength training', 'workout', 'intermediate'] },
  { title: 'Sports Psychology', rating: '4.9', url: '#', domain: 'Sports & Fitness', tags: ['sports psychology', 'psychology', 'intermediate'] },
  { title: 'Personal Training Certification', rating: '4.8', url: '#', domain: 'Sports & Fitness', tags: ['personal training', 'certification', 'intermediate'] },
  { title: 'Injury Prevention', rating: '4.7', url: '#', domain: 'Sports & Fitness', tags: ['injury prevention', 'health', 'intermediate'] },
  { title: 'Diet Planning', rating: '4.8', url: '#', domain: 'Sports & Fitness', tags: ['diet planning', 'nutrition', 'intermediate'] },
  { title: 'Sports Management', rating: '4.9', url: '#', domain: 'Sports & Fitness', tags: ['sports management', 'management', 'advanced'] },
  { title: 'Exercise Physiology', rating: '4.8', url: '#', domain: 'Sports & Fitness', tags: ['exercise physiology', 'science', 'advanced'] },
  { title: 'Advanced Coaching Techniques', rating: '4.9', url: '#', domain: 'Sports & Fitness', tags: ['coaching', 'advanced'] },
  { title: 'Rehabilitation Science', rating: '4.7', url: '#', domain: 'Sports & Fitness', tags: ['rehabilitation', 'science', 'advanced'] },
  { title: 'Performance Analytics in Sports', rating: '4.8', url: '#', domain: 'Sports & Fitness', tags: ['performance analytics', 'data', 'advanced'] },

  // 4. Arts & Design
  { title: 'Drawing & Sketching', rating: '4.7', url: '#', domain: 'Arts & Design', tags: ['drawing', 'sketching', 'art', 'beginner'] },
  { title: 'Color Theory', rating: '4.8', url: '#', domain: 'Arts & Design', tags: ['color theory', 'design', 'beginner'] },
  { title: 'Design Basics', rating: '4.6', url: '#', domain: 'Arts & Design', tags: ['design basics', 'basics', 'beginner'] },
  { title: 'Photoshop Basics', rating: '4.9', url: '#', domain: 'Arts & Design', tags: ['photoshop', 'basics', 'beginner'] },
  { title: 'Graphic Design (Illustrator, Canva)', rating: '4.8', url: '#', domain: 'Arts & Design', tags: ['graphic design', 'illustrator', 'canva', 'intermediate'] },
  { title: 'UI/UX Design', rating: '4.9', url: '#', domain: 'Arts & Design', tags: ['ui', 'ux', 'user interface', 'user experience', 'design', 'intermediate'] },
  { title: 'Animation Basics', rating: '4.7', url: '#', domain: 'Arts & Design', tags: ['animation', 'basics', 'intermediate'] },
  { title: 'Video Editing', rating: '4.8', url: '#', domain: 'Arts & Design', tags: ['video editing', 'video', 'intermediate'] },
  { title: 'Typography', rating: '4.7', url: '#', domain: 'Arts & Design', tags: ['typography', 'fonts', 'intermediate'] },
  { title: 'Product Design', rating: '4.9', url: '#', domain: 'Arts & Design', tags: ['product design', 'advanced'] },
  { title: 'Motion Graphics', rating: '4.8', url: '#', domain: 'Arts & Design', tags: ['motion graphics', 'animation', 'advanced'] },
  { title: '3D Design (Blender)', rating: '4.9', url: '#', domain: 'Arts & Design', tags: ['3d design', 'blender', '3d modeling', 'advanced'] },
  { title: 'Branding & Identity Design', rating: '4.8', url: '#', domain: 'Arts & Design', tags: ['branding', 'identity', 'design', 'advanced'] },
  { title: 'Advanced UX Research', rating: '4.9', url: '#', domain: 'Arts & Design', tags: ['ux research', 'research', 'advanced'] },
  { title: 'Game Design', rating: '4.8', url: '#', domain: 'Arts & Design', tags: ['game design', 'gaming', 'advanced'] },

  // 5. Data Analytics
  { title: 'Excel Basics', rating: '4.7', url: '#', domain: 'Data Analytics', tags: ['excel', 'spreadsheet', 'beginner'] },
  { title: 'Data Visualization Basics', rating: '4.8', url: '#', domain: 'Data Analytics', tags: ['data visualization', 'basics', 'beginner'] },
  { title: 'Statistics Fundamentals', rating: '4.6', url: '#', domain: 'Data Analytics', tags: ['statistics', 'math', 'beginner'] },
  { title: 'SQL for Data Analysis', rating: '4.9', url: '#', domain: 'Data Analytics', tags: ['sql', 'data analysis', 'intermediate'] },
  { title: 'Python (Pandas, NumPy)', rating: '4.8', url: '#', domain: 'Data Analytics', tags: ['python', 'pandas', 'numpy', 'data analysis', 'intermediate'] },
  { title: 'Power BI / Tableau', rating: '4.9', url: '#', domain: 'Data Analytics', tags: ['power bi', 'tableau', 'visualization', 'intermediate'] },
  { title: 'Data Cleaning & Wrangling', rating: '4.7', url: '#', domain: 'Data Analytics', tags: ['data cleaning', 'wrangling', 'intermediate'] },
  { title: 'Machine Learning', rating: '4.9', url: '#', domain: 'Data Analytics', tags: ['machine learning', 'ml', 'ai', 'advanced'] },
  { title: 'Big Data (Hadoop, Spark)', rating: '4.8', url: '#', domain: 'Data Analytics', tags: ['big data', 'hadoop', 'spark', 'advanced'] },
  { title: 'Predictive Analytics', rating: '4.7', url: '#', domain: 'Data Analytics', tags: ['predictive analytics', 'prediction', 'advanced'] },
  { title: 'Data Engineering', rating: '4.9', url: '#', domain: 'Data Analytics', tags: ['data engineering', 'engineering', 'advanced'] },
  { title: 'AI for Data Analysis', rating: '4.8', url: '#', domain: 'Data Analytics', tags: ['ai', 'data analysis', 'advanced'] },
  { title: 'Time Series Analysis', rating: '4.7', url: '#', domain: 'Data Analytics', tags: ['time series', 'analysis', 'advanced'] },

  // 6. Healthcare
  { title: 'Human Anatomy', rating: '4.8', url: '#', domain: 'Healthcare', tags: ['human anatomy', 'anatomy', 'biology', 'beginner'] },
  { title: 'Basic First Aid', rating: '4.9', url: '#', domain: 'Healthcare', tags: ['first aid', 'emergency', 'beginner'] },
  { title: 'Nursing Basics', rating: '4.7', url: '#', domain: 'Healthcare', tags: ['nursing', 'basics', 'beginner'] },
  { title: 'Public Health Intro', rating: '4.6', url: '#', domain: 'Healthcare', tags: ['public health', 'intro', 'beginner'] },
  { title: 'Clinical Practices', rating: '4.8', url: '#', domain: 'Healthcare', tags: ['clinical practices', 'clinical', 'intermediate'] },
  { title: 'Pharmacology', rating: '4.7', url: '#', domain: 'Healthcare', tags: ['pharmacology', 'drugs', 'intermediate'] },
  { title: 'Medical Coding & Billing', rating: '4.8', url: '#', domain: 'Healthcare', tags: ['medical coding', 'billing', 'intermediate'] },
  { title: 'Nutrition & Dietetics', rating: '4.9', url: '#', domain: 'Healthcare', tags: ['nutrition', 'dietetics', 'intermediate'] },
  { title: 'Surgery Basics', rating: '4.8', url: '#', domain: 'Healthcare', tags: ['surgery', 'basics', 'advanced'] },
  { title: 'Healthcare Management', rating: '4.9', url: '#', domain: 'Healthcare', tags: ['healthcare management', 'management', 'advanced'] },
  { title: 'Epidemiology', rating: '4.7', url: '#', domain: 'Healthcare', tags: ['epidemiology', 'disease', 'advanced'] },
  { title: 'Medical Research', rating: '4.8', url: '#', domain: 'Healthcare', tags: ['medical research', 'research', 'advanced'] },
  { title: 'Hospital Administration', rating: '4.9', url: '#', domain: 'Healthcare', tags: ['hospital administration', 'administration', 'advanced'] },
  { title: 'Telemedicine Systems', rating: '4.8', url: '#', domain: 'Healthcare', tags: ['telemedicine', 'systems', 'advanced'] },

  // 7. Business & Management
  { title: 'Business Fundamentals', rating: '4.7', url: '#', domain: 'Business & Management', tags: ['business', 'fundamentals', 'beginner'] },
  { title: 'Communication Skills', rating: '4.8', url: '#', domain: 'Business & Management', tags: ['communication', 'skills', 'beginner'] },
  { title: 'Basics of Marketing', rating: '4.7', url: '#', domain: 'Business & Management', tags: ['marketing', 'basics', 'beginner'] },
  { title: 'Introduction to Finance', rating: '4.6', url: '#', domain: 'Business & Management', tags: ['finance', 'introduction', 'beginner'] },
  { title: 'Digital Marketing (SEO, SEM)', rating: '4.9', url: '#', domain: 'Business & Management', tags: ['digital marketing', 'seo', 'sem', 'intermediate'] },
  { title: 'Financial Analysis', rating: '4.8', url: '#', domain: 'Business & Management', tags: ['financial analysis', 'finance', 'intermediate'] },
  { title: 'HR Management', rating: '4.7', url: '#', domain: 'Business & Management', tags: ['hr', 'human resources', 'management', 'intermediate'] },
  { title: 'Operations Management', rating: '4.8', url: '#', domain: 'Business & Management', tags: ['operations management', 'operations', 'intermediate'] },
  { title: 'Entrepreneurship', rating: '4.9', url: '#', domain: 'Business & Management', tags: ['entrepreneurship', 'startup', 'intermediate'] },
  { title: 'Strategic Management', rating: '4.8', url: '#', domain: 'Business & Management', tags: ['strategic management', 'strategy', 'advanced'] },
  { title: 'Investment Banking', rating: '4.9', url: '#', domain: 'Business & Management', tags: ['investment banking', 'finance', 'advanced'] },
  { title: 'Business Analytics', rating: '4.8', url: '#', domain: 'Business & Management', tags: ['business analytics', 'analytics', 'advanced'] },
  { title: 'Leadership & Organizational Behavior', rating: '4.9', url: '#', domain: 'Business & Management', tags: ['leadership', 'organizational behavior', 'advanced'] },
  { title: 'International Business', rating: '4.7', url: '#', domain: 'Business & Management', tags: ['international business', 'global', 'advanced'] },
  { title: 'Product Management', rating: '4.8', url: '#', domain: 'Business & Management', tags: ['product management', 'product', 'advanced'] },

  // 8. Science & Research
  { title: 'Basic Physics, Chemistry, Biology', rating: '4.7', url: '#', domain: 'Science & Research', tags: ['physics', 'chemistry', 'biology', 'science', 'beginner'] },
  { title: 'Scientific Methods', rating: '4.8', url: '#', domain: 'Science & Research', tags: ['scientific methods', 'science', 'beginner'] },
  { title: 'Lab Techniques', rating: '4.6', url: '#', domain: 'Science & Research', tags: ['lab techniques', 'laboratory', 'beginner'] },
  { title: 'Organic Chemistry', rating: '4.7', url: '#', domain: 'Science & Research', tags: ['organic chemistry', 'chemistry', 'intermediate'] },
  { title: 'Genetics', rating: '4.8', url: '#', domain: 'Science & Research', tags: ['genetics', 'biology', 'intermediate'] },
  { title: 'Thermodynamics', rating: '4.9', url: '#', domain: 'Science & Research', tags: ['thermodynamics', 'physics', 'intermediate'] },
  { title: 'Environmental Science', rating: '4.8', url: '#', domain: 'Science & Research', tags: ['environmental science', 'environment', 'intermediate'] },
  { title: 'Quantum Physics', rating: '4.9', url: '#', domain: 'Science & Research', tags: ['quantum physics', 'physics', 'advanced'] },
  { title: 'Biotechnology', rating: '4.8', url: '#', domain: 'Science & Research', tags: ['biotechnology', 'biology', 'tech', 'advanced'] },
  { title: 'Molecular Biology', rating: '4.9', url: '#', domain: 'Science & Research', tags: ['molecular biology', 'biology', 'advanced'] },
  { title: 'Astrophysics', rating: '4.8', url: '#', domain: 'Science & Research', tags: ['astrophysics', 'physics', 'space', 'advanced'] },
  { title: 'Research Methodology', rating: '4.7', url: '#', domain: 'Science & Research', tags: ['research methodology', 'research', 'advanced'] },
  { title: 'Scientific Publishing', rating: '4.8', url: '#', domain: 'Science & Research', tags: ['scientific publishing', 'publishing', 'research', 'advanced'] }
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

  var skillsKeywords = profile.skills ? profile.skills.toLowerCase().split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
  var domain = profile.interest ? profile.interest.trim() : '';

  if (skillsKeywords.length === 0 && !domain) {
    heading.textContent = 'Recommended Courses';
    grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #6b7280;">Add skills and select a domain to see personalized recommendations.</div>';
    return;
  }

  // 1. Filter courses by exact domain
  var domainCourses = COURSE_CATALOG;
  if (domain) {
    domainCourses = COURSE_CATALOG.filter(course => course.domain === domain);
  }
  // If no courses match the selected domain (e.g. legacy data), use all
  if (domainCourses.length === 0) domainCourses = COURSE_CATALOG;

  // 2. Filter domainCourses by skills
  var matchedCourses = [];
  var addedUrls = new Set();
  
  if (skillsKeywords.length > 0) {
    matchedCourses = domainCourses.filter(course => {
      var courseText = (course.title + ' ' + course.tags.join(' ')).toLowerCase();
      return skillsKeywords.some(skill => {
        try {
          // match whole word to avoid false positives (e.g. java vs javascript)
          var regex = new RegExp('\\b' + skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
          return regex.test(courseText);
        } catch(e) {
          // fallback if regex fails
          return courseText.includes(skill);
        }
      });
    });
  }

  // 3. Fallbacks
  if (matchedCourses.length === 0 && domainCourses.length > 0) {
    // No specific skill match, but we have a domain -> show a few default courses from that domain
    matchedCourses = domainCourses.slice(0, 3);
    heading.textContent = 'Recommended courses based on your skills';
  } else if (matchedCourses.length === 0) {
    // Ultimate fallback
    matchedCourses = COURSE_CATALOG.slice(0, 6);
    heading.textContent = 'General Course Recommendations';
  } else {
    // We found specific matches
    heading.textContent = 'Recommended courses based on your skills';
  }

  // Remove duplicates
  var finalCourses = [];
  matchedCourses.forEach(course => {
    if (!addedUrls.has(course.title)) {
      finalCourses.push(course);
      addedUrls.add(course.title);
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

