// recipes.js
document.addEventListener('DOMContentLoaded', function() {
    const recipeForm = document.getElementById('recipe-form');
    const recipeList = document.getElementById('recipe-list');

    recipeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const recipeName = document.getElementById('recipe-name').value;
        const recipeImage = document.getElementById('recipe-image').value;
        const recipeDescription = document.getElementById('recipe-description').value;

        if (recipeName && recipeImage && recipeDescription) {
            const recipeItem = document.createElement('div');
            recipeItem.classList.add('recipe-item');

            recipeItem.innerHTML = `
                <h3>${recipeName}</h3>
                <img src="${recipeImage}" alt="${recipeName}" />
                <p>${recipeDescription}</p>
            `;

            recipeList.appendChild(recipeItem);

            recipeForm.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });
});