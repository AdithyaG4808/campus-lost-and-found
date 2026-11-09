var items = [];
var filter = "all";

function esc(s){
  return String(s).replace(/[&<>"']/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
  });
}

function render(){
  var q = document.getElementById("search").value.toLowerCase();
  var shown = items.filter(function(i){
    if(filter !== "all" && i.type !== filter) return false;
    return (i.name + " " + i.place + " " + i.desc).toLowerCase().indexOf(q) !== -1;
  });
  var list = document.getElementById("list");
  if(!shown.length){ list.innerHTML = '<div class="empty">No items to show.</div>'; return; }
  list.innerHTML = shown.map(function(i){
    return '<div class="item' + (i.done ? ' done' : '') + '">' +
      '<div class="row"><h3>' + esc(i.name) + '</h3><span class="badge ' + i.type + '">' + i.type.toUpperCase() + '</span></div>' +
      '<div class="meta">📍 ' + esc(i.place) + ' · 📅 ' + esc(i.date) + '</div>' +
      (i.desc ? '<div>' + esc(i.desc) + '</div>' : '') +
      '<div class="meta">Contact: ' + esc(i.contact) + '</div>' +
      '</div>';
  }).join("");
}

document.getElementById("form").addEventListener("submit", function(e){
  e.preventDefault();
  var v = function(id){ return document.getElementById(id).value.trim(); };
  items.unshift({
    id: Date.now(), type: v("type"), name: v("name"), place: v("place"),
    date: v("date"), desc: v("desc"), contact: v("contact"), done: false
  });
  render();
  e.target.reset();
  document.getElementById("date").value = new Date().toISOString().slice(0,10);
});

document.getElementById("search").addEventListener("input", render);
document.querySelectorAll("[data-f]").forEach(function(b){
  b.addEventListener("click", function(){
    filter = b.getAttribute("data-f");
    document.querySelectorAll("[data-f]").forEach(function(x){ x.classList.toggle("active", x === b); });
    render();
  });
});

document.getElementById("date").value = new Date().toISOString().slice(0,10);
render();
