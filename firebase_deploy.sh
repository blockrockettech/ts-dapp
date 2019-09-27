#!/usr/bin/env bash

npm run build;

firebase use ts-hosted;

firebase deploy;