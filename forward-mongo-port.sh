#!/bin/bash
podPort=27017
localPort=37027

echo "Pod's: ${1} port: ${podPort} forwarded to local port: ${localPort}"
kubectl port-forward "${1}" ${localPort}:${podPort}
