$(document).ready(() => {
  $('#search-form').on('submit', (e) => {
    let search_text = $('#search-text').val();
    findMovies(search_text);
    e.preventDefault();
  });
});


// from searched text get all the movies by making api call
function findMovies(search_text){
  const url = `https://www.omdbapi.com/?apikey=7ea9b50c&s=${search_text}`;
  axios.get(url)
    .then((response) => {
      console.log(response);
      let movies = response.data.Search;
      console.log(movies);
      let output = '';
      $.each(movies, (index, movie) => {
        output += `
          <div class="row mt-2 mx-xs-auto ms-xl-5">
            <div class = "col-xl-2">
              <img src="${movie.Poster}">
            </div>
            <div class = "col-xl-5 text-left">
            <h5>${movie.Title}</h5>
            </div>
            <div class=" col-xl-2">             
              <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-info" href="#">Movie Details</a>
            </div>
            <div class=" col-xl-2">             
              <a onclick="movieSelectedToFav('${movie.imdbID}')" class="btn btn-warning" href="#">Add to Favourite</a>
            </div>
          </div>
        `;
      });

      $('#movies').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}


// store the moveid in session storage, to collect data in another page
function movieSelected(id){
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}


// collect the data from session storage and show movie details using api call
function findMovie(){
  let movieId = sessionStorage.getItem('movieId');

  axios.get('https://www.omdbapi.com/?apikey=7ea9b50c&i='+movieId)
    .then((response) => {
      console.log(response);
      let movie = response.data;

      let output =`
        <div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2 class = " text-success">${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre :</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Released :</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated :</strong> ${movie.Rated}</li>
              <li class="list-group-item text-warning"><strong>IMDB Rating :</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Director :</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Writer :</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors :</strong> ${movie.Actors}</li>
              <li class="list-group-item"><strong>Plot :</strong> ${movie.Plot}</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            
            <br>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="index.html" class="btn btn-light">Go Back To Search</a>
            <hr>
          </div>
        </div>
      `;

      $('#movie').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}


// add movies to fav list in local storage
function movieSelectedToFav(id){
  let movie_arr = JSON.parse(localStorage.getItem("movieId"));
  if(movie_arr == null){
    movie_arr = [];
  }

  if(!movie_arr.includes(id)){
    movie_arr.push(id);

  } 

  localStorage.setItem('movieId', JSON.stringify(movie_arr));
  // window.location = 'fav.html';
  return false;
}

// collect data from local storage and display all the fav movies 
function getFavMovie(){
  let movie_arr = JSON.parse(localStorage.getItem("movieId"));
  let output ="";

  for(let i = 0 ; i<movie_arr.length ; i++){
    let movieId = movie_arr[i];

    axios.get('https://www.omdbapi.com/?apikey=7ea9b50c&i='+movieId)
    .then((response) => {
      console.log(response);
      let movie = response.data;

       output +=`
        <div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2 class = " text-success">${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre :</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Released :</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated :</strong> ${movie.Rated}</li>
              <li class="list-group-item text-warning"><strong>IMDB Rating :</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Director :</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Writer :</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors :</strong> ${movie.Actors}</li>
              <li class="list-group-item"><strong>Plot :</strong> ${movie.Plot}</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            
            <br>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a onclick="removeFavMovie('${movie.imdbID}')" href="fav.html" class="btn btn-light">Remove from Favourite</a>
            <hr>
          </div>
        </div>
      `;

      $('#fav-movie').html(output);

      
    })
    .catch((err) => {
      console.log(err);
    });
  }  
}

// removes the movie from fav list in local storage
function removeFavMovie(id){
  let movie_arr = JSON.parse(localStorage.getItem("movieId"));
  let index = movie_arr.indexOf(id);
  movie_arr.splice(index,1);  

  localStorage.setItem('movieId', JSON.stringify(movie_arr));
  
  // location.reload();
  return false;
}
