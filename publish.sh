#!/bin/bash

mv docs/CNAME /tmp

vendor/bin/sculpin generate --env=prod --clean

rm -rf docs
mv output_prod docs
mv /tmp/CNAME docs

git add .
git commit -m "Add post"
git push origin master
