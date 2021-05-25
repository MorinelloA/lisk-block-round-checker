window.onload = function(){
  node = 'https://api.lisknode.io';
  const delegatesdd = document.getElementById("delegates");
  fetch(node + "/api/delegates?limit=101&sort=rank:asc")
  .then(res => res.json())
  .then((delegates) => {
    for(let i = delegates.data.length - 1; i >= 0; i--) {
        var option = document.createElement('option');
        option.text = (i + 1) + ': ' + delegates.data[i].username;
        option.value = delegates.data[i].account.publicKey;
        delegatesdd.add(option, 0);
        delegatesdd.selectedIndex = -1;
    }
  }).catch(function(){
  });
};
