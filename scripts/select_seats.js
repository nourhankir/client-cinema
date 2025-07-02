
    const grid = document.getElementById('seatsGrid');
    const selectedEl = document.getElementById('selectedSeats');
    const totalPriceEl = document.getElementById('totalPrice');
    const continueBtn = document.getElementById('continueBtn');

    const showtime = JSON.parse(localStorage.getItem('selected_showtime'));
    const selectedSeats = new Set();
    const seatNames = {};

    fetch(`http://localhost/cinema-server/controllers/get_seats.php?showtime_id=${showtime.showtime_id}`)
      .then(res => res.json())
      .then(data => {
        data.forEach(seat => {
          const div = document.createElement('div');
          div.className = 'seat';
          div.textContent = seat.seat_code;
          seatNames[seat.id] = seat.seat_code;

          if (seat.is_booked) {
            div.classList.add('taken');
          } else {
            div.onclick = () => {
              if (div.classList.contains('selected')) {
                div.classList.remove('selected');
                selectedSeats.delete(seat.id);
              } else {
                if (selectedSeats.size >= 5) {
                  alert("You can select up to 5 seats only.");
                  return;
                }
                div.classList.add('selected');
                selectedSeats.add(seat.id);
              }
              updateSummary();
            };
          }

          grid.appendChild(div);
        });
      
      });

    function updateSummary() {
      const count = selectedSeats.size;
      const total = count * parseFloat(showtime.price);
      /*const names = Array.from(selectedSeats).map(id => seatNames[id]).join(', ') || 'None';*/
      const names = Array.from(selectedSeats).map(id => {
  console.log("Looking up seatNames for id:", id, "->", seatNames[id]);
  return seatNames[id] || '?';
}).join(', ') || 'None';

      

      selectedEl.textContent = `Selected: ${names}`;
      totalPriceEl.textContent = `Total: $${total.toFixed(2)}`;

      if (count > 0) {
        continueBtn.disabled = false;
        continueBtn.classList.add('enabled');
      } else {
        continueBtn.disabled = true;
        continueBtn.classList.remove('enabled');
      }
    }

    continueBtn.onclick = () => {
      if (selectedSeats.size > 0) {
        localStorage.setItem('selected_seats', JSON.stringify(Array.from(selectedSeats)));
        window.location.href = 'payment.html';
      }
    };
  