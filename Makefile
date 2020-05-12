SHELL=/bin/bash

all: build backend_node_modules

clean:
	rm -fr build node_modules

build: ts_build generate_schemas

generate_schemas: build/js/model/model.json

build/js/%.json: ts/%.ts
	@mkdir $(@D) 2>/dev/null || true
	typescript-json-schema $< "*" -o $@ --required

ts_build:
	@mkdir build 2>/dev/null || true
	tsc --project tsconfig.json

ts_watch:
	@mkdir build 2>/dev/null || true
	tsc --watch --pretty --project tsconfig.json

node_modules: package.json package-lock.json
	npm install
	touch $@

backend_node_modules:
	rm -fr $@ $@.tmp
	mkdir -p $@.tmp/nodejs
	cp package.json package-lock.json $@.tmp/nodejs
	cd $@.tmp/nodejs; npm install --production
	touch $@.tmp
	mv $@.tmp $@

stackoutputs.yml: serverless.yml
	rm -f $@ $@.tmp
	sls info -v | grep -A 1000 '^Stack Outputs$$' | tail -n +2 > $@.tmp
	mv $@.tmp $@

deploy_lambda_restapi:
	rm -fr /tmp/lambda.zip
	find build -name "*.js" -or -name "*.js.map" | xargs zip -u -9 /tmp/lambda.zip
	aws lambda update-function-code --function-name gallerykiosk-$$STAGE-restapi --zip-file fileb:///tmp/lambda.zip --publish
