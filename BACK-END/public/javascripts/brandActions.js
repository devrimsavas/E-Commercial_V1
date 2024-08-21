
//this client-side script controles brandsactions 


$(document).ready(function () {
    function showModal(title, message, showInput = false, defaultValue = "", onSuccess) {
        $('#generalModalLabel').text(title);
        $('#modalMessage').text(message);

        // Adjust input visibility based on the requirement of the action
        if (showInput) {
            $('#modalInput').val(defaultValue).show();
        } else {
            $('#modalInput').hide();
        }

        // Set up the click handler for the confirm button
        $('#modalActionBtn').off('click').on('click', function () {
            // Get input value if input is shown, otherwise pass null
            var inputResult = showInput ? $('#modalInput').val() : null;
            $('#generalModal').modal('hide');
            onSuccess(inputResult);
        });

        $('#generalModal').modal('show');
    }

    // Add new brand
    $('#add-brand').click(function () {
        showModal('Add New Brand', 'Enter the new brand name:', true, '', function (brandName) {
            if (brandName) {
                $.ajax({
                    url: '/brand',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ name: brandName }),
                    success: function (response) {
                        alert('Brand added successfully!');
                        location.reload(); // Reload the page to see the new brand
                    },
                    error: function (xhr) {
                        alert('Error adding brand: ' + xhr.responseJSON.message);
                    }
                });
            }
        });
    });

    // Edit brand
    $('.edit-button').click(function () {
        const brandId = $(this).data('id');
        const currentName = $(this).closest('tr').find('td:nth-child(2)').text();
        showModal('Edit Brand', 'Edit the brand name:', true, currentName, function (newName) {
            if (newName && newName !== currentName) {
                $.ajax({
                    url: '/brand/' + brandId,
                    method: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({ name: newName }),
                    success: function (response) {
                        alert('Brand updated successfully!');
                        location.reload();
                    },
                    error: function (xhr) {
                        alert('Error updating brand: ' + xhr.responseJSON.message);
                    }
                });
            }
        });
    });

    // Delete brand
    $('.delete-button').click(function () {
        const brandId = $(this).data('id');
        showModal('Delete Brand', 'Are you sure you want to delete this brand?', false, '', function () {
            $.ajax({
                url: '/brand/' + brandId,
                method: 'DELETE',
                success: function (response) {
                    alert('Brand deleted successfully!');
                    location.reload();
                },
                error: function (xhr) {
                    alert('Error deleting brand: ' + xhr.responseJSON.message);
                }
            });
        });
    });
});
