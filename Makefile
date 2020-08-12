SHELL=/bin/bash

all: build backend_node_modules

test:
	jest

clean:
	rm -fr build node_modules

build: ts_build

ts_build: schemas_generate
	@mkdir build 2>/dev/null || true
	tsc --project tsconfig.json

ts_watch:
	@mkdir build 2>/dev/null || true
	tsc --watch --pretty --project tsconfig.json

node_modules: package.json package-lock.json
	npm install
	touch $@

backend_node_modules: package.json package-lock.json
	rm -fr $@ $@.tmp
	mkdir -p $@.tmp/nodejs
	cp package.json package-lock.json $@.tmp/nodejs
	cd $@.tmp/nodejs; npm install --production
	touch $@.tmp
	mv $@.tmp $@

deploy_lambda_restapi:
	rm -fr /tmp/lambda.zip
	find build -name "*.js" -or -name "*.js.map" | xargs zip -u -9 /tmp/lambda.zip
	aws lambda update-function-code --function-name gallerykiosk-$$STAGE-restapi --zip-file fileb:///tmp/lambda.zip --publish

stackoutputs.json: serverless.yml
	rm -f $@ $@.tmp
	sls info | grep testapikey | sed 's/^ *//' > $@.tmp
	sls info -v | grep -A 1000 '^Stack Outputs$$' | tail -n +2 >> $@.tmp
	yq r -j $@.tmp > $@

schemas_generate:
	node ts/model/schema-generator.js

schemas_watch:
	node ts/model/schema-generator.js --watch
