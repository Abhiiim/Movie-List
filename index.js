let currentPage = 1;

// Next button click event
document.getElementById("nextBtn").addEventListener("click", function() {
    currentPage++;
    searchMovies();
});

// Previous button click event
document.getElementById("prevBtn").addEventListener("click", function() {
    if (currentPage > 1) {
        currentPage--;
        searchMovies();
    }
});

function renderMovies (movies) {
    // Function to display items for a given page
    function displayMovies() {

        let list = document.getElementById("movies-list");
        list.innerHTML = "";

        movies.forEach(function(movie) {
            let div1 = document.createElement("div");
            div1.classList.add("movies-list");

            let div2 = document.createElement("div");
            div2.classList.add("div-2");
            let img = document.createElement("img");
            img.src = movie.Poster;
            img.classList.add("movies-img")
            div2.appendChild(img);
            let movieTitle = document.createElement("h3")
            movieTitle.innerText = movie.Title;
            div2.appendChild(movieTitle);
            div1.appendChild(div2);

            let div3 = document.createElement("div");
            div3.classList.add("div-3");
            let moreDetails = document.createElement("button");
            moreDetails.innerText = "More Details";
            moreDetails.addEventListener("click", function () {
                seeDetails(this, movie);
            });
            div3.appendChild(moreDetails);

            let comments = document.createElement("button");
            comments.innerText = "Comments";
            comments.addEventListener("click", function() {
                addComments (this, movie);
            });
            comments.classList.add("add-comments")
            div3.appendChild(comments);

            let div4 = document.createElement("div");
            let ratings = document.createElement("input");
            ratings.id = movie.imdbID;
            ratings.placeholder = "Rate between 1-5";
            div4.appendChild(ratings);

            let rateBtn = document.createElement("button");
            rateBtn.innerText = "Rate";
            rateBtn.addEventListener("click", function () {
                rateMovie(this, movie);
            });
            div4.appendChild(rateBtn);

            div3.appendChild(div4);
            div1.appendChild(div3);

            let div5 = document.createElement("div");
            div5.classList.add("details");
            let div6 = document.createElement("div");
            div6.classList.add("comments");

            div1.appendChild(div5);
            div1.appendChild(div6);
            list.appendChild(div1);
        });
    }

    let pagination = document.getElementById("pagination");
    pagination.style.display = "block";

    let pageNumber = document.getElementById("pageNumber");
    pageNumber.innerHTML = "Page " + currentPage;

    displayMovies();

}

function searchMovies () {
    let moviesTitle = document.getElementById("search-input").value;
    // let movies = JSON.parse(localStorage.getItem("activity")) || [];
    // localStorage.setItem("activity", JSON.stringify(activity));

    // for (let i=1; i<5; i++) {
        let link = "https://www.omdbapi.com/?apikey=f689c2ab&s=" + moviesTitle  + "&page=" + currentPage;
        fetch(link)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                renderMovies(data.Search);
            })
            .catch ((error) => {
                console.log("Error: ", error.message)
            })
    // }
}


function seeDetails (details, movie) {
    let div1 = details.parentNode.parentNode;
    let div5 = div1.querySelector(".details");

    if (div5.innerHTML == "") {
        let movieTitle = document.createElement("p");
        movieTitle.innerText = "Title: " + movie.Title;
        let movieType = document.createElement("p");
        movieType.innerText = "Type: " + movie.Type;
        let releaseYear = document.createElement("p");
        releaseYear.innerText = "Year: " + movie.Year;
        let imdbId = document.createElement("p");
        imdbId.innerText = "imdbID: " + movie.imdbID;

        div5.appendChild(movieTitle);
        div5.appendChild(movieType);
        div5.appendChild(releaseYear);
        div5.appendChild(imdbId);
    } else {
        div5.innerHTML = "";
    }
}

function addComments (evt, movie) {
    let div1 = evt.parentNode.parentNode;
    let div6 = div1.querySelector(".comments");
    let comments = JSON.parse(localStorage.getItem("comments")) || [];

    if (div6.innerHTML == "") {

        let prevComments = document.createElement("div");
        comments.forEach(function (comment) {
            if (comment.imdbID == movie.imdbID) {
                comment.commenList.forEach (function (x) {
                    let cmt = document.createElement("div");
                    cmt.innerText = x;
                    prevComments.appendChild(cmt);
                })
            }
        });

        let newComment = document.createElement("div");
        let commentInput = document.createElement("input");
        commentInput.placeholder = "Add New Comment";
        newComment.appendChild(commentInput);

        let commentBtn = document.createElement("button");
        commentBtn.innerText = "Add Comment";
        commentBtn.addEventListener("click", function() {
            addNewComment(this, movie);
        });
        newComment.appendChild(commentBtn);
        
        div6.appendChild(prevComments);
        div6.appendChild(newComment);
    } else {
        div6.innerHTML = "";
    }
}

function addNewComment (evt, movie) {

    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    let div7 = evt.parentNode;
    let comment = div7.querySelector("input").value;

    if (comments.length == 0) {
        comments.push({
            imdbID: movie.imdbID,
            commenList: [comment]
        });
    } else {
        let found = 0;
        for (let i=0; i<comments.length; i++) {
            if (comments.imdbID == movie.imdbID) {
                comments.commenList.push(comment);
                found = 1;
                break;
            }
        }
        if (found == 0) {
            comments.push({
                imdbID: movie.imdbID,
                commenList: [comment]
            });
        }
    }
    localStorage.setItem("comments", JSON.stringify(comments));

    let prtBtn = evt.parentNode.parentNode.parentNode.querySelector(".add-comments");
    addComments(prtBtn, movie);
    addComments(prtBtn, movie);
}

function rateMovie (evt, movie) {
    let rateVal = evt.parentNode.querySelector("input").value;
    let moviesRating = JSON.parse(localStorage.getItem("ratings")) || [];

    if (rateVal < 1 || rateVal > 5) {
        evt.parentNode.querySelector("input").value = "";
        alert("Rating should be in between 1 to 5 only");
    } else {
        if (moviesRating.length == 0) {
            moviesRating.push({
                imdbID: movie.imdbID,
                ratings: [rateVal]
            });
        } else {
            let found = 0;
            for (let i=0; i<moviesRating.length; i++) {
                if (moviesRating.imdbID == movie.imdbID) {
                    moviesRating.ratings.push(rateVal);
                    found = 1;
                    break;
                }
            }
            if (found == 0) {
                moviesRating.push({
                    imdbID: movie.imdbID,
                    ratings: [rateVal]
                });
            }
        }
        // console.log(moviesRating);
        localStorage.setItem("ratings", JSON.stringify(moviesRating));
        evt.parentNode.querySelector("input").value = "";
        alert("Your rating is saved. Thanks for provide rating!")
    }

}
