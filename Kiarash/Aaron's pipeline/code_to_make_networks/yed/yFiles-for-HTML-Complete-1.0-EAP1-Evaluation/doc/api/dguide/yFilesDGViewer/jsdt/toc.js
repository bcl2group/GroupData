$(function() {
  // enable only for the first two hierarchy levels
  $('.toc > dl > dd, .toc > dl > dd > dl > dd').addClass('toc-hidden');
  $('.toc > dl > dt + dd, .toc > dl > dd > dl > dt + dd').each(function() {
    var dd = $(this);
    var dt = dd.prev();
    dt.addClass('closed');
    dt.click(function() {
      dd.toggleClass('toc-hidden');
      dt.toggleClass('closed').toggleClass('opened');
    });
    dt.hover(function() {
      $(this).css('cursor', 'auto');
    }, function() {
      $(this).css('cursor', 'pointer');
    });
  });
});