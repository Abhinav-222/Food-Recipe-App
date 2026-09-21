const API_URL =
    "https://www.themealdb.com/api/json/v1/1";

let selectedCuisine =
    localStorage.getItem("selectedCuisine");

let categoryRecipes = [];

let currentPage = 1;

const recipesPerPage = 30;


const areaNames = {

    Indian: "India",
    Italian: "Italian",
    Chinese: "Chinese",
    Japanese: "Japanese",
    Mexican: "Mexican",
    American: "American",
    French: "French",
    Thai: "Thai"

};


async function loadCategoryRecipes() {

    if (!selectedCuisine) {

        window.location.href =
            "categories.html";

        return;

    }


    document.getElementById(
        "categoryTitle"
    ).textContent =
        selectedCuisine + " Recipes";


    try {

        let area =
            areaNames[selectedCuisine];


        let response =
            await fetch(
                API_URL +
                "/filter.php?a=" +
                area
            );


        let data =
            await response.json();


        categoryRecipes =
            data.meals || [];


        displayCategoryRecipes();

    } catch (error) {

        console.log(error);

        document.getElementById(
            "categoryRecipesContainer"
        ).innerHTML = `
            <p>
                Unable to load recipes.
            </p>
        `;

    }

}


function displayCategoryRecipes() {

    let container =
        document.getElementById(
            "categoryRecipesContainer"
        );


    container.innerHTML = "";


    let start =
        (currentPage - 1) *
        recipesPerPage;


    let end =
        start +
        recipesPerPage;


    let recipes =
        categoryRecipes.slice(
            start,
            end
        );


    recipes.forEach(
        function(recipe) {

            let card =
                document.createElement(
                    "div"
                );


            card.className =
                "recipe-card";


            card.innerHTML = `

                <div class="recipe-image">

                    <img
                        src="${recipe.strMealThumb}"
                        alt="${recipe.strMeal}"
                    >

                </div>


                <div class="recipe-content">

                    <h3>
                        ${recipe.strMeal}
                    </h3>


                    <div class="card-buttons">

                        <button
                            onclick="viewRecipe('${recipe.idMeal}')"
                        >
                            View Recipe
                        </button>

                    </div>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );


    createPagination();

}


function createPagination() {

    let pagination =
        document.getElementById(
            "categoryPagination"
        );


    pagination.innerHTML = "";


    let totalPages =
        Math.ceil(
            categoryRecipes.length /
            recipesPerPage
        );


    if (totalPages <= 1) {

        return;

    }


    let previousButton =
        document.createElement(
            "button"
        );


    previousButton.textContent =
        "← Previous";


    previousButton.disabled =
        currentPage === 1;


    previousButton.onclick =
        function() {

            if (currentPage > 1) {

                currentPage--;

                displayCategoryRecipes();

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }

        };


    pagination.appendChild(
        previousButton
    );


    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        let button =
            document.createElement(
                "button"
            );


        button.textContent =
            i;


        if (
            i === currentPage
        ) {

            button.classList.add(
                "active-page"
            );

        }


        button.onclick =
            function() {

                currentPage =
                    i;

                displayCategoryRecipes();

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            };


        pagination.appendChild(
            button
        );

    }


    let nextButton =
        document.createElement(
            "button"
        );


    nextButton.textContent =
        "Next →";


    nextButton.disabled =
        currentPage === totalPages;


    nextButton.onclick =
        function() {

            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                displayCategoryRecipes();

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }

        };


    pagination.appendChild(
        nextButton
    );

}


function viewRecipe(id) {

    window.location.href =
        "recipe-details.html?id=" +
        id;

}


loadCategoryRecipes();