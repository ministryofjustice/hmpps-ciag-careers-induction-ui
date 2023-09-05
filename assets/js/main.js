function handleRedirection() {
  if (window.location.href.indexOf('/redirect/') > -1 && $('input[type="hidden"][name="redirectUrl"]')) {
    window.location.href = $('input[type="hidden"][name="redirectUrl"]').val()
  }
}
handleRedirection()
