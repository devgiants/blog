#!/bin/bash

vendor/bin/sculpin generate --no-interaction --clean --env=prod
rm -rf docs
mv output_prod docs
