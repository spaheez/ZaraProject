// function submitData() {

//
//     chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
//         const item_url = tabs[0].url;
//
//         chrome.identity.getProfileUserInfo(function (info) {
//             const email = info.email;
//             if (email == null) {
//                 chrome.pageAction.setPopup({popup: "error.html"})
//             }
//         })
//     })
// }
function submitData() {
    chrome.extension.getBackgroundPage().console.log('foo');

    let data = {
        email: 'marta@gmail.com',
        item_url: "https://www.zara.com/hr/hr/ko%C5%BEni-remen-s-dva-lica-p06907415.html?v1=56303699&v2=1547069",
    }

    fetch("http://127.0.0.1:3000", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-type": "application/json; charset=UTF-8"},
        redirect: 'follow'
    }).then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}



// let myHeaders = new Headers();
// myHeaders.append("Content-Type", "application/json");
//
// let raw = JSON.stringify({"email":"foo","item_url":"https://www.zara.com/hr/hr/ko%C5%BEni-remen-s-dva-lica-p06907415.html?v1=56303699&v2=1547069"});
//
// let requestOptions = {
//     method: 'POST',
//     headers: myHeaders,
//     body: raw,
//     redirect: 'follow'
// };
//
// fetch("http://127.0.0.1:3000", requestOptions)
//     .then(response => response.text())
//     .then(result => console.log(result))
//     .catch(error => console.log('error', error));

const button = document.getElementById("myButton");
button.addEventListener("click", submitData);




