#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

pnpm unpublish "@axonivy/user-editor@${1}" --registry $REGISTRY
pnpm unpublish "@axonivy/user-editor-protocol@${1}" --registry $REGISTRY