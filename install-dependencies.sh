#!/bin/bash
ls -d -- */ | grep -v 'node_modules' | parallel "npm i"