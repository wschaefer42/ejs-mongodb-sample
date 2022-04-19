function likeQuote(id) {
    fetch('/quotes', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: id,
            user: document.getElementById("user").value
        })
    })
}

$(document).ready(function () {
    $("#login-button").click(function () {
        fetch('/username', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user: $("#user").val()
            })
        })
            .then(res => {
                if (res.ok) return res.json
            })
    })
})
