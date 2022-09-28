# Version config
TAG := $(shell git tag --points-at HEAD | sort --version-sort | tail -n 1)
LASTTAG := $(or $(shell git tag -l | sort -r -V | head -n 1),0.1.0)
SNAPINFO := $(shell date +%Y%m%d%H%M%S)git$(shell git log -1 --pretty=%h)
RELEASE := $(or $(BUILD_NUMBER), 1)
VERSION := $(or $(TAG:v%=%),$(LASTTAG:v%=%))-$(or $(BUILD_NUMBER), 1)$(if $(TAG),,.$(SNAPINFO))

# Executables
DOCKER = docker
NPM = npm
JASMIN = node_modules/jasmine/bin/jasmine.js
SED = sed

# Integration test config
export BC_TEST_DELAY := 5
IMAGE := circleci/node:9
SCMROOT := $(shell git rev-parse --show-toplevel)
PWD := $(shell pwd)
CACHE := $(HOME)/.local/share/blockchyp/itest-cache
CONFIGFILE := $(HOME)/.config/blockchyp/sdk-itest-config.json
CACHEPATHS := $(dir $(CONFIGFILE)) $(HOME)/.npm $(HOME)/.config/configstore
ifeq ($(shell uname -s), Linux)
HOSTIP = $(shell ip -4 addr show docker0 | grep -Po 'inet \K[\d.]+')
else
HOSTIP = host.docker.internal
endif

# Default target
.PHONY: all
all: clean build test

# Cleans build artifacts
.PHONY: clean
clean:
	$(RM) -rf node_modules

# Compiles the package
.PHONY: build
build:
	$(NPM) install
	$(NPM) run prod

# Runs unit tests
.PHONY: test
test:
	$(NPM) prune
	$(NPM) install
	$(NPM) test

# Runs integration tests
.PHONY: integration
integration: build
	$(if $(LOCALBUILD), \
		$(JASMIN) $(if $(TEST),itest/*$(TEST)*Spec.js,itest/*Spec.js), \
		$(foreach path,$(CACHEPATHS),mkdir -p $(CACHE)/$(path) ; ) \
		sed 's/localhost/$(HOSTIP)/' $(CONFIGFILE) >$(CACHE)/$(CONFIGFILE) ; \
		$(DOCKER) run \
		-u $(shell id -u):$(shell id -g) \
		-v $(SCMROOT):$(SCMROOT):Z \
		-v /etc/passwd:/etc/passwd:ro \
		$(foreach path,$(CACHEPATHS),-v $(CACHE)/$(path):$(path):Z) \
		-e BC_TEST_DELAY=$(BC_TEST_DELAY) \
		-e HOME=$(HOME) \
		-w $(PWD) \
		--init \
		--rm -it $(IMAGE) \
		bash -c "$(JASMIN) $(if $(TEST),itest/*$(TEST)*Spec.js,itest/*Spec.js)")

# Performs any tasks necessary before a release build
.PHONY: stage
stage:
	$(SED) -i'' 's/"version": ".*",/"version": "$(VERSION)",/' package.json

# Publish packages
.PHONY: publish
publish:
	$(NPM) publish
