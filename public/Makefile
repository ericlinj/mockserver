SRC = $(wildcard js/*/*.js)
HTML = $(wildcard js/*/*.html)
TEMPLATES = $(HTML:.html=.js)

build: components $(SRC) $(TEMPLATES)
	@component build

components: component.json
	@component install

%.js: %.html
	@component convert $<

clean:
	rm -fr build

.PHONY: clean
