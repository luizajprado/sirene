import sys
page, dictf = sys.argv[1], sys.argv[2]
s = open(page).read()
mark = '<!--i18n-->'
if mark in s:
    a = s.index(mark); b = s.index('<!--/i18n-->') + len('<!--/i18n-->'); s = s[:a] + s[b:]
guide = sys.argv[3] if len(sys.argv) > 3 else None
js = open('i18n/common.js').read() + '\n' + open(dictf).read() + '\n' + (open('i18n/gloss.js').read() + '\n' + open(guide).read() + '\n' if guide else '') + open('i18n/engine.js').read() + ('\n' + open('i18n/guide.js').read() if guide else '')
blk = mark + '<script>\n' + js.replace('</script', '<\\/script') + '\n</script><!--/i18n-->'
i = s.rfind('</body>'); s = (s[:i] + blk + '\n' + s[i:]) if i >= 0 else (s.rstrip() + '\n' + blk + '\n')
H0 = '<script>window.__h0=location.hash</script><!--h0-->'
if guide and H0 not in s: s = H0 + '\n' + s
open(page, 'w').write(s); print(page, len(s))
