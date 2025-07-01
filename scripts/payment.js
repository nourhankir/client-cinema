  
    const methodButtons = document.querySelectorAll('.payment-methods button');
    const confirmBtn = document.getElementById('confirmBtn');
    const totalPriceEl = document.getElementById('totalPrice');
    const cardInput = document.getElementById('card');
    const couponInput = document.getElementById('coupon');
    const couponFeedback = document.getElementById('couponFeedback');

    let selectedMethod = null;
    let couponValue = 0;
    let basePrice = 0;

    const seats = JSON.parse(localStorage.getItem('selected_seats') || '[]');
    const showtime = JSON.parse(localStorage.getItem('selected_showtime'));
    basePrice = seats.length * parseFloat(showtime.price);
    totalPriceEl.textContent = basePrice.toFixed(2);

    methodButtons.forEach(btn => {
      btn.onclick = () => {
        methodButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedMethod = btn.dataset.method;
        checkIfReady();
      };
    });

    document.getElementById('applyCouponBtn').onclick = async () => {
      const code = couponInput.value.trim();
      if (!code) return;

      const res = await fetch('http://localhost/cinema-server/controllers/validate_coupon.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const data = await res.json();

      if (data.success) {
        const discount = data.discount_percent;
        const discountValue = basePrice * (discount / 100);
        const newTotal = basePrice - discountValue;

        couponValue = discountValue;
        totalPriceEl.textContent = newTotal.toFixed(2);
        couponFeedback.style.color = 'green';
        couponFeedback.textContent = `Coupon applied: ${discount}% off (-$${discountValue.toFixed(2)})`;
      } else {
        couponValue = 0;
        totalPriceEl.textContent = basePrice.toFixed(2);
        couponFeedback.style.color = 'red';
        couponFeedback.textContent = data.error || 'Invalid or expired coupon';
      }
    };

    cardInput.addEventListener('input', checkIfReady);

    function checkIfReady() {
      if (selectedMethod && cardInput.value.trim().length >= 12) {
        confirmBtn.disabled = false;
        confirmBtn.classList.add('enabled');
      } else {
        confirmBtn.disabled = true;
        confirmBtn.classList.remove('enabled');
      }
    }

    confirmBtn.onclick = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const showtime = JSON.parse(localStorage.getItem('selected_showtime'));
  const seats = JSON.parse(localStorage.getItem('selected_seats'));
  const finalPrice = parseFloat(document.getElementById('totalPrice').textContent);

  fetch('http://localhost/cinema-server/controllers/finalize_payment.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: user.id,
      showtime_id: showtime.showtime_id,
      seat_ids: seats,
      price_paid: finalPrice,
      payment_method: selectedMethod,
      coupon_code: couponInput.value.trim() || null
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        
         document.getElementById('successModal').style.display = 'flex';
        
        
        
      } else {
        alert(' Payment failed: ' + data.error);
      }
    });
};
localStorage.setItem('last_paid_amount', totalPrice.textContent);
  