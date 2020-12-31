function submitData() {

    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        const item_url = tabs[0].url;

        chrome.identity.getProfileUserInfo(function (userInfo) {
        const email = JSON.stringify(userInfo);
            if (email == null) {chrome.pageAction.setPopup({popup: "error.html"})}

            let data = {
                email: email,
                item_url: item_url,
            }

            fetch("http://127.0.0.1:3000", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {"Content-type": "application/json; charset=UTF-8"},
                redirect: 'follow'
            }).then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        })
    })
}


const button = document.getElementById("myButton");
button.addEventListener("click", submitData);




