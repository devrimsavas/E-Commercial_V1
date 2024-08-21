function getToken() {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (tokenCookie) {
        return tokenCookie.split('=')[1];
    } else {
        console.error("Token not found in cookies.");
        return null;
    }
}

$(document).ready(function() {
    $('.order-status').change(function() {
        const orderId = $(this).data('id');
        const newStatus = $(this).val();
        const token = getToken();

        fetch('http://localhost:3000/order/status', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus, orderId: orderId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status !== 'success') {
                alert('Error updating order status');
            }
        })
        .catch(error => console.error('Error:', error));
    });

    $('.edit-order').click(function() {
        // Handle order edit if needed
    });

    $('.delete-order').click(function() {
        const orderId = $(this).data('id');
        const token = getToken();

        if (confirm('Are you sure you want to delete this order?')) {
            fetch(`http://localhost:3000/order/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Order deleted successfully');
                    location.reload(); // Reload the page to reflect changes
                } else {
                    alert('Error deleting order');
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });
});
