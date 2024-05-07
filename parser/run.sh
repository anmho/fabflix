#!/bin/bash

set -e
./mvnw install
./mvnw clean package
java -cp target/fabflix-xml-parser-0.0.1-SNAPSHOT-jar-with-dependencies.jar Main