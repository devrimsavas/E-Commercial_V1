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
    $('.edit-button').click(function() {
        const userId = $(this).data('id');
        const userRow = $(this).closest('tr');

        const username = userRow.find('td:nth-child(2)').text();
        const firstname = userRow.find('td:nth-child(3)').text();
        const lastname = userRow.find('td:nth-child(4)').text();
        const email = userRow.find('td:nth-child(5)').text();
        const address = userRow.find('td:nth-child(6)').text();
        const telephonenumber = userRow.find('td:nth-child(7)').text();
        const role = userRow.find('td:nth-child(8)').text();

        console.log("You clicked edit button and the username is " + username);

        $('#editUserId').val(userId);
        $('#editUserUsername').val(username);
        $('#editUserFirstname').val(firstname);
        $('#editUserLastname').val(lastname);
        $('#editUserEmail').val(email);
        $('#editUserTelephonenumber').val(telephonenumber);
        $('#editUserAddress').val(address);
        $('#editUserRole').val(role);
    });

    $('#saveUserChanges').click(function() {
        const userId = $('#editUserId').val();
        const token = getToken();
        const userData = {
            username: $('#editUserUsername').val(),
            firstname: $('#editUserFirstname').val(),
            lastname: $('#editUserLastname').val(),
            email: $('#editUserEmail').val(),
            address: $('#editUserAddress').val(),
            telephonenumber: $('#editUserTelephonenumber').val(),
            role: $('#editUserRole').val()
        };

        fetch(`http://localhost:3000/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Close the modal
                $('#editUserModal').modal('hide');
                window.location.reload();

                // Update the user row with the new data
                const userRow = $(`button[data-id='${userId}']`).closest('tr');
                userRow.find('td:nth-child(3)').text(userData.firstname);
                userRow.find('td:nth-child(4)').text(userData.lastname);
                userRow.find('td:nth-child(5)').text(userData.email);
                userRow.find('td:nth-child(6)').text(userData.address);
                userRow.find('td:nth-child(7)').text(userData.telephonenumber);
                userRow.find('td:nth-child(8)').text(userData.role);
            } else {
                alert('Error updating user');
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
