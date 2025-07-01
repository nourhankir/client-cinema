
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get("movie_id");
    const datePicker = document.getElementById('datePicker');
    const container = document.getElementById('auditoriumsContainer');
    const continueBtn = document.getElementById('continueBtn');
    const movieTitleEl = document.getElementById('movieTitle');
    const moviePosterEl = document.getElementById('moviePoster');
    let selectedData = null;

    fetch(`http://localhost/cinema-server/controllers/get_movie.php?id=${movieId}`)
      .then(res => res.json())
      .then(movie => {
        movieTitleEl.textContent = movie.title;
        moviePosterEl.src = movie.poster_url;
         // or any value you want
      });

    fetch(`http://localhost/cinema-server/controllers/showtimes_by_movie.php?movie_id=${movieId}`)
      .then(res => res.json())
      .then(data => {
        const grouped = {};
        data.forEach(s => {
          if (!grouped[s.show_date]) grouped[s.show_date] = [];
          grouped[s.show_date].push(s);
        });

        Object.keys(grouped).forEach((date, idx) => {
          const btn = document.createElement('button');
          btn.textContent = date;
          btn.className = 'date-btn' + (idx === 0 ? ' active' : '');
          btn.onclick = () => {
            document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderAuditoriums(grouped[date], date);
          };
          datePicker.appendChild(btn);
        });

        renderAuditoriums(grouped[Object.keys(grouped)[0]], Object.keys(grouped)[0]);
      });

    function renderAuditoriums(showtimes, selectedDate) {
      container.innerHTML = '';
      selectedData = null;
      continueBtn.disabled = true;
      continueBtn.classList.remove('enabled');

      const byAuditorium = {};
      showtimes.forEach(s => {
        if (!byAuditorium[s.auditorium_id]) {
          byAuditorium[s.auditorium_id] = {
            name: s.auditorium_name,
            price: s.price,
            times: []
          };
        }
        byAuditorium[s.auditorium_id].times.push({
          time: s.show_time,
          showtime_id: s.id
        });
      });

      Object.entries(byAuditorium).forEach(([id, a]) => {
        const div = document.createElement('div');
        div.className = 'auditorium-group';
        div.innerHTML = `
          <div class="auditorium-header">
            <span>${a.name}</span>
            <span>${a.price} $</span>
          </div>
          <div class="showtime-buttons">
            ${a.times.map(t => `
              <button 
                class="showtime-btn"
                data-time="${t.time}"
                data-date="${selectedDate}"
                data-auditorium="${a.name}"
                data-price="${a.price}"
                data-showtime-id="${t.showtime_id}">
                ${t.time.slice(0,5)}
              </button>
            `).join('')}
          </div>
        `;
        container.appendChild(div);

        div.querySelectorAll('.showtime-btn').forEach(btn => {
          btn.onclick = () => {
            document.querySelectorAll('.showtime-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            selectedData = {
              movie_id: movieId,
              showtime_id: btn.dataset.showtimeId,
              show_time: btn.dataset.time,
              show_date: btn.dataset.date,
              auditorium: btn.dataset.auditorium,
              price: btn.dataset.price
            };

            continueBtn.disabled = false;
            continueBtn.classList.add('enabled');
          };
        });
      });
    }

    continueBtn.onclick = () => {
      if (selectedData) {
        localStorage.setItem('selected_showtime', JSON.stringify(selectedData));
        window.location.href = 'select_seats.html';
      }
    };
  