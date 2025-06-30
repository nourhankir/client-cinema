
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');

    fetch(`http://localhost/cinema-server/controllers/get_movie.php?id=${movieId}`)
      .then(res => res.json())
      .then(movie => {
        document.getElementById('poster').src = movie.poster_url;
        document.getElementById('title').textContent = movie.title;
        document.getElementById('genre').textContent = movie.genre;
        document.getElementById('rating').textContent = movie.rating + '+';
        document.getElementById('description').textContent = movie.description;
        document.getElementById('cast').textContent = movie.cast;
        document.getElementById('bookBtn').href = `choose_time.html?movie_id=${movie.id}`;
        
      });
  