
    const showtime = JSON.parse(localStorage.getItem('selected_showtime') || '{}');
    const seats = JSON.parse(localStorage.getItem('selected_seats') || '[]');
    const amount = localStorage.getItem('last_paid_amount') || '0.00';

    document.getElementById('movieTitle').textContent = showtime.movie_id || 'Unknown';
    document.getElementById('auditorium').textContent = showtime.auditorium || '-';
    document.getElementById('date').textContent = showtime.show_date || '-';
    document.getElementById('time').textContent = showtime.show_time || '-';
    document.getElementById('seats').textContent = seats.join(', ');
    document.getElementById('amount').textContent = parseFloat(amount).toFixed(2);

    const qrPayload = {
      movie: showtime.movie_title,
      auditorium: showtime.auditorium_name,
      date: showtime.date,
      time: showtime.time,
      seats: seats,
      paid: parseFloat(amount).toFixed(2)
    };

    new QRCode(document.getElementById("qrcode"), {
      text: JSON.stringify(qrPayload),
      width: 128,
      height: 128
    });
    function myFunction() {
      localStorage.removeItem('selected_showtime');
      localStorage.removeItem('selected_seats');
      localStorage.removeItem('last_paid_amount');
    }
    
  