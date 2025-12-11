// Utility helpers
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  const form = $('#signupForm');
  const email = $('#email');
  const pwd = $('#password');
  const confirmPwd = $('#confirmPassword');
  const pwdStrength = $('#pwdStrength');
  const pwdText = $('#pwdText');
  const togglePwd = $('#togglePwd');
  const picture = $('#picture');
  const previewWrap = $('#previewWrap');
  const preview = $('#preview');
  const removePic = $('#removePic');
  const formMessage = $('#formMessage');

  // Password show/hide
  togglePwd.addEventListener('click', () => {
    const isPwd = pwd.type === 'password';
    pwd.type = isPwd ? 'text' : 'password';
    togglePwd.textContent = isPwd ? 'Hide' : 'Show';
    togglePwd.setAttribute('aria-pressed', isPwd ? 'true' : 'false');
  });

  // Password strength (very simple scoring)
  const strengthScore = (s) => {
    let score = 0;
    if (s.length >= 8) score++;
    if (/[0-9]/.test(s)) score++;
    if (/[a-z]/.test(s) && /[A-Z]/.test(s)) score++;
    if (/[^A-Za-z0-9]/.test(s)) score++;
    return score;
  };

  pwd.addEventListener('input', () => {
    const val = pwd.value;
    const score = strengthScore(val);
    pwdStrength.value = score;
    const messages = ['Very weak','Weak','OK','Good','Strong'];
    pwdText.textContent = val ? `Strength: ${messages[score]}` : 'Use letters, numbers, and symbols.';
    // Clear inline errors as user types
    $('#passwordError').textContent = '';
  });

  // File preview and size check
  picture.addEventListener('change', () => {
    const file = picture.files && picture.files[0];
    $('#pictureError').textContent = '';
    if (!file) {
      previewWrap.style.display = 'none';
      preview.src = '';
      return;
    }
    if (!file.type.startsWith('image/')) {
      $('#pictureError').textContent = 'Please upload an image file.';
      picture.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      $('#pictureError').textContent = 'Image too large. Max 2MB.';
      picture.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      previewWrap.style.display = 'inline-flex';
    };
    reader.readAsDataURL(file);
  });

  removePic.addEventListener('click', () => {
    picture.value = '';
    preview.src = '';
    previewWrap.style.display = 'none';
  });

  // Simple client-side validation on submit
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    // reset messages
    formMessage.textContent = '';
    $$('#signupForm .error').forEach(el => el.textContent = '');

    let ok = true;

    // Email
    if (!email.checkValidity()) {
      $('#emailError').textContent = 'Please enter a valid email.';
      ok = false;
    }

    // Password rules
    if (pwd.value.length < 8) {
      $('#passwordError').textContent = 'Password must be at least 8 characters.';
      ok = false;
    }
    if (pwd.value !== confirmPwd.value) {
      $('#confirmError').textContent = 'Passwords do not match.';
      ok = false;
    }

    // Gender
    const genderSelected = $$('input[name="gender"]').some(i => i.checked);
    if (!genderSelected) {
      $('#genderError').textContent = 'Please select a gender.';
      ok = false;
    }

    // Country
    if (!$('#country').value) {
      $('#countryError').textContent = 'Please select a country.';
      ok = false;
    }

    if (!ok) {
      formMessage.textContent = 'Please fix the errors above and try again.';
      formMessage.className = 'error';
      return;
    }

    // Build a summary (no passwords shown)
    const data = {
      email: email.value,
      gender: $$('input[name="gender"]').find(i => i.checked).value,
      country: $('#country').value,
      address: $('#address').value || '(none)',
      pictureProvided: !!picture.files.length
    };

    // Simulate send — in production you'd send using fetch() to your backend
    formMessage.textContent = 'Submitted successfully — preview below.';
    formMessage.className = 'success';

    // Show a small summary to the user
    const summary = document.createElement('div');
    summary.style.marginTop = '12px';
    summary.innerHTML = `<strong>Summary:</strong>
      <ul>
        <li>Email: ${escapeHtml(data.email)}</li>
        <li>Gender: ${escapeHtml(data.gender)}</li>
        <li>Country: ${escapeHtml(data.country)}</li>
        <li>Address: ${escapeHtml(data.address)}</li>
        <li>Picture: ${data.pictureProvided ? 'Yes' : 'No'}</li>
      </ul>`;
    // Remove old summary if present
    const existing = document.getElementById('summaryBox');
    if (existing) existing.remove();
    summary.id = 'summaryBox';
    form.appendChild(summary);

    // In a real app: collect form data using FormData and POST to server.
  });

  // small helper for safe text injection
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});
  }

  // reset handlers to hide preview + messages
  form.addEventListener('reset', () => {
    setTimeout(() => {
      previewWrap.style.display = 'none';
      $('#pwdText').textContent = 'Use letters, numbers, and symbols.';
      $('#pwdStrength').value = 0;
      $$('#signupForm .error').forEach(el => el.textContent = '');
      $('#formMessage').textContent = '';
      const summary = document.getElementById('summaryBox');
      if (summary) summary.remove();
    }, 0);
  });
});
