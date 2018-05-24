#!/usr/bin/env bash

if [ $TRAVIS_BRANCH = 'master' ]
then
    export JEKYLL_ENV=production
else
    export JEKYLL_ENV=development
fi
npm run deploy
bundle exec jekyll build
