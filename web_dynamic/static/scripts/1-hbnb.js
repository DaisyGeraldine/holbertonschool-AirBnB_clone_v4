//
$(document).ready(function() {
    const objIds = [];
    $('input[type="checkbox"]').on('click', function() {
        if (this.checked) {
            objIds.push($(this).data('id'));
        } else {
            objIds.splice(objIds.indexOf($(this).data('id')), 1);
        }
    })
})
