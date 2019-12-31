# Version config
TAG := $(shell git tag --points-at HEAD | sort --version-sort | tail -n 1)
LASTTAG := $(or $(shell git tag -l | sort -r -V | head -n 1),0.1.0)
SNAPINFO := $(shell date +%Y%m%d%H%M%S)git$(shell git log -1 --pretty=%h)
RELEASE := $(or $(BUILD_NUMBER), 1)
VERSION := $(or $(TAG:v%=%),$(LASTTAG:v%=%))-$(or $(BUILD_NUMBER), 1)$(if $(TAG),,.$(SNAPINFO))

# Executables
NPM = npm

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
	$(NPM) run prod

# Runs unit tests
.PHONY: test
test:
	$(NPM) prune
	$(NPM) install
	$(NPM) test

# Runs integration tests
.PHONY: integration
integration:

# Performs any tasks necessary before a release build
.PHONY: stage
stage:

# Publish packages
.PHONY: publish
publish: