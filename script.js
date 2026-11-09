var KEY = "campus_lost_found_v1";
var items = [];
var filter = "all";

var sample = [
  {id:1,type:"lost",category:"Electronics",name:"Black calculator (Casio fx-991)",place:"Block A, Room 204",date:"2026-10-25",desc:"Has my initials on the back.",contact:"9876500001",done:false},
  {id:2,type:"found",category:"ID Cards",name:"Student ID card",place:"Canteen",date:"2026-10-26",desc:"CSE, 3rd year. Handed to the security desk.",contact:"security@campus.example",done:false}
];

function load(){
  try{
    var raw = localStorage.getItem(KEY);
    items = raw ? JSON.parse(raw) : sample.slice();
  }catch(e){ items = sample.slice(); }
}
function save(){
  try{ localStorage.setItem(KEY, JSON.stringify(items)); }catch(e){}
}
function esc(s){
  return String(s).replace(/[&<>"']/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
  });
}

function updateStats(){
  var lost = items.filter(function(i){ return i.type === "lost" && !i.done; }).length;
  var found = items.filter(function(i){ return i.type === "found" && !i.done; }).length;
  var done = items.filter(function(i){ return i.done; }).length;
  document.getElementById("stats").textContent = lost + " lost · " + found + " found · " + done + " resolved";
}

function render(){
  updateStats();
  var q = document.getElementById("search").value.toLowerCase();
  var shown = items.filter(function(i){
    if(filter !== "all" && i.type !== filter) return false;
    return (i.name + " " + i.place + " " + i.desc + " " + (i.category || "")).toLowerCase().indexOf(q) !== -1;
  });
  var order = document.getElementById("sort").value;
  shown.sort(function(a, b){
    return order === "old" ? a.id - b.id : b.id - a.id;
  });
  var list = document.getElementById("list");
  if(!shown.length){ list.innerHTML = '<div class="empty">No items to show.</div>'; return; }
  list.innerHTML = shown.map(function(i){
    return '<div class="item' + (i.done ? ' done' : '') + '">' +
      '<div class="row"><h3>' + esc(i.name) + '</h3><span class="badge ' + i.type + '">' + i.type.toUpperCase() + '</span></div>' +
      '<div class="meta">📍 ' + esc(i.place) + ' · 📅 ' + esc(i.date) + ' · 🏷️ ' + esc(i.category || "Other") + '</div>' +
      (i.desc ? '<div>' + esc(i.desc) + '</div>' : '') +
      '<div class="meta">Contact: ' + esc(i.contact) + '</div>' +
      '<div class="actions">' +
        '<button class="ghost" onclick="toggleDone(' + i.id + ')">' + (i.done ? 'Reopen' : 'Mark as resolved') + '</button>' +
        '<button class="ghost" onclick="removeItem(' + i.id + ')">Delete</button>' +
      '</div></div>';
  }).join("");
}

function toggleDone(id){
  items.forEach(function(i){ if(i.id === id) i.done = !i.done; });
  save(); render();
}
function removeItem(id){
  items = items.filter(function(i){ return i.id !== id; });
  save(); render();
}

document.getElementById("form").addEventListener("submit", function(e){
  e.preventDefault();
  var v = function(id){ return document.getElementById(id).value.trim(); };
  if(!v("name") || !v("place") || !v("contact")){
    alert("Please fill in the item name, location and contact.");
    return;
  }
  items.unshift({
    id: Date.now(), type: v("type"), category: v("category"), name: v("name"), place: v("place"),
    date: v("date"), desc: v("desc"), contact: v("contact"), done: false
  });
  save(); render();
  e.target.reset();
  document.getElementById("date").value = new Date().toISOString().slice(0,10);
});

document.getElementById("search").addEventListener("input", render);
document.getElementById("sort").addEventListener("change", render);
document.querySelectorAll("[data-f]").forEach(function(b){
  b.addEventListener("click", function(){
    filter = b.getAttribute("data-f");
    document.querySelectorAll("[data-f]").forEach(function(x){ x.classList.toggle("active", x === b); });
    render();
  });
});

document.getElementById("date").value = new Date().toISOString().slice(0,10);
load(); render();