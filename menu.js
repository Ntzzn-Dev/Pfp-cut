const gear = document.getElementById('gear');
const menu = document.getElementById('menu');
const switchTema = document.getElementById('switchtema');

switchTema.addEventListener('change', function() {
  document.documentElement.style.setProperty('--bg-color', switchTema.checked ? '#212529' : 'antiquewhite');
  document.documentElement.style.setProperty('--gd-1', switchTema.checked ? '#343a40' : '#e2e2e2');
  document.documentElement.style.setProperty('--gd-2', switchTema.checked ? '#495057' : '#dee2f1');
  document.documentElement.style.setProperty('--text-color', switchTema.checked ? '#e2e2e2' : '#212529');
})

gear.addEventListener('click', () => {
  if(menu.style.display === 'flex') {
    menu.style.display = 'none';
  } else {
    menu.style.display = 'flex';
  }
});

menu.addEventListener('click', (e) => {
  console.log("aaa")
  e.stopPropagation();
});

document.addEventListener('click', (e) => {
  if (!gear.contains(e.target) && !menu.contains(e.target)) {
    menu.style.display = 'none';
  }
});
