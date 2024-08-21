
//this client-side script controles categoryactions

$(document).ready(function () {
    function showModal(title, message, showInput = false, defaultValue = "", onSuccess) {
        $('#generalModalLabel').text(title);
        if (showInput) {
            $('#modalInput').val(defaultValue).show();
        } else {
            $('#modalInput').hide();
        }
        $('#modalMessage').text(message);
        $('#modalActionBtn').off('click').on('click', function () {
            onSuccess($('#modalInput').val());
            $('#generalModal').modal('hide');
        });
        $('#generalModal').modal('show');
    }

    // Add new category
    $('#add-category').click(function () {
        showModal('Add New Category', 'Enter the new category name:', true, '', function (categoryName) {
            if (categoryName) {
                $.ajax({
                    url: '/category',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ name: categoryName }),
                    success: function (response) {
                        alert('Category added successfully!');
                        location.reload();
                    },
                    error: function (xhr) {
                        alert('Error adding category: ' + xhr.responseJSON.message);
                    }
                });
            }
        });
    });

    // Edit category
    $('.edit-button').click(function () {
        const categoryId = $(this).data('id');
        const currentName = $(this).closest('tr').find('td:nth-child(2)').text();
        showModal('Edit Category', 'Edit the category name:', true, currentName, function (newName) {
            if (newName && newName !== currentName) {
                $.ajax({
                    url: '/category/' + categoryId,
                    method: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({ name: newName }),
                    success: function (response) {
                        alert('Category updated successfully!');
                        location.reload();
                    },
                    error: function (xhr) {
                        alert('Error updating category: ' + xhr.responseJSON.message);
                    }
                });
            }
        });
    });

    // Delete category
    $('.delete-button').click(function () {
        const categoryId = $(this).data('id');
        showModal('Delete Category', 'Are you sure you want to delete this category?', false, '', function () {
            $.ajax({
                url: '/category/' + categoryId,
                method: 'DELETE',
                success: function (response) {
                    alert('Category deleted successfully!');
                    location.reload();
                },
                error: function (xhr) {
                    alert('Error deleting category: ' + xhr.responseJSON.message);
                }
            });
        });
    });
});
