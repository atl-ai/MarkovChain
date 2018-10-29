let output;
let input;

var mat;

// EXAMPLE INPUTS
let spaceNames = "kaz kan kel kelp kern kit \
zap zan zel zert tal tar tay tai yan y lan let \
lir liz ner nit nip nil nz nan raz pal pan xan \
xit xi wx wx";
let pirateNames = "ar black beard grey brown arsty \
powder pirate";
let sithNames = "Vader Malak Sideous Tyranus Bane \
Maul Tenebrous";

$(document).ready(() => {
  output = document.getElementById("output");
  input = document.getElementById("input");

  $("#status").addClass("status-failed");
});

$("#spaceName").click(() => {
  input.value = spaceNames;
  failedMatrix();
})
$("#pirateNames").click(() => {
  input.value = pirateNames;
  failedMatrix();
})
$("#sithNames").click(() => {
  input.value = sithNames;
  failedMatrix();
})

function failedMatrix () {
  $("#status").addClass("status-failed");
  $("#status").removeClass("status-succeed");
}

$("#input").focus(() => {
  failedMatrix();
})

$("#gen").click(function() {
  //output.innerText = "Generating Chain";
  console.log("Generating Matrix");

  //Create empty matrix
  mat = new Array(28);
  for (var i = 0; i < mat.length; i++) {
    mat[i] = new Array(28);
    for (var j = 0; j < mat[i].length; j++) {
      mat[i][j] = 0;
    }
    //mat[i][26] = 1;
  }

  //Split input using whitespace
  var data = input.value.toLowerCase().match(/\S+/g);

  //Counter on each letter including start state and end state
  for (var i = 0; i < data.length; i++) {
    var curState = 0; //Begin at start state
    for (var j = 0; j < data[i].length; j++) {
      var next = data[i].charCodeAt(j) - 96;

      if (next > 0 && next < 27) {
        mat[curState][next]++;
        curState = next;
      }
    }
    //Add to end state
    mat[curState][27]++;
  }

  //Calculate weighted percentages for each letter
  for (var i = 0; i < mat.length; i++) {
    //Get totals
    var total = 0;
    for (var j = 0; j < mat.length; j++) {
      total += mat[i][j];
    }

    //Change count to weights
    for (var j = 0; j < mat.length; j++) {
      if (mat[i][j] == 0) {
        mat[i][j] = 0;
      } else {
        mat[i][j] /= total;
      }
    }
  }

  console.log(mat);

  $("#status").removeClass("status-failed");
  $("#status").addClass("status-succeed");

  $("#chain").click();

  function getCharCode(index) {
    var code = data.charCodeAt(index) - 97;
    if (code == -65) {
      code = 26;
    }
    return code;
  }
});

$("#chain").click(function() {

  if (mat === undefined) {
    return;
  }

  //Clear area
  output.value = "";

  //Pick random starting letter and find chain
  var names = new Array(5);

  for (var i = 0; i < 10; i++) {
    var name = GenerateChain();
    while (name.length < 4 || name.length > 12) {
      name = GenerateChain();
    }
    if (i != 0)
      output.value += "\n";
    output.value += name.charAt(0).toUpperCase() + name.slice(1);
  }

  function GenerateChain() {
    var chain = "";

    var curState = GetNextState(0);
    console.log("Starting character", curState);

    while (curState != 27) {
      chain += String.fromCharCode(curState + 96);
      curState = GetNextState(curState);
    }

    return chain;
  }

  function GetNextState(state) {
    var r = Math.random();
    for (var i = 0; i < 28; i++) {
      r -= mat[state][i];
      if (r <= 0) {
        return i;
      }
    }
    return 28;
  }
})
