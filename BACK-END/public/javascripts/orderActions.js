// this client-side script controles orderactions
$(document).ready(function() {
    $('.order-status').change(function() {
        const orderId = $(this).data('id');
        const newStatus = $(this).val();

        fetch('/order/status', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
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

        if (confirm('Are you sure you want to delete this order?')) {
            fetch(`/order/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
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
