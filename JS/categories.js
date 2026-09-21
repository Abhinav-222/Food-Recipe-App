const API_URL =
    "https://www.themealdb.com/api/json/v1/1";


async function loadCategories() {

    try {

        let response =
            await fetch(
                API_URL +
                "/categories.php"
            );


        let data =
            await response.json();


        let container =
            document.getElementById(
                "categoryContainer"
            );


        container.innerHTML = "";


        data.categories.forEach(
            function(category) {

                let card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "category-card";


                card.onclick =
                    function() {

                        openCategory(
                            category.strCategory,
                            "category"
                        );

                    };


                card.innerHTML = `

                    <div class="category-icon">

                        <img
                            src="${category.strCategoryThumb}"
                            alt="${category.strCategory}"
                        >

                    </div>

                    <h3>
                        ${category.strCategory}
                    </h3>

                    <p>
                        Explore ${category.strCategory} recipes
                    </p>

                `;


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.log(error);

    }

}



async function loadCuisines() {

    try {

        let response =
            await fetch(
                API_URL +
                "/list.php?a=list"
            );


        let data =
            await response.json();


        let container =
            document.getElementById(
                "cuisineContainer"
            );


        container.innerHTML = "";


        data.meals.forEach(
            function(cuisine) {

                let card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "category-card";


                card.onclick =
                    function() {

                        openCategory(
                            cuisine.strArea,
                            "cuisine"
                        );

                    };


                card.innerHTML = `

                    <div class="category-icon">

                        <span>
                            🌍
                        </span>

                    </div>

                    <h3>
                        ${cuisine.strArea}
                    </h3>

                    <p>
                        Explore ${cuisine.strArea} recipes
                    </p>

                `;


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.log(error);

    }

}



function openCategory(
    name,
    type
) {

    localStorage.setItem(
        "selectedCategory",
        name
    );


    localStorage.setItem(
        "selectedCategoryType",
        type
    );


    window.location.href =
        "category-recipes.html";

}



loadCategories();

loadCuisines();