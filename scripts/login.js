
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = document.getElementById('submitBtn');
      const identifier = document.getElementById('identifier').value.trim();
      const password = document.getElementById('password').value;
      const errorsEl = document.getElementById('errors');
      const successEl = document.getElementById('success');

      errorsEl.hidden = true;
      successEl.hidden = true;

      const errors = [];
      if (!identifier) errors.push("Email or phone is required.");
      if (!password) errors.push("Password is required.");

      if (errors.length > 0) {
        errorsEl.innerHTML = errors.map(e => `<li>${e}</li>`).join('');
        errorsEl.hidden = false;
        return;
      }

      submitBtn.disabled = true;

      try {
        const res = await fetch('http://localhost/cinema-server/controllers/login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password })
        });

        const result = await res.json();
        submitBtn.disabled = false;

        if (res.ok && result.success) {
          localStorage.setItem("user", JSON.stringify(result.user));
          successEl.hidden = false;
          setTimeout(() => window.location.href = 'home.html', 1500);
        } else {
          const msgList = result.errors || [result.error] || ["Login failed."];
          errorsEl.innerHTML = msgList.map(e => `<li>${e}</li>`).join('');
          errorsEl.hidden = false;
        }
      } catch (err) {
        submitBtn.disabled = false;
        errorsEl.innerHTML = `<li>Network or server error. Please try again.</li>`;
        errorsEl.hidden = false;
      }
    });

    // Toggle password visibility
    document.getElementById("togglePassword").addEventListener("click", function () {
      const passwordInput = document.getElementById("password");
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      this.textContent = isHidden ? "🙈" : "👁️";
    });
  