forever start -l forever-mockserver.log -a -w app.js
tail -f -n100 ~/.forever/forever-mockserver.log
