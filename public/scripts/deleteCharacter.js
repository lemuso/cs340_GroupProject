function deleteCharacter(id){
    var confirmDelete = confirm("Are you sure you want to delete this character?");
    if(confirmDelete){
        
        $.ajax({
            url: '/characters/'+ id,
            type: 'DELETE',
            success: function(result){
                window.location.reload(true);
            }
        });
    }
};
