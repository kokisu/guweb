const inputElement = document.getElementById('search-txt');

function handleFocus() {
  $('#search-txt').css('min-width', '350px');
  $('#search-results').fadeIn();
}

function handleBlur() {
  return;

  $('#search-txt').css('min-width', '0vw');
  $('#search-results').fadeOut();
}

function search() {
  const searchtxt = document.getElementById("search-txt").value;
  const domain = 'kokisu.moe';
  const parentElement = document.getElementById('search-results');
  if (searchtxt === "") {
    parentElement.innerHTML = '';
    $('#search-results').css('visibility', 'hidden');
    return;
  }

  $.ajax({
    url: `${window.location.protocol}//api.${domain}/v1/search_players?q=${searchtxt}`,
    type: 'GET',
    success: function (data) {
      parentElement.innerHTML = '';
      if (document.getElementById("search-txt").value === "") {
        $('#search-results').css('visibility', 'hidden');
        return;
      }

      $('#search-results').css('visibility', 'visible');
      for (let i = 0; i < data.results; i++) {
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'result-wrapper');
        wrapper.setAttribute('id', `result${i}`);
        wrapper.addEventListener('click', function () {
          location.href = `https://${domain}/u/${data.result[i].id}`;
        });
        const image = document.createElement('div');
        image.setAttribute('id', 'result-image');
        image.setAttribute('style', `background-image: url(https://a.${domain}/${data.result[i].id});`);
        const name = document.createElement('p');
        name.setAttribute('id', 'result-name');
        name.innerHTML = data.result[i].name;
        parentElement.appendChild(wrapper);
        wrapper.appendChild(image);
        wrapper.appendChild(name);
      }
    },
    error: function () {
      const parentElement = document.getElementById('search-results');
      parentElement.innerHTML = '';
      const name = document.createElement('div');
      name.setAttribute('id', 'nothing');
      name.innerText = 'Nothing Found!';
      parentElement.appendChild(name);
    }
  });
}

inputElement.addEventListener('focus', handleFocus);
inputElement.addEventListener('blur', handleBlur);

$("#search-txt").on('input', function (e) {
  search();
});