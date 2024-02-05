const inputElement = document.getElementById('search-txt');

function handleFocus() {
  $('#search-txt').css('min-width', '350px');
  $('#search-results').fadeIn();
  $('#search-results').css('visibility', 'visible');
}

function handleBlur() {
  if (inputElement.value !== "") {
    return;
  } else {
    $('#search-txt').css('min-width', '0vw');
    $('#search-results').fadeOut();
  }
}

function search() {
  const searchtxt = document.getElementById("search-txt").value;
  const domain = 'kokisu.moe';
  if (searchtxt === "" || searchtxt === " ") {
    return;
  } else {
    $.ajax({
      url: `${window.location.protocol}//api.${domain}/v1/search_players?q=${searchtxt}`,
      type: 'GET',
      success: function (data) {
        const parentElement = document.getElementById('search-results');
        parentElement.innerHTML = '';
        for (let i = 0; i < data.results; i++) {
          const wrapper = document.createElement('div');
          wrapper.setAttribute('class', 'result-wrapper');
          wrapper.setAttribute('id', `result${i}`);
          wrapper.addEventListener('click', function() {
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
      error: function() {
        const parentElement = document.getElementById('search-results');
        parentElement.innerHTML = '';
        const name = document.createElement('div');
        name.setAttribute('id', 'nothing');
        name.innerText = 'Nothing Found!';
        parentElement.appendChild(name);
      }
    });
  }
}

inputElement.addEventListener('focus', handleFocus);
inputElement.addEventListener('blur', handleBlur);
inputElement.addEventListener('change', search);

$("#search-txt").on('keyup keydown', function (e) {
  search();
});