var node;
let delegatePublicKey;

function loadBlocks() {
  document.getElementById("loadingmsg").style.display = "block";
  document.getElementById("blocklist").innerHTML = "";

  var e = document.getElementById("delegates");
  var delegatePublicKey = e.options[e.selectedIndex].value;

  let blocks = {};
  let currentBlockHeight;

  fetch(node + "/api/node/status/")
  .then(res => res.json())
  .then((currentStatus) => {

    currentBlockHeight = currentStatus.data.height;

    let currentRound = (Math.floor((currentBlockHeight - 1) / 101) + 1);

    //Preload Block Dictionary
    blocks[currentRound] = "Pending";
    for (let i = 1; i < 50; i++)
    {
        blocks[currentRound - i] = "Missed";
    }

    fetch(node + "/api/blocks?limit=100&generatorPublicKey=" + delegatePublicKey)
    .then(res => res.json())
    .then((forgedBlocks) => {
      for(let i = 0; i < forgedBlocks.data.length; i++)
      {
        if((Math.floor((forgedBlocks.data[i].height - 1) / 101) + 1) in blocks)
        {
          blocks[Math.floor((forgedBlocks.data[i].height - 1) / 101) + 1] = "Forged";
        }
      }

      let blocksObj = [];
      for (var key in blocks) {
        if (blocks.hasOwnProperty(key)) {
          let temp = {};
          temp.round = key;
          temp.status = blocks[key];
          blocksObj.unshift(temp);
        }
      }

      document.getElementById("loadingmsg").style.display = "none";

      for(let i = 0; i < blocksObj.length; i++)
      {
        if(blocksObj[i].status === "Missed")
        {
          document.getElementById("blocklist").innerHTML += "<li class='list-group-item list-group-item-danger'>" + blocksObj[i].round + " - " + blocksObj[i].status + "</li>"
        }
        else if(blocksObj[i].status === "Forged")
        {
          document.getElementById("blocklist").innerHTML += "<li class='list-group-item list-group-item-success'>" + blocksObj[i].round + " - " + blocksObj[i].status + "</li>"
        }
        else
        {
          document.getElementById("blocklist").innerHTML += "<li class='list-group-item list-group-item-secondary'>" + blocksObj[i].round + " - " + blocksObj[i].status + "</li>"
        }
      }

    }).catch(function(){
    });
  }).catch(function(){
  });
}
