const API_URL =
    "https://www.themealdb.com/api/json/v1/1";

const recipesPerPage = 28;

let allRecipes = [];

let currentPage = 1;

const recipeContainer =
    document.getElementById(
        "allRecipesContainer"
    );

const pagination =
    document.getElementById(
        "recipePagination"
    );


async function loadRecipes() {

    try {

        allRecipes = [];

        for (
            let letterCode = 97;
            letterCode <= 122;
            letterCode++
        ) {

            const letter =
                String.fromCharCode(
                    letterCode
                );

            const response =
                await fetch(
                    API_URL +
                    "/search.php?f=" +
                    letter
                );

            const data =
                await response.json();

            if (data.meals) {

                allRecipes =
                    allRecipes.concat(
                        data.meals
                    );

            }

        }


        const uniqueRecipes = [];

        const recipeIds = new Set();

        allRecipes.forEach(
            function(recipe) {

                if (
                    !recipeIds.has(
                        recipe.idMeal
                    )
                ) {

                    recipeIds.add(
                        recipe.idMeal
                    );

                    uniqueRecipes.push(
                        recipe
                    );

                }

            }
        );


        allRecipes =
            uniqueRecipes;

        currentPage = 1;

        displayRecipes();

    } catch (error) {

        console.log(error);

        recipeContainer.innerHTML = `
            <p>
                Unable to load recipes.
                Please try again.
            </p>
        `;

    }

}


function displayRecipes() {

    recipeContainer.innerHTML = "";

    const start =
        (currentPage - 1) *
        recipesPerPage;

    const end =
        start +
        recipesPerPage;

    const recipes =
        allRecipes.slice(
            start,
            end
        );


    recipes.forEach(
        function(recipe) {

            const card =
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

        <span
            class="heart"
            onclick="saveRecipe('${recipe.idMeal}')"
        >
            ♡
        </span>

    </div>


    <div class="recipe-content">

        <span class="tag">
            ${recipe.strArea}
        </span>

        <h3>
            ${recipe.strMeal}
        </h3>

        <p>
            Delicious Recipe
        </p>

        <div class="recipe-buttons">

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

            recipeContainer.appendChild(
                card
            );

        }
    );


    createPagination();

}


function createPagination() {

    pagination.innerHTML = "";

    const totalPages =
        Math.ceil(
            allRecipes.length /
            recipesPerPage
        );


    if (totalPages <= 1) {

        return;

    }


    const previousButton =
        document.createElement(
            "button"
        );

    previousButton.textContent =
        "Previous";

    previousButton.disabled =
        currentPage === 1;


    previousButton.onclick =
        function() {

            if (
                currentPage > 1
            ) {

                currentPage--;

                displayRecipes();

            }

        };


    pagination.appendChild(
        previousButton
    );


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.textContent =
            page;


        if (
            page === currentPage
        ) {

            button.classList.add(
                "active"
            );

        }


        button.onclick =
            function() {

                currentPage =
                    page;

                displayRecipes();

            };


        pagination.appendChild(
            button
        );

    }


    const nextButton =
        document.createElement(
            "button"
        );

    nextButton.textContent =
        "Next";

    nextButton.disabled =
        currentPage === totalPages;


    nextButton.onclick =
        function() {

            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                displayRecipes();

            }

        };


    pagination.appendChild(
        nextButton
    );

}


function getSavedRecipeKey() {

    const user =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    if (
        !user ||
        !user.email
    ) {

        return null;

    }


    return "savedRecipes_" +
        user.email;

}


function saveRecipe(id) {

    const key =
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


    if (
        savedRecipes.includes(
            String(id)
        )
    ) {

        alert(
            "Recipe is already saved."
        );

        return;

    }


    savedRecipes.push(
        String(id)
    );


    localStorage.setItem(
        key,
        JSON.stringify(
            savedRecipes
        )
    );


    alert(
        "Recipe saved!"
    );

}


function viewRecipe(id) {

    window.location.href =
        "recipe-details.html?id=" +
        id;
recipesPerPage 
}


loadRecipes();