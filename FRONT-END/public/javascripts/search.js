$(document).ready(function() {
    function fetchAndPopulate(url, method, body = null) {
        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : null
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                populateTable(data.data.products, window.user.role);
            }
        })
        .catch(error => console.error('Error fetching products:', error));
    }

    $('#searchButton').click(function() {
        const name = $('#productName').val();
        const category = $('#productCategory option:selected').text(); // Use text instead of value
        const brand = $('#productBrand option:selected').text(); // Use text instead of value
        const searchCriteria = {
            name: name || undefined,
            category: category !== 'None' ? category : undefined,
            brand: brand !== 'None' ? brand : undefined
        };
        fetchAndPopulate('http://localhost:3000/search', 'POST', searchCriteria);
    });

    $('#clearButton').click(function() {
        $('#productName').val('');
        $('#productCategory').val('');
        $('#productBrand').val('');
        //fetchAndPopulate('/admin/products', 'GET');
        fetchAndPopulate('http://localhost:3000/products', 'GET');
    });

    if (window.user.role === 'admin') {
        $('#addButton').show().click(function() {
            window.location.href = '/admin/add-product';
        });
    } else {
        $('#addButton').hide();
    }

    // Fetch all products initially
    fetchAndPopulate('/admin/products', 'GET');
});
