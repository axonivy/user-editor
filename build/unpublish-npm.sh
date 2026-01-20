#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

npm unpublish "@axonivy/user-editor@${1}" --registry $REGISTRY
npm unpublish "@axonivy/user-editor-protocol@${1}" --registry $REGISTRY