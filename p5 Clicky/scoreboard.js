/**
 * Created by Ryan on 8/6/2017.
 */
window.onload = function () {
    var data = JSON.parse('{"users":[{"id":"8D6g9YpfcQbxJyyPAAAB","name":"asdf","x":993.7985330357608,"y":166.42806223624794,"col":[255,105,180]}],"king":"8D6g9YpfcQbxJyyPAAAB","scores":[{"8D6g9YpfcQbxJyyPAAAB":0}],"objective":{"x":529.0566133809529,"y":216.86586818093744,"size":200},"remainingTime":-18}')
    initScoreboard(data.users)
    data = JSON.parse('{"users":[{"id":"8D6g9YpfcQbxJyyPAAAB","name":"asdf","x":993.7985330357608,"y":166.42806223624794,"col":[255,105,180]}],"king":"8D6g9YpfcQbxJyyPAAAB","scores":[{"8D6g9YpfcQbxJyyPAAAB":100}],"objective":{"x":529.0566133809529,"y":216.86586818093744,"size":200},"remainingTime":-18}')
    updateScoreboard(data)
};

function updateScoreboard(data) {
    for (i=0; i<data.users.length; i++){
        rowScore = document.getElementById(data.users[i].id+"-score")
        rowScore.innerHTML = data.scores[0][data.users[i].id];
        rowKing = document.getElementById(data.users[i].id+"-king")
        if (data.users[i].id == data.king){
            rowKing.innerHTML = "<div><img src=\"images/crown.svg\" style=\"width:20px; height:auto;\"></div>";
        }
        else{
            rowKing.innerHTML = ""
        }
    }
}

function initScoreboard(users)
{
    var table = document.getElementById("score-table-body")
    for (i=0; i<users.length; i++) {
        var row = table.insertRow(0);
        row.insertAdjacentHTML("<th scope=i></th>")
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell2.setAttribute("id", users[i].id + "-score");
        var cell3 = row.insertCell(2);
        cell3.setAttribute("id", users[i].id + "-king");
        cell1.innerHTML = users[i].name;
        cell2.innerHTML = 0;
    }
}



