
    let allMovies = [];
    let featured = [];

    fetch('http://localhost/cinema-server/controllers/list_movies.php')
      .then(res => res.json())
      .then(movies => {
        featured = movies.filter(m => m.is_featured == 1);
        allMovies = movies;
        renderFeatured();
        renderMovies(allMovies);
      });

    function renderFeatured() {
      const carousel = document.getElementById('carousel');
      carousel.innerHTML = [...featured, ...featured].map(movie => `
        <img src="${movie.poster_url}" alt="${movie.title}" onclick="window.location.href='movie.html?id=${movie.id}'" />
      `).join('');

      let index = 0;
      setInterval(() => {
        const itemWidth = carousel.children[0].offsetWidth + 16;
        index++;
        carousel.style.transform = `translateX(-${itemWidth * index}px)`;
        if (index >= featured.length) {
          index = 0;
          carousel.style.transition = 'none';
          carousel.style.transform = 'translateX(0px)';
          void carousel.offsetWidth;
          carousel.style.transition = 'transform 0.5s ease-in-out';
        }
      }, 3000);
    }

    function renderMovies(movies) {
      const list = document.getElementById('movieList');
      list.innerHTML = movies.map(movie => `
        <div class="movie-card">
          <img src="${movie.poster_url}" alt="${movie.title}" onclick="window.location.href='movie.html?id=${movie.id}'" />
          <h3>${movie.title}</h3>
          <a class="book-btn" href="choose_time.html?movie_id=${movie.id}">Book Now</a>
        </div>
      `).join('');
    }

    document.getElementById('search').addEventListener('input', function() {
      const value = this.value.toLowerCase();
      const filtered = allMovies.filter(movie => movie.title.toLowerCase().includes(value));
      renderMovies(filtered);
    });
    removeUser = () => {
      localStorage.removeItem("user");
      window.location.href = "../index.html";
    };
  