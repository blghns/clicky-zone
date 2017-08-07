/**
 * Created by Ryan on 8/6/2017.
 */
function updateScoreboard(data) {
    for (let i=0; i<data.users.length; i++){
        rowScore = document.getElementById(data.users[i].id+"-score")
        rowScore.innerHTML = data.scores[data.users[i].id];
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
    for (let i=0; i<users.length; i++) {
        var row = table.insertRow(0);
        th = document.createElement("th")
        th.setAttribute("scope", "row")
        row.appendChild(th);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell2.setAttribute("id", users[i].id + "-score");
        var cell3 = row.insertCell(2);
        cell3.setAttribute("id", users[i].id + "-king");
        cell1.innerHTML = users[i].name;
        cell2.innerHTML = 0;
    }
}



