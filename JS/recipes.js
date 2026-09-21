const API_URL =
    "https://www.themealdb.com/api/json/v1/1";

let allRecipesPage = [];

let currentPage =
    1;

const recipesPerPage =
    30;


async function loadAllRecipes() {

    try {

        allRecipesPage = [];

        let letters =
            "abcdefghijklmnopqrstuvwxyz";


        for (
            let i = 0;
            i < letters.length;
            i++
        ) {

            let response =
                await fetch(
                    API_URL +
                    "/search.php?f=" +
                    letters[i]
                );


            let data =
                await response.json();


            if (data.meals) {

                data.meals.forEach(
                    function(recipe) {

                        let exists =
                            allRecipesPage.some(
                                function(item) {

                                    return (
                                        item.idMeal ===
                                        recipe.idMeal
                                    );

                                }
                            );


                        if (!exists) {

                            allRecipesPage.push(
                                recipe
                            );

                        }

                    }
                );

            }

        }


        displayRecipePage();


    } catch (error) {

        console.log(error);

        document.getElementById(
            "allRecipesContainer"
        ).innerHTML = `

            <p>
                Unable to load recipes.
            </p>

        `;

    }

}



function displayRecipePage() {

    let container =
        document.getElementById(
            "allRecipesContainer"
        );


    container.innerHTML = "";


    let start =
        (
            currentPage - 1
        ) *
        recipesPerPage;


    let end =
        start +
        recipesPerPage;


    let recipes =
        allRecipesPage.slice(
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

                    <span class="heart">
                        ♡
                    </span>

                </div>


                <div class="recipe-content">

                    <span class="tag">
                        ${recipe.strArea || "Recipe"}
                    </span>


                    <h3>
                        ${recipe.strMeal}
                    </h3>


                    <p>
                        ${recipe.strCategory || "Delicious Recipe"}
                    </p>


                    <div class="card-buttons">

                        <button
                            onclick="viewRecipe('${recipe.idMeal}')"
                        >
                            View Recipe
                        </button>


                        <button
                            class="save-button"
                            onclick="saveRecipe('${recipe.idMeal}')"
                        >
                            Save
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
            "recipePagination"
        );


    pagination.innerHTML = "";


    let totalPages =
        Math.ceil(
            allRecipesPage.length /
            recipesPerPage
        );


    if (
        totalPages <= 1
    ) {

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

            if (
                currentPage > 1
            ) {

                currentPage--;

                displayRecipePage();

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

        let pageButton =
            document.createElement(
                "button"
            );


        pageButton.textContent =
            i;


        if (
            i === currentPage
        ) {

            pageButton.classList.add(
                "active-page"
            );

        }


        pageButton.onclick =
            function() {

                currentPage =
                    i;

                displayRecipePage();

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            };


        pagination.appendChild(
            pageButton
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

                displayRecipePage();

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



function getSavedRecipeKey() {

    let loggedInUser =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    if (
        !loggedInUser ||
        !loggedInUser.email
    ) {

        return null;

    }


    return (
        "savedRecipes_" +
        loggedInUser.email
    );

}



function saveRecipe(id) {

    let key =
        getSavedRecipeKey();


    if (!key) {

        alert(
            "Please sign in to save recipes."
        );


        window.location.href =
            "signin.html";


        return;

    }


    let savedRecipes =
        JSON.parse(
            localStorage.getItem(key)
        ) || [];


    id =
        String(id);


    if (
        !savedRecipes.includes(id)
    ) {

        savedRecipes.push(id);


        localStorage.setItem(
            key,
            JSON.stringify(
                savedRecipes
            )
        );


        alert(
            "Recipe saved!"
        );

    } else {

        alert(
            "Recipe is already saved."
        );

    }

}



loadAllRecipes();