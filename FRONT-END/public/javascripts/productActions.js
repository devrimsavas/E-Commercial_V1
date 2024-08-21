//get token from cookie

function getToken() {
    return document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
}



function populateTable(products, userRole) {
    let rows = '';
    products.forEach(product => {
        rows += `
            <tr class="${product.isdeleted ? 'table-danger' : ''}">
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>${product.quantity}</td>
                <td>${product.price}</td>
                <td>${product.discount}</td>
                <td>${product.brand}</td>
                <td>${product.category}</td>
                <td>${product.imgurl}</td>
                <td><img src="${product.imgurl}" alt="${product.name}" style="width: 50px;"></td>
                <td>${product.isdeleted ? 'Yes' : 'No'}</td>
                <td>${new Date(product.createdAt).toLocaleDateString()}</td>
                <td>
                    ${userRole === 'admin' ? `
                        <button class="btn btn-warning btn-sm edit-product" data-id="${product.id}"><i class="bi bi-pencil-square"></i> Edit</button>
                        <button class="btn btn-danger btn-sm delete-product mt-2" data-id="${product.id}"><i class="bi bi-trash3"></i> Delete</button>
                        ${product.isdeleted ? `<button class="btn btn-success btn-sm undelete-product mt-2" data-id="${product.id}"><i class="bi bi-recycle"></i> Undelete</button>` : ''}
                    ` : ''}
                    ${userRole === 'user' ? `
                        <button class="btn btn-primary btn-sm add-to-cart-button">Add to Cart</button>
                    ` : ''}
                </td>
            </tr>
        `;
    });
    $('table tbody').html(rows);
    attachEventListeners(); // Attach event listeners after populating the table
}

function attachEventListeners() {
    // Remove any existing event listeners to avoid multiple bindings
    $('table').off('click', '.edit-product');
    $('table').off('click', '.delete-product');
    $('table').off('click', '.undelete-product');

    // Edit product
    $('table').on('click', '.edit-product', function() {
        const productId = $(this).data('id');
        const token=getToken()
        console.log("edit product token is ", token)
        
        
        fetch(`http://localhost:3000/products/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const product = data.data.product;
                console.log("it is product", product)
                $('#productModalLabel').text('Edit Product');
                $('#productId').val(product.id);
                $('#productModal #productName').val(product.name);
                $('#productModal #productDescription').val(product.description);
                $('#productModal #productQuantity').val(product.quantity);
                $('#productModal #productPrice').val(parseFloat(product.price).toFixed(2));
                $('#productModal #productImageUrl').val(product.imgurl);
                $('#productModal #productBrand').val(product.Brand.name);
                $('#productModal #productCategory').val(product.Category.name);
                $('#productDiscount').val(parseFloat(product.discount).toFixed(2));
                $('#productModal #productStatus').val(product.status);
                $('#productModal').modal('show');
            }
        })
        .catch(error => {
            console.error('Error fetching product:', error);
            alert('Failed to fetch product details. Please try again.');
        });
    });

    // Delete product
    $('table').on('click', '.delete-product', function() {
        const productId = $(this).data('id');
        const token=getToken()
        if (confirm('Are you sure you want to delete this product?')) {
            fetch(`http://localhost:3000/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
               

            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    location.reload(); // Reload the page to reflect the changes
                } else {
                    alert('Error deleting product');
                }
            })
            .catch(error => console.error('Error deleting product:', error));
        }
    });

    // Undelete product
    $('table').on('click', '.undelete-product', function() {
        const productId = $(this).data('id');
        const token=getToken()
        fetch(`http://localhost:3000/products/${productId}/undelete`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                location.reload(); // Reload the page to reflect the changes
            } else {
                alert('Error undeleting product');
            }
        })
        .catch(error => console.error('Error undeleting product:', error));
    });

    // Add/Edit product form submission
    $('#productForm').off('submit').on('submit', function(e) {
        e.preventDefault();
        const productId = $('#productId').val();
        const token=getToken()
        const productData = {
            name: $('#productModal #productName').val(),
            description: $('#productModal #productDescription').val(),
            quantity: $('#productModal #productQuantity').val(),
            price: $('#productModal #productPrice').val(),
            imgurl: $('#productModal #productImageUrl').val(),
            brandName: $('#productModal #productBrand').val(),
            categoryName: $('#productModal #productCategory').val(),
            discount: parseFloat($('#productModal #productDiscount').val()).toFixed(2),
            status: $('#productModal #productStatus').val(),
            date_added: new Date().toISOString().split('T')[0] // Adding today's date
        };

        console.log("product data being sent", productData) //log it for test 

        const method = productId ? 'PUT' : 'POST';
        const url = productId ? `http://localhost:3000/products/${productId}` : 'http://localhost:3000/products';
        console.log("window user token is ", token)
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`

            },
            body: JSON.stringify(productData),
            credentials: 'include'
        })
        .then(response =>  {
            if (!response.ok) {
                return response.json().then(data=> {throw new Error(data.message  || 'request failed')})
            }
            return response.json()
        })

        
        .then(data => {
            if (data.status === 'success') {
                $('#productModal').modal('hide');
                location.reload(); // Reload the page to reflect the changes
            } else {
                alert('Error saving product');
            }
        })
        .catch(error => console.error('Error saving product:', error));
    });
}

// Ensure the functions are available globally
window.populateTable = populateTable;
window.attachEventListeners = attachEventListeners;

// Attach event listeners when the document is ready
$(document).ready(function() {
    attachEventListeners();
});
