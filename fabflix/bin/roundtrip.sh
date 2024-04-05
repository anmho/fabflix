#!/bin/bash


# Silent and suppress response output
curl -s -o /dev/null \
  -w "Roundtrip Time: %{time_total} seconds\n" "http://54.67.0.91:8080/api/movies"