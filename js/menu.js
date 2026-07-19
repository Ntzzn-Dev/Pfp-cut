const gear = document.getElementById('gear');
const menu = document.getElementById('menu');
const switchTema = document.getElementById('switchtema');

switchTema.addEventListener('change', function() {
  document.documentElement.style.setProperty('--gd-1', switchTema.checked ? '#060606' : '#7b7676');
  document.documentElement.style.setProperty('--gd-2', switchTema.checked ? '#160b0b' : '#787878');
  document.documentElement.style.setProperty('--text-color', switchTema.checked ? '#e2e2e2' : '#212529');
  document.documentElement.style.setProperty('--secondary-color', switchTema.checked ? '#FF2400' : '#ffffff');
  document.documentElement.style.setProperty('--primary-color', switchTema.checked ? '#B30000' : '#f8f9fa');
  document.getElementById("bg-img").src = switchTema.checked ? 'src/bg_img_dark.png' : 'src/bg_img_light.png';
})

gear.addEventListener('click', () => {
  if(menu.style.display === 'flex') {
    menu.style.display = 'none';
  } else {
    menu.style.display = 'flex';
  }
});

menu.addEventListener('click', (e) => {
  e.stopPropagation();
});

document.addEventListener('click', (e) => {
  if (!gear.contains(e.target) && !menu.contains(e.target)) {
    menu.style.display = 'none';
  }
});
