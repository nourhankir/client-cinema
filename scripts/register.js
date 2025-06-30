  
    function togglePassword(fieldId, btn) {
      const input = document.getElementById(fieldId);
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.textContent = isHidden ? "🙈" : "👁️";
    }

    const form = document.getElementById('registerForm');
    const output = document.getElementById('output');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value || null;
      const phone = document.getElementById('phone').value || null;
      const password = document.getElementById('password').value;
      const confirm = document.getElementById('confirm').value;
      const termsChecked = document.getElementById('terms').checked;

      if (!termsChecked) {
        output.textContent = 'You must agree to the terms to register.';
        return;
      }

      const body = { email, phone, password, confirm };

      try {
        const res = await fetch('http://localhost/cinema-server/controllers/register.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        const result = await res.json();
        output.textContent = 'success';
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1000);
        
      } catch (err) {
        output.textContent = 'Error: ' + err.message;
      }
    });
  