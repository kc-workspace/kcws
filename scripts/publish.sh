#!/usr/bin/env bash

echo "Publishing based on $EVENT_NAME event"

echo "Event payload located at: $EVENT_PATH"

echo "Event payload:"
cat "$EVENT_PATH"
