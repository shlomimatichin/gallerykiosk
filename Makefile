SHELL=/bin/bash

all: build

clean:
	rm -fr build node_modules

build: ts_build

ts_build:
	@mkdir build 2>/dev/null || true
	tsc --project tsconfig.json

ts_watch:
	@mkdir build 2>/dev/null || true
	tsc --watch --pretty --project tsconfig.json

node_modules: package.json package-lock.json
	npm install
	touch $@

stackoutputs.yml: serverless.yml
	rm -f $@ $@.tmp
	sls info -v | grep -A 1000 '^Stack Outputs$$' | tail -n +2 > $@.tmp
	mv $@.tmp $@

deploy_lambda_restapi:
	rm -fr /tmp/lambda.zip
	find build -name "*.js" -or -name "*.js.map" | xargs zip -u -9 /tmp/lambda.zip
	aws lambda update-function-code --function-name gallerykiosk-$$STAGE-restapi --zip-file fileb:///tmp/lambda.zip --publish
