!(function (e) {
  var t,
    n,
    o,
    i,
    c,
    d =
      '<svg><symbol id="el-icon-bachelor-cap" viewBox="0 0 1024 1024"><path d="M143.45358433 726.23745369c0-18.1028232-9.91443712-33.74774972-24.53754143-42.25372918V389.21563402l417.0691622 263.42300381 466.13043664-294.40907188-466.13043664-294.39526348L69.85476846 358.21575754l0.02761681 0.01380841h-0.02761681v325.75415856c-14.6092959 8.50597947-24.53754143 24.15090599-24.53754142 42.25372918 0 17.12242621 8.82357285 32.18739958 22.16249521 40.96954723l-46.70003665 81.7043515h147.19763175l-46.70003664-81.7043515c13.35273076-8.78214764 22.17630362-23.84712101 22.17630362-40.96954723z"  ></path><path d="M535.9852051 710.66156922l-26.20835882-16.52866465L217.05240019 509.22450995V647.46048475l318.93280491 201.43705925L854.91800999 647.46048475V509.23831837L562.19356391 694.13290457z"  ></path></symbol></svg>',
    l = (l = document.getElementsByTagName('script'))[l.length - 1].getAttribute(
      'data-injectcss'
    ),
    a = function (e, t) {
      t.parentNode.insertBefore(e, t)
    }
  if (l && !e.__iconfont__svg__cssinject__) {
    e.__iconfont__svg__cssinject__ = !0
    try {
      document.write(
        '<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>'
      )
    } catch (e) {
      console && console.log(e)
    }
  }
  function s() {
    c || ((c = !0), o())
  }
  function r() {
    try {
      i.documentElement.doScroll('left')
    } catch (e) {
      return void setTimeout(r, 50)
    }
    s()
  }
  ;(t = function () {
    var e, t
    ;((t = document.createElement('div')).innerHTML = d),
      (d = null),
      (e = t.getElementsByTagName('svg')[0]) &&
        (e.setAttribute('aria-hidden', 'true'),
        (e.style.position = 'absolute'),
        (e.style.width = 0),
        (e.style.height = 0),
        (e.style.overflow = 'hidden'),
        (t = e),
        (e = document.body).firstChild ? a(t, e.firstChild) : e.appendChild(t))
  }),
    document.addEventListener
      ? ~['complete', 'loaded', 'interactive'].indexOf(document.readyState)
        ? setTimeout(t, 0)
        : ((n = function () {
            document.removeEventListener('DOMContentLoaded', n, !1), t()
          }),
          document.addEventListener('DOMContentLoaded', n, !1))
      : document.attachEvent &&
        ((o = t),
        (i = e.document),
        (c = !1),
        r(),
        (i.onreadystatechange = function () {
          'complete' == i.readyState && ((i.onreadystatechange = null), s())
        }))
})(window)
